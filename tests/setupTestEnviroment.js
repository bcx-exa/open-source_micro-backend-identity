/* eslint-disable */

jest.setTimeout(100000); // in milliseconds

global.beforeAll(() => {
    await expressApp.Start();
    process.env.test_agent = request(expressApp.app);
    Console.log("Starting Test Enviroment")
});