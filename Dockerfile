# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies
RUN yarn install

# Copy the entire project to the working directory
COPY . .

# Build the React app
RUN yarn build

# Install serve to serve the built files
RUN yarn global add serve

# Expose the desired port
EXPOSE 3001

# Command to serve the React app
CMD ["serve", "-s", "build", "-l", "3001"]
