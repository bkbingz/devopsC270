# Use the lightweight Nginx image from Docker Hub
#FROM nginx:alpine

# Copy your website files (HTML, CSS, JS) into the Nginx web folder
#COPY . /usr/share/nginx/html

# Expose port 80 so the website is accessible
#EXPOSE 80


#Commit by Eric

# 1. Use Node.js (Alpine version is lightweight/fast)
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Install a simple HTTP server to serve your HTML files
# (We use this because you don't have a backend script yet)
RUN npm install -g http-server

# 4. Copy your HTML/CSS files into the container
COPY . .

# 5. Open Port 5500 as requested
EXPOSE 5500

# 6. Start the server on Port 5500
CMD ["http-server", "-p", "5500"]