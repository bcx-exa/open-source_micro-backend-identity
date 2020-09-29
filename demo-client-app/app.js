
var express = require('express')
var app = express()
const port = 3333
const { AuthorizationCode } = require('simple-oauth2');

  const config = {
    client: {
      id: '10b865b7-2ba5-45e0-95c1-2d961082b9df',
      secret: '123'
    },
    auth: {
      tokenHost: 'http://localhost:7000',
      authorizeHost: 'http://localhost:7000',
    }
  };
 
  const client = new AuthorizationCode(config);

  const authorizationUri = client.authorizeURL({
    redirect_uri: 'http://localhost:3333/callback',
    scope: 'openid profile email phone',
    state: '3(#0/!~'
  });
 
  app.get('/auth', (req, res) => {
    console.log(authorizationUri);
    res.redirect(authorizationUri);
  });

  // Callback service parsing the authorization token and asking for the access token
  app.get('/callback', async (req, res) => {
  const { code } = req.query;
  const options = {
    code,
  };

  try {
    const accessToken = await client.getToken(options);

    console.log('The resulting token: ', accessToken.token);

    return res.status(200).json(accessToken.token);
  } catch (error) {
    console.error('Access Token Error', error.message);
    return res.status(500).json('Authentication failed');
  }
});

app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Github</a>');
});

 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
 