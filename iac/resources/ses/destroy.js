const auth = require('./helpers/aws');
const dotenv = require('dotenv');
const ses = require('./components/ses');

async function run() {
    try {
        // locat env variables from .env file in root
        dotenv.config();
        auth.credsConfigLocal();

        
    }
    catch(e)
    {
        console.error(e);
    }
 }

 run();