/*eslint-disable*/
require('../node_modules/iconv-lite');
import { Server } from '../src/server';
import request from "supertest";
const expressApp = new Server();
let tokens;



function run() {
  try {
    // start server
    expressApp.Start();
    // Test one
    console.log(tokens);

    testOne();
     
  } catch (e) {
    console.error(e);
  } 
}


function testOne() {
  describe("User Sign up", () => {
    test(`Password Policy Validation`, async () => {
      const res = await request(expressApp.app)
        .post('/auth/signup')
        .send({
          "preferred_username": "noPassword@gmail.com",
          "password": "123",
          "accepted_legal_version": "1.0.1",
          "given_name": "foo",
          "family_name": "bar"
        })
      expect(res.statusCode).toEqual(406)
      expect(res.body).toHaveProperty('name')
    }, 30000);
    test(`Valid Signup`, async () => {
      const res = await request(expressApp.app)
        .post('/auth/signup')
        .send({
          "preferred_username": "test@gmail.com",
          "accepted_legal_version": "1.0.1",
          "password": "Password@1",
          "given_name": "foo",
          "family_name": "bar"
        })
      expect(res.statusCode).toEqual(409)
    }, 30000);
  })
}

run();


// // describe('Post Endpoints', () => {
// //   it('should create a new post', async () => {
// //     const res = await request(expressApp.app)
// //       .get('/user');

// //     console.log(res);

// //     expect(res.statusCode).toEqual(200)
// //     //expect(res.body).toHaveProperty('post')
// //   })
// // })


// let token = null;



// describe("User API", async () => {
//   it('should get a valid token for user: user1', async function (done) {
//     request(expressApp.app)
//       .get("/user")
//       .set('Authorization', 'Bearer ' + token)
//       .expect(200, done);
//   });
// })




// function loginUser() {
//   return function (done) {

//     request(expressApp.app)
//       .post('/auth/login')
//       .send({
//         username: "bradleyhenderson22@gmail.com",
//         password: "Password@1"
//       })
//       .end(function (_err, res) {
//         console.log(res)
//         if (res && res.cookies) {
//           token = res.cookies['jwt'];
//         }
//         //  return token;

//         console.log(token);
//         //token = res.body.token; // Or something
//         done();
//       });
//   };
// }