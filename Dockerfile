# Stage 1: Build Stage
FROM oven/bun:edge-slim AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package files to the working directory
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install --no-cache

# Copy the rest of the application code
COPY . .

# Build the React app
RUN bun run build

# Stage 2: Serve Stage
FROM caddy:alpine

# Set working directory for Caddy's static file server
WORKDIR /usr/share/caddy

# Copy build output from the build stage
COPY --from=builder /app/build ./ui

# Expose the port used by Caddy
EXPOSE 3001

# Start the server
CMD ["caddy", "file-server", "--root", "/usr/share/caddy/ui", "--listen", ":3001"]
