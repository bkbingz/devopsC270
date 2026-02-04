# Use the lightweight Nginx image from Docker Hub
FROM nginx:alpine

# Copy your website files (HTML, CSS, JS) from the 'final' folder into the Nginx web folder
COPY final/ /usr/share/nginx/html

# Expose port 80 so the website is accessible
EXPOSE 80
