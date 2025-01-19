FROM ghcr.io/puppeteer/puppeteer:24.1.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all project files
COPY . .

# Default command to run your script
CMD ["node", "scrapper.js"]
