
# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /build

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 3000   

# Start the application
CMD ["node", "index.js"]
