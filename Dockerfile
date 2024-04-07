# Use an official Ubuntu runtime as the base image
FROM ubuntu:latest

RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get update && apt-get install -y nodejs npm
RUN apt-get install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# Set the working directory in the container
WORKDIR /rosa

COPY app/ ./app/
COPY backend/ ./backend/
COPY manager/ ./manager/

# Copy package.json and package-lock.json to the working directory
COPY app/package*.json ./app/
COPY backend/package*.json ./backend/
COPY manager/package*.json ./manager/

# Install project dependencies
RUN cd app && npm install --production
RUN cd backend && npm install --production
RUN cd manager && npm install --production

COPY start.sh .

# Make start.sh executable
RUN chmod +x start.sh

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 3000 3001 3010 80
# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable

# Run start.sh when the container launches
CMD ["/usr/bin/supervisord"]