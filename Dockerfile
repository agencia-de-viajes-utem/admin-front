# Use an official Node.js runtime as the base image
FROM node:20

ENV NODE_OPTIONS=--openssl-legacy-provider

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Define the command to run your app
CMD ["npm", "run", "dev"]