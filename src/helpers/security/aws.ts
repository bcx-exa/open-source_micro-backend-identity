import AWS from "aws-sdk";

export function credsConfigLocal(): void {
  try {
    const config = new AWS.Config({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.REGION,
    });

    AWS.config.update(config);
  } catch (error) {
    console.error(error);
  }
}
