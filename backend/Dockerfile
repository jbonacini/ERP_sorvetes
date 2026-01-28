# Base stage
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy application source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client for production
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
