// import { Controller, Body, Route, Post, Tags } from 'tsoa';
// //import AWSXRay from 'aws-xray-sdk';
// import AWS from 'aws-sdk';

// @Route('SignUp') // route name => localhost:xxx/SignUp
// @Tags('SignUpController') // => Under SignUpController tag    
// export class SignUpController extends Controller {    

//   @Post()  //specify the request type
//   async SignUpPost( @Body() SignUpRequest: SignUpRequest): Promise<any> {    
//     try {
//       const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
//     const params = {
//         ClientId: '3gcs8g3sh4s8n8157ujm4fngj2', //Need to automate this
//         Password: SignUpRequest.password, 
//         Username: SignUpRequest.username,
//         UserAttributes: [
//           {
//               Name: 'profile',
//               Value: SignUpRequest.username
//           },
//           {
//             Name: 'email',
//             Value: SignUpRequest.username
//           },
//           {
//             Name: 'name',
//             Value: SignUpRequest.givenName
//           },
//           {
//             Name: 'given_name',
//             Value: SignUpRequest.givenName
//           },
//           {
//             Name: 'phone_number',
//             Value: SignUpRequest.phoneNumber
//           },
//           {
//             Name: 'family_name',
//             Value: SignUpRequest.familyName
//           }]
//       };

//       const result = await cognitoidentityserviceprovider.signUp(params).promise();

//       return result;
//     }
//     catch(e)
//     {
//       return e;
//     }
   
//   }
// }

// export interface SignUpRequest { username: string, password: string, givenName: string, familyName: string, phoneNumber: string }
