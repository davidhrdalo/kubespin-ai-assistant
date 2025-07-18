FROM alpine:latest

# Install SQLite
RUN apk add --no-cache sqlite

# Create data directory
RUN mkdir -p /data

# Set permissions
RUN chown -R 1001:1001 /data

# Switch to non-root user
USER 1001

# Copy SQL initialization file
COPY init.sql /init.sql

# Initialize database with SQL file
RUN sqlite3 /data/ai_assistant.db < /init.sql

# Expose data directory
VOLUME /data

# Default command to keep container running
CMD ["tail", "-f", "/dev/null"] 