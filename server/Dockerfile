# Use an official Node.js runtime as a parent image.
# We are using the 'alpine' variant for a smaller image size.
FROM node:18-alpine

# Set the working directory in the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies.
# Using --only=production will not install devDependencies.
RUN npm install

# If you are building your code for production, uncomment the following line:
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Your app binds to port 5000 so you need to expose it
EXPOSE 5002

CMD [ "npx", "nodemon", "server.js" ]