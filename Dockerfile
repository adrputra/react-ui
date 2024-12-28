# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm ci --loglevel=verbose

# Copy the entire project into the container
COPY . .

# Build the React app
RUN npm run build

# Install `serve` globally to serve the app
RUN npm install -g serve

# Expose the desired port
EXPOSE 3001

# Command to serve the React app
CMD ["serve", "-s", "build", "-l", "3001"]