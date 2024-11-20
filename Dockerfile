# Build stage
FROM node:iron-slim AS build
WORKDIR /build

# Configuring npm
RUN npm config set audit false

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application and db-migrator
RUN npm run build
RUN npm run build:db-migrator

# Publish stage
FROM node:iron-slim AS publish
WORKDIR /app

# Configuring npm
RUN npm config set audit false

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy node_modules and dist from the build stage
COPY --from=build /build/dist .

# Create non-root user
RUN groupadd -g 1001 appuser && useradd -u 1001 -g appuser -m -s /bin/bash appuser
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port 8080 for HTTP
EXPOSE 8080

# Command to run db-migrator and then the application
CMD ["sh", "-c", "node db-migrator apply-migrations && node main"]
