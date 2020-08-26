import { UserIdentityDB, IdentitySignIn, IdentitySignUp } from '../models/identity';
import { validatePasswordHash, generatePasswordHash, issueJWT } from '../helpers/crypto';
import { handleDynamoErrors } from '../helpers/dynamodb';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { ApiError } from '../helpers/error-handling';
// import * as EmailValidator from 'email-validator';
//import { phoneUtil } from 'google-libphonenumber';


export class IdentityService {
    public async SignUp(SignUp: IdentitySignUp): Promise<any> {
            const genPassHash = generatePasswordHash(SignUp.password);

            const salt = genPassHash.salt;
            const hash = genPassHash.genHash;
            const date = new Date();
            
            // Create new Identity dynamo db
            const Identity: UserIdentityDB = {
                identity_id: uuidv4(),
                salt: salt,
                preferred_username: SignUp.preferred_username,
                password: hash, // This is the hash
                given_name: SignUp.given_name,
                family_name: SignUp.family_name,
                picture: null,
                phone_number: "123",
                address: null,
                locale: null,
                email: SignUp.preferred_username,
                birth_date: null,
                email_verified: false,
                phone_number_verified: false,
                created_at: date,
                updated_at: date
            };

            const dynamo = new AWS.DynamoDB.DocumentClient();
            const putParams = { TableName: process.env.DB_TABLE_NAME, Item: Identity }

            const queryParams = {
                TableName: process.env.DB_TABLE_NAME,
                IndexName: 'by_preferred_username',
                KeyConditionExpression: '#preferred_username = :preferred_username',
                ExpressionAttributeNames: {
                    '#preferred_username': 'preferred_username'
                },
                ExpressionAttributeValues: {
                    ':preferred_username': SignUp.preferred_username
                }
              };
          
            const findIdentity = await dynamo.query(queryParams).promise();

            let jwt;
            
            if(findIdentity.Items.length == 0) {
                jwt = await dynamo.put(putParams)
                    .promise()
                    .then(() => { return issueJWT(Identity)})
                    .catch(e => { return handleDynamoErrors(e)});
            } else {
                throw new ApiError("User Already Exists", 409, "User already exists, please login!");
            }
               
            return jwt;

    }

    public async SignIn(SignIn: IdentitySignIn): Promise<any> {
            const dynamo = new AWS.DynamoDB.DocumentClient();
            const queryParams = {
                TableName: process.env.DB_TABLE_NAME,
                IndexName: 'by_preferred_username',
                KeyConditionExpression: '#preferred_username = :preferred_username',
                ExpressionAttributeNames: {
                    '#preferred_username': 'preferred_username'
                },
                ExpressionAttributeValues: {
                    ':preferred_username': SignIn.preferred_username
                }
              };
          
            const findIdentity = await dynamo.query(queryParams).promise();
            
            if(findIdentity.Items.length == 0) {
                throw new Error("Identity not found");
            }
            else {
                const validPassword = validatePasswordHash(SignIn.password, findIdentity.Items[0].password, findIdentity.Items[0].salt);

                const Identity: UserIdentityDB = findIdentity.Items[0] as UserIdentityDB;

                if(validPassword) return issueJWT(Identity);
                throw new Error("Unauthorized");
            }
        }
    public async GetIdentityById(identity_id: string): Promise<any> {
 
            const params = {
                TableName: process.env.DB_TABLE_NAME,
                KeyConditionExpression: '#identity_id= :identity_id',
                ExpressionAttributeNames: {
                    '#identity_id': 'identity_id'
                },
                ExpressionAttributeValues: {
                    ':identity_id': identity_id
                }
              };
              
              const dynamo = new AWS.DynamoDB.DocumentClient();
              const identityUser = await dynamo.query(params).promise();

              return identityUser;
    
        }
    }
