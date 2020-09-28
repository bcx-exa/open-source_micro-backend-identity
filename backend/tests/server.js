const express = require('express')
const app = express()
const port = 3000
const { Provider } = require('oidc-provider');
const configuration = {
  // ... see the available options in Configuration options section
  features: {
    introspection: { enabled: true },
    revocation: { enabled: true },
  },
  formats: {
    AccessToken: 'jwt',
  },
  clients: [{
    client_id: 'foo',
    client_secret: 'bar',
    redirect_uris: ['http://lvh.me:8080/cb'],
    // + other client properties
  }],
  // ...
};

const oidc = new Provider('http://localhost:3000', configuration);

const prefix = '/oidc';
app.use(prefix, oidc.callback);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})