# Introduction ![buildstatus](docs/assets/passing.svg)

![bcxexa](docs/assets/exa_backgrond.jpg)

 • [Website](https://www.bcx.co.za/exa/) • [Docs](docs/architecture/architecture.svg)

This is opinionated boilerplate code that aims to meet the requirements set out by our technical architecture team.

# This is still a work in progress, the template isn't ready yet

Main objective

- [x] 1. Create a Plug and Play Identity microservice

Features

- [x] Auto SES Creating for 

This template uses our [template_micro_backend_core](https://github.com/bcx-exa/template_micro_backend_core) version 1.0.0 as it's base.

---
# Quick Start 


### Install IDE, Nodejs & AWS CLI

1. Install VSCode: https://code.visualstudio.com/download
2. Install Nodejs: https://nodejs.org/en/download/
3. Install AWS CLI: https://awscli.amazonaws.com/AWSCLIV2.msi.
4. Fork or clone the repo

---
### Initial Setup
---
   1. Install Serverless globally
```bash
npm install -g serverless
```
2. Configure your serverless to use the correct AWS profile
```bash
serverless config credentials --provider aws --key <YOURKEY> --secret <YOURSECRET> --profile <PROFILENAME>
```
3. Install all packages
```bash
npm install
```
4. Configure the serverless framework environment variables under path => cicd/env
```bash
DomainName: <YOUR DOMAIN>
Region: <REGION>
AcmStackName: <YOUR ACM STACK NAME>
StackName: <YOUR STACK NAME>
HostedZoneId: <YOUR HOSTED ZONE ID>
```

5. (Optional) Add a .env file to the root directory of your project.  (Same level as package.json)
```bash
PORT=<PORT>
NODE_ENV=<ENV>
APP_NAME=<APP_NAME>
```
> The .env file is used by the node application when you do local development. The environment files situated under the cicd folder is specific to the deployment of resources in AWS.
---  
## For Local Development
---
 - Uses node and nodemon (Rapid Development)
```bash
npm run dev 
```
 - Uses serverless offline (AWS Simulate)
```bash
npm run offline 
```
---
## For Dev/UAT/Prod Deployments
---
### Pre-Requisites & Notes
---
- You need a domain registed using Route53 in the same AWS account for this to work. In the background, we are creating a certificate used by the API Gateway.  Check out [this](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html)  link for more info.
- We recommend using subdomains for each micro-service you create. api.yourdomain.co.za appose to yourdomain.co.za/api.  This is to keep your certificates and domains isolated for each micro-service.


```bash
npm run deploy:dev
npm run deploy:uat
npm run deploy:prod
```
> Note: Lambda cold start plays a role in showing the initial load of swagger ui interface.  

> Note: Initial deployments can take up to 40 min. This because certificates needs to be validated and DNS needs to propogate.  
# Details Explanations

## Requirements Mapping Table

| Technical Component | Business Requirement       |
| ------------------- | -------------------------- |
| Serverless          | Independantly Deployable   |
| Serverless Offline  | Local Debugging            |
| Nodemon             | Local Debugging (Rapid)    |
| TSOA                | Documented                 |
| Swagger-UI          | Documented                 |
| X-Ray               | Traceable                  |
| Express             | Portable                   |
| Typescript          | Independantly Maintainable |
| Eslint              | Independantly Maintainable |
| Jest                | Independantly Testable     |

---
## Available Deployment Environments
The project has the ability to deploy on.

- AWS (API Gateway, Lambda, ACM & Route53) - Full Featured
- Docker Container running Node.js - No Auto Domain Setup 
- Linux Server/Windows Server running Node.js - No Auto Domain Setup

See the architecture below

![Architecture](docs/architecture/architecture.svg)

You can modify the architecture.drawio file inside the docs file should you wish to do so.

# Recommended VSCode Extensions

- I found [this](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) vscode extension to be useful as it allows you to draw and view draw.io files inside the editor.  
- Also, [this](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) markdown extention is also pretty cool.  Once installed, press ctrl-shift-v to view the markdown file.

# To-Do's & Bugs

 - Still need to add these

# Version

- 1.0.0 

# Contributions

- Serverless team
- Cloudformation team
- Typescript 
- BCX Team
