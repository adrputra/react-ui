# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN yarn install
RUN yarn add global serve
# Copy the entire project to the working directory
COPY . .

# Expose the desired port
# ARG PORT
EXPOSE 3001

# Define the command to run the application
RUN yarn build

CMD ["serve", "-s", "build", "-l", "3001"]
