![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white) ![Open Source Love Badge](https://badges.frapsoft.com/os/v1/open-source.svg?v=103) ![MIT License Badge](https://img.shields.io/badge/license-MIT-green)
# Cascade

**“Where Everyone Communicates and Performs”**
## Table of Contents
- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation Instructions](#installation-instructions)
- [Usage](#usage)
- [License](#license)

## Introduction
### What is Cascade?
Cascade is a web app that helps organizations, companies, and teams monitor and control their performance  
through communication and feedback loops.

### Why do we need Cascade?
Cascade:
- Establishes clear communication across management levels.
- Provides tools for reflecting on performance.
- Stores data securely and accessibly.
- Motivates performance through anonymized feedback.

## Technologies Used
  - **Documentation & API-Documentation**: JSDoc and Swagger
  - **Backend**: Node.js and Express.js
  - **Database**: MongoDB, Mongoose (ODM)
  - **Validation**: Joi, express-validation
  - **Middleware**: Multer, morgan
  - **Containerization**: Docker, Docker-Compose
  - **Testing**: Mocha, Chai, and Sinon
  - **Cloud Storage**: AWS

## Features
### Current Features
- Authentication of users using JWT and Refresh Tokens
- RBAC for authroizing user on certain APIs
- Ability to create Companies, Departments, and Roles
- Assign Tasks and Objectives to different roles
- Uploading, downloading and deleting documents for tasks

### Features Backlog
- Comments
- Feedbacks

## Installation Instructions
To get started with Cascade, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AAEmara/Cascade.git
   cd Cascade
   ```
2. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```
3. **Set up environment variables**: Create a `.env` file in the server directory and add the necessary environment variables (e.g., AWS credentials, database connection strings).
4. **Start the services using Docker Compose**:
   ```bash
   cd ..
   docker-compose up
   ```
## Usage
To access the Swagger UI for API documentation, open your browser and navigate to:
`http://localhost:5000/api-docs`


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
