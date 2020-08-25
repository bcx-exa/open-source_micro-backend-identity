
import AWS from "aws-sdk";


// DynamoDB Scan Tables
export const dynamoScan = async (params:any): Promise<any> => {
  try {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const scanResults = [];
    let items;
    do{
        items =  await documentClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey != "undefined");
    return scanResults;
  }  
  catch(error) {
    handleCommonErrors(error);
  }  
};

// DynamoDB Query Tables - To be tested
export const dynamoQuery = async (params) => {   
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const scanResults = [];
    let items;
    do{
        items =  await documentClient.query(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey != "undefined");
    return scanResults;
};


function handleCommonErrors(err) {
    switch (err.code) {
        case 'InternalServerError':
            console.error(`Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'ProvisionedThroughputExceededException':
            console.error(`Request rate is too high. If you're using a custom retry strategy make sure to retry with exponential back-off.` + `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`);
            return;
        case 'ResourceNotFoundException':
            console.error(`One of the tables was not found, verify table exists before retrying. Error: ${err.message}`);
            return;
        case 'ServiceUnavailable':
            console.error(`Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'ThrottlingException':
            console.error(`Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'UnrecognizedClientException':
            console.error(`The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying.` + `Error: ${err.message}`);
            return;
        case 'ValidationException':
            console.error(`The input fails to satisfy the constraints specified by DynamoDB, ` + `fix input before retrying. Error: ${err.message}`);
            return;
        case 'RequestLimitExceeded':
            console.error('Throughput exceeds the current throughput limit for your account, ' + `increase account level throughput before retrying. Error: ${err.message}`);
            return;
        default:
            console.error(`An exception occurred, investigate and configure retry strategy. Error: ${err.message}`);
            return;
    }
}