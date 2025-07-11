# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the React app
RUN npm run build



# Expose port
EXPOSE $PORT

# Start command
CMD ["sh", "-c", "serve -s build -p $PORT"]
