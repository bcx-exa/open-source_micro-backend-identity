import { User, UserSignIn, UserSignUp } from '../models/user';
import { validatePasswordHash, generatePasswordHash, issueJWT } from '../helpers/crypto';
import { handleDynamoErrors } from '../helpers/dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from "../helpers/apiError";
import AWS from 'aws-sdk';

export class UserService {
    public async SignUp(SignUp: UserSignUp): Promise<any> {
        try {
            const genPassHash = generatePasswordHash(SignUp.password);

            const salt = genPassHash.salt;
            const hash = genPassHash.genHash;
      
            // Create new user dynamo db
            const user: User = {
                id: uuidv4(),
                username: SignUp.username,
                email: SignUp.email,
                salt: salt,
                password: hash,
                phoneNumber: SignUp.phoneNumber,
                phoneNumberVerified: false,
                emailVerified: false,
                firstName: SignUp.firstName,
                lastName: SignUp.lastName,
                address: SignUp.address,
                roles: ['user'],
                scopes: ['profile', 'email', 'phone_number']
            };

            const dynamo = new AWS.DynamoDB.DocumentClient();
            const putParams = { TableName: process.env.DB_TABLE_NAME, Item: user }

            const queryParams = {
                TableName: process.env.DB_TABLE_NAME,
                IndexName: 'byEmail',
                KeyConditionExpression: '#email = :email',
                ExpressionAttributeNames: {
                    '#email': 'email'
                },
                ExpressionAttributeValues: {
                    ':email': SignUp.email
                }
              };
          
            const findUser = await dynamo.query(queryParams).promise();

            let jwt;
            
            if(findUser.Items.length == 0) {
                jwt = await dynamo.put(putParams)
                    .promise()
                    .then(() => { return issueJWT(user)})
                    .catch(e => { return handleDynamoErrors(e)});
            } else {
                jwt = new ApiError("User Already Exists", 400, "User Already Exist");
            }
               
            return jwt;
           
        }
        catch(e) {
            handleDynamoErrors(e);
        }
    }

    public async SignIn(SignIn: UserSignIn): Promise<any> {
        try {

            const dynamo = new AWS.DynamoDB.DocumentClient();
            const queryParams = {
                TableName: process.env.DB_TABLE_NAME,
                IndexName: 'byEmail',
                KeyConditionExpression: '#email = :email',
                ExpressionAttributeNames: {
                    '#email': 'email'
                },
                ExpressionAttributeValues: {
                    ':email': SignIn.username
                }
              };
          
            const findUser = await dynamo.query(queryParams).promise();
            
            if(findUser.Items.length == 0) return new ApiError("User Does Not Exist", 404, "User Does Not Exist");
            else {
                const validPassword = validatePasswordHash(SignIn.password, findUser.Items[0].password, findUser.Items[0].salt);

                const user: User = findUser.Items[0] as User;

                if(validPassword) return issueJWT(user);
                else return new ApiError("Incorrect Password", 401, "Incorrect Password");
            }
            
            
           
        }
        catch(e) {
            handleDynamoErrors(e);
        }
    }

    public GetUserById(id: string): any {
        try {
            const params = {
                TableName: process.env.DB_TABLE_NAME,
                KeyConditionExpression: 'HashKey = :hkey',
                ExpressionAttributeValues: {
                  ':hkey': id,
                }
              };
              
              const dynamo = new AWS.DynamoDB.DocumentClient();
              return dynamo.query(params)
                .promise()
                .then(d => { return d })
                .catch(e => { return handleDynamoErrors(e) });
        }
        catch(e)
        {
            console.error(e);
        }
    }
}