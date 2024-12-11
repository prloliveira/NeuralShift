# Dockerfile for Svelte project
FROM node:latest

# Install expect and postgresql-client
RUN apt-get update && apt-get install -y expect postgresql-client

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Copy the wait-for-db script
COPY wait-for-db.sh ./
RUN chmod +x wait-for-db.sh

# Command to run the app
CMD ["./wait-for-db.sh"]