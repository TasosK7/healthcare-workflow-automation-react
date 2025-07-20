# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies before copying everything (to use cache)
COPY package*.json ./

RUN npm install

# Copy the rest of the app
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]