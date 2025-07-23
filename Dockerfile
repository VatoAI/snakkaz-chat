# SnakkaZ Docker Deployment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S snakkaz && \
    adduser -S snakkaz -u 1001

# Set permissions
RUN chown -R snakkaz:snakkaz /app
USER snakkaz

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start the server
CMD ["node", "server-production.cjs"]

# Labels for identification
LABEL maintainer="SnakkaZ Team"
LABEL version="1.0.0"
LABEL description="The chat app that DOMINATES all competitors!"
