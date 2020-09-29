
var express = require('express')
var app = express()
var ClientOAuth2 = require('client-oauth2')
const port = 3333
 
var githubAuth = new ClientOAuth2({
  clientId: '10b865b7-2ba5-45e0-95c1-2d961082b9df',
  clientSecret: '123',
  accessTokenUri: 'http://localhost:7000/oauth/token',
  authorizationUri: 'http://localhost:7000/dialog/authorize',
  redirectUri: 'http://localhost:3333/auth/github',
  scopes: ['openid', 'profile', 'email', 'phone']
})

app.get('/auth/github', function (req, res) {
  var uri = githubAuth.code.getUri()
 
  res.redirect(uri)
})
 
app.get('/auth/github/callback', function (req, res) {
  githubAuth.code.getToken(req.originalUrl)
    .then(function (user) {
      console.log(user) //=> { accessToken: '...', tokenType: 'bearer', ... }
 
      // Refresh the current users access token.
      user.refresh().then(function (updatedUser) {
        console.log(updatedUser !== user) //=> true
        console.log(updatedUser.accessToken)
      })
 
      // Sign API requests on behalf of the current user.
      user.sign({
        method: 'get',
        url: 'http://example.com'
      })
 
      // We should store the token into a database.
      return res.send(user.accessToken)
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })