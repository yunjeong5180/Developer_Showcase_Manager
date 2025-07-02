# Multi-stage build for Vue.js app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Set npm cache directory to avoid conflicts
RUN npm config set cache /tmp/.npm --global

# Copy package files
COPY package*.json ./

# Install dependencies without cache
RUN npm ci --no-cache --no-optional

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install serve globally
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build /app/dist ./dist

# Expose port (Railway will set PORT env var)
EXPOSE $PORT

# Start the application
CMD ["sh", "-c", "serve -s dist -p $PORT"]