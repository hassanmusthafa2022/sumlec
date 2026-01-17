FROM node:20-alpine

# Install Python3 and FFmpeg (Critical for yt-dlp)
RUN apk add --no-cache python3 ffmpeg

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Start
EXPOSE 3000
CMD ["npm", "start"]
