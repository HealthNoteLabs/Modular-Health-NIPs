FROM node:18-slim

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json ./
# Assuming you might add a package-lock.json or yarn.lock later
COPY package-lock.json* ./
COPY yarn.lock* ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the application (if necessary)
# The package.json has a build script "tsup"
RUN npm run build

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["npm", "start"] 