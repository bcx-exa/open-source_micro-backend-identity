import { Server } from "../src/server";
var request = require('supertest');
const expressApp = new Server();

var server = expressApp.app;

describe('GET /api/getDir', function () {
    it('login', loginUser());
    it('uri that requires user to be logged in', function (done) {
        request(server)
            .get('/api/getDir')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                console.log(res.body);
                done()
            });
    });
});


function loginUser() {
    return function (done) {
        request(server)
            .post('/oauth​/token_test')
            .expect(200)
            .end(onResponse);
        function onResponse(err) {
            if (err) return done(err);
            return done();
        }
    };
};