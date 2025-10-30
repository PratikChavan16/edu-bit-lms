# ============================================
# Multi-stage Dockerfile for Node.js API Service
# Optimized for security, size, and build speed
# ============================================

# Stage 1: Dependencies (cached layer)
FROM node:20-alpine AS dependencies

# Install build dependencies for native modules
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: Build (compile TypeScript)
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript to JavaScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# ============================================
# Stage 3: Development (with hot reload)
# ============================================
FROM node:20-alpine AS development

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -s /bin/sh -D nodejs

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy source code
COPY --chown=nodejs:nodejs . .

# Generate Prisma Client
RUN npx prisma generate

USER nodejs

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start with ts-node-dev for hot reload
CMD ["npm", "run", "dev"]

# ============================================
# Stage 4: Production (minimal, secure)
# ============================================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
# tini is an alternative: RUN apk add --no-cache tini
RUN apk add --no-cache dumb-init curl

# Create non-root user
RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -s /bin/sh -D nodejs

WORKDIR /app

# Copy production dependencies
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy Prisma schema for migrations
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Copy package.json for scripts
COPY --chown=nodejs:nodejs package*.json ./

# Set NODE_ENV to production
ENV NODE_ENV=production

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to properly handle signals (SIGTERM for graceful shutdown)
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/index.js"]

# ============================================
# Build Instructions:
# ============================================
#
# Development:
# docker build --target development -t bitflow-api:dev .
# docker run -p 3000:3000 -v $(pwd)/src:/app/src bitflow-api:dev
#
# Production:
# docker build --target production -t bitflow-api:latest .
# docker run -p 3000:3000 bitflow-api:latest
#
# With docker-compose:
# docker-compose up --build
#
# ============================================
# Security Best Practices Implemented:
# ============================================
# ✅ Multi-stage build (smaller final image)
# ✅ Non-root user (nodejs:nodejs 1001:1001)
# ✅ Minimal alpine base image
# ✅ Only production dependencies in final stage
# ✅ dumb-init for proper signal handling
# ✅ Health check endpoint
# ✅ Explicit EXPOSE port
# ✅ No secrets in image (use env vars or Secrets Manager)
# ✅ Cache-optimized layers (dependencies before source)
#
# ============================================
# Operational Notes:
# ============================================
# - The container will gracefully shutdown on SIGTERM
# - Prisma migrations should run separately (init container or script)
# - Use .dockerignore to exclude node_modules, .git, etc.
# - Set resource limits in production (memory, CPU)
# - Use --read-only filesystem in production if possible
# - Mount secrets as files or use AWS Secrets Manager
#
# Example production deployment with resource limits:
# docker run -d \
#   --name bitflow-api \
#   --memory="512m" \
#   --cpus="0.5" \
#   --read-only \
#   --tmpfs /tmp \
#   -p 3000:3000 \
#   -e DATABASE_URL="$DATABASE_URL" \
#   -e REDIS_HOST="$REDIS_HOST" \
#   bitflow-api:latest
