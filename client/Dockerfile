# ==> Stage 1: Build the application <==

# Use a Node.js image to build the app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# ==> Stage 2: Serve the application with Nginx <==

# Use a lightweight Nginx image
FROM nginx:stable-alpine

# Copy the static files from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# When the container starts, run Nginx
CMD ["nginx", "-g", "daemon off;"]