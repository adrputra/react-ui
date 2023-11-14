# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN yarn install

# Copy the entire project to the working directory
COPY . .

# Build the React app
# RUN npm run build

# Expose the desired port
EXPOSE 8889

# Define the command to run the application
CMD ["npm", "run", "Build"]
