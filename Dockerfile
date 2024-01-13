# Use an official Node runtime as a parent image
FROM node:lts-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Install app dependencies
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app using CMD which runs your script using node
CMD ["npm", "run", "start"]
