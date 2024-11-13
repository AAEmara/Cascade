# Using an LTS Node.js runtime version as a partent image for the container
FROM node:20.9.0

# Setting the working directory (WD) inside the container
WORKDIR /usr/src/app

# Copying package(-lock).json  from the local machine to the working directory
COPY package*.json ./

# Installing dependencies listed in the package.json file
RUN npm install

# Copying all the files from the local project directory to the container's WD
COPY . .

# Informing Docker to listen on port 5000 (Mapping port 5000 on local machine)
EXPOSE 5000

# Specifying the command that would run our application
CMD ["npx", "nodemon", "server.js"]
