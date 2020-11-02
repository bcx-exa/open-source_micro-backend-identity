# Introduction ![buildstatus](docs/assets/passing.svg)

![bcxexa](docs/assets/exa_backgrond.jpg)

• [Website](https://www.bcx.co.za/exa/) • [Docs](docs/architecture/architecture.svg)

This is opinionated boilerplate code that aims to meet the requirements set out by our technical architecture team. Anyone is welcome to contribute!

Main objective

- [x] 1. Create a Plug and Play Identity Microservice that follows industry security standards. (Oauth 2.0, JWT)
- [x] 2. One command deployment. (Infrastructure & Application Code)

Features

- [x] Sign Up
- [x] Local Login
- [x] Social Login
- [x] Logout
- [x] Password Reset
- [x] Account Verification (Email & Phone Numbers)
- [x] SSO using JWT
- [x] Authorization using Oauth 2.0
- [x] Integration/E2E Testing
- [x] Granular User Permissions
- [x] Granular API Protection 
- [x] One command deployment

## Main Components & Packages

- Passport (Various Strategies)
- Aurora Serverless with Data API
- AWS Pinpoint (SMS & Email)
- AWS Lambda
- API Gateway
- Express
- Serverless Framework
- Typeorm
- TSOA
- Jest
- Swagger

---

# Quick Start

---

> Warning: Although using the code is absolutely free, the AWS resources required to run the microservice isn't. A full deployment of the solution will cost you money.
---
### Pre-Requisites & Notes

---

- You need an AWS account
- You need a domain registed using Route53 in the same AWS account. 
- We recommend using subdomains for each micro-service you create. api.yourdomain.co.za appose to yourdomain.co.za/api. This is to keep your certificates and domains isolated for each micro-service.

---

### Initial Setup

---

1.  Install Serverless globally

```bash
npm install -g serverless
```

2. Install all packages

```bash
npm install
```

3. Configure your serverless to use the correct AWS profile

```bash
serverless config credentials --provider aws --key <YOURKEY> --secret <YOURSECRET> --profile <PROFILENAME>
```

1. Create and configure your local and test env files inside your environments folder.

Filenames
- .env.local
- .env.test

```bash
AWS_ACCESS_KEY_ID=<YOUR KEY>
AWS_SECRET_ACCESS_KEY=<YOUR_SECRET>
AWS_PROFILE=<AWS_PROFILE_NAME>
ADMIN_PASSWORD=<ANY_PASSWORD>
HOSTED_ZONE_ID=<ROUTE_53_HOSTED_ZONE_ID>
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
FACEBOOK_CLIENT_ID=<YOUR_FACEBOOK_CLIENT_ID>
FACEBOOK_CLIENT_SECRET=<YOUR_FACEBOOK_CLIENT_SECRET>
```
---

### For Local Development

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
### For Dev/UAT/Prod Deployments
---

```bash
npm run deploy:dev
npm run deploy:uat
npm run deploy:prod
```
---
### Destroying environments Dev/UAT/Prod
---
```bash
npm run destroy:dev
npm run destroy:uat
npm run destroy:prod
```

> Note: Lambda cold start plays a role in showing the initial load of swagger ui interface.

> Note: Initial deployments can take up to 40 min. This because certificates needs to be validated and DNS needs to propogate.  You can fast track the process by logging into the console and creating the DNS records from the ACM section in N. Virgina region.

---
### Available Deployment Options
---

- AWS (API Gateway, Lambda, ACM & Route53) - Full Featured
- Docker Container running Node.js - No Auto Domain Setup
- Linux Server/Windows Server running Node.js - No Auto Domain Setup

See the architecture below

<img src="docs/architecture/architecture.svg" width='100%' height='100%' />

# Tests (Current Coverage 74.39 %)

```bash
npm run test
```

 # To Do's & Bugs
                                     
- Up Code Coverage on Facebook & Google flows
- Review & Clean up Docs Architecture folder
- Code Clean up
- Up code coverage on passport strategies
- How-To Video

# Version

- 1.0.0 Beta

# Contributions

- BCX Exa Team
- We would appriciate any contribution from the community