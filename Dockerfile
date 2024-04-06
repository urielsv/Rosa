# Use the official Node.js LTS Alpine image as the base image
FROM node:lts-alpine3.19


RUN apk update
RUN apk upgrade
RUN npm cache clean --force
# Install additional system-level packages if needed

WORKDIR /app
COPY package*.json /app/
# Install whatsapp-web.js package
RUN npm install puppeteer
RUN npm install whatsapp-web.js

# Copy the rest of the application code
COPY . .

# Command to start your WhatsApp bot
CMD ["node", "rosa.js"]