# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start the Vite dev server with external access enabled
CMD ["npm", "run", "dev", "--", "--host"]
