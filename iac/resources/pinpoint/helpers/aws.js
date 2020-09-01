const AWS = require('aws-sdk');

function credsConfigLocal() {
    try {
      var config = new AWS.Config({
        accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY, region: process.env.REGION
      });

      AWS.config.update(config);
    }
    catch (error) {
      console.error(error);
    }
  }
async function getAccountId() {
  var sts = new AWS.STS();
  const acount = await sts.getCallerIdentity().promise();

  return acount.Account;
}
  module.exports = { getAccountId, credsConfigLocal };