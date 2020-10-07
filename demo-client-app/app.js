
var express = require('express')
var app = express()
const port = 3333
const { AuthorizationCode } = require('simple-oauth2');

  const config = {
    client: {
      id: '28b52fe4-2d05-47f5-b377-154f56eba8d9',
      secret: '123'
    },
    auth: {
      tokenHost: 'http://localhost:7000',
      authorizeHost: 'http://localhost:7000',
    },
    http: {
      json: 'force'
    },
    options: {
      authorizationMethod: 'body'
    }
  };
 
  const client = new AuthorizationCode(config);

  const authorizationUri = client.authorizeURL({
    redirect_uri: 'http://localhost:3333/callback',
    scope: 'openid profile email phone',
    state: '3(#0/!~'
  });
  
  // initiates authorization request
  app.get('/home', (req, res) => {
    res.redirect(authorizationUri);
  });

  // Callback service parsing the authorization token and asking for the access token
  app.get('/callback', async (req, res) => {
    const { code } = req.query;
    const options = {
      code,
    };

    try {
      const accessToken = await client.getToken(options, {json: true});

      console.log('The resulting token: ', accessToken);

return res.status(200).json(accessToken);

    } catch (error) {
      console.error('Access Token Error', error.message);
      return res.status(500).json('Authentication failed');
    }
  });

  app.get('/refresh', async (req, res) => {
    if (accessToken.expired()) {
      try { 
        const refreshParams = {
          scope: 'openid profile email phone'
        };

        accessToken = await accessToken.refresh(refreshParams);
      } catch (error) {
        console.log('Error refreshing access token: ', error.message);
      }
    }
  });
  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
 