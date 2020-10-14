import { ResourceOwnerPassword } from 'simple-oauth2';

export async function getAccessToken() {
  try {
    const config = {
      client: {
        id: 'b69d3b97-84f8-4503-8b13-c212603827e6',
        secret: '123'
      },
      auth: {
        tokenHost: 'http://localhost:' + process.env.PORT,
        authorizeHost: 'http://localhost:' + process.env.PORT,
      },
      http: {
        json: 'force'
      },
      options: {
        authorizationMethod: 'body'
      }
    };
    const client = new ResourceOwnerPassword(config);
  
    const tokenParams = {
      username: "admin@freedatsandbox.xyz",
      password: "ZAQ!@wsx3456",
      scope: 'openid profile email phone',
    };
  
    try {
      const accessToken = await client.getToken(tokenParams);
      return accessToken;

    } catch (error) {
      console.log('Access Token Error', error.message);
    }
  
  } catch (e) {
    console.error(e);
  }
}