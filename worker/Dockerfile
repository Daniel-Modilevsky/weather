FROM node:20-alpine

WORKDIR /app

# Install wait-for-it script
RUN apk add --no-cache bash

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('ioredis').createClient({ host: process.env.REDIS_HOST || 'redis', port: parseInt(process.env.REDIS_PORT || '6379') }).ping().then(() => process.exit(0)).catch(() => process.exit(1))"

# Start the worker with wait script
CMD ["sh", "-c", "node -e \"require('ioredis').createClient({ host: process.env.REDIS_HOST || 'redis', port: parseInt(process.env.REDIS_PORT || '6379') }).ping().then(() => process.exit(0)).catch(() => process.exit(1))\" && npm start"] 