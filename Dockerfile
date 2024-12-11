# Use Node.js as base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Expose the development server port
EXPOSE 5173

# Default command to run the dev server
CMD ["npm", "run", "dev", "--", "--host"]
