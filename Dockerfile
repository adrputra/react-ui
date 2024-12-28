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

# Debug: List the contents of the build directory
RUN ls -la ./build

# Create the /build/ui directory and move files if they exist
RUN mkdir -p ./build/ui \
    && [ -d ./build/static ] && mv ./build/static ./build/ui || echo "No static directory to move" \
    && [ -d ./build/assets ] && mv ./build/assets ./build/ui || echo "No assets directory to move" \
    && [ -d ./build/favicon ] && mv ./build/favicon ./build/ui || echo "No favicon directory to move" \
    && [ -f ./build/manifest.json ] && mv ./build/manifest.json ./build/ui || echo "No manifest.json to move" \
    && [ -f ./build/assets-manifest.json ] && mv ./build/assets-manifest.json ./build/ui || echo "No assets-manifest.json to move" \
    && [ -f ./build/index.html ] && mv ./build/index.html ./build/ui || echo "No index.html to move" \
    && [ -f ./build/_redirects ] && mv ./build/_redirects ./build/ui || echo "No _redirects to move"

CMD [ "bun", "serve", "build", "-l", "3001" ]
