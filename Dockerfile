# Use an official Node.js runtime as the base image
FROM oven/bun:slim AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json bun.lockb ./

# Install the dependencies
RUN bun install --no-cache
RUN bun install serve@14.2.1
# Copy the entire project to the working directory
COPY . .

# Expose the desired port
# ARG PORT
EXPOSE 3001

# Define the command to run the application
RUN bun run build

CMD [ "bun", "serve", "build", "-l", "3001" ]
