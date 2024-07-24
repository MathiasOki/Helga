# Use an official Node runtime as a parent image
FROM --platform=linux/amd64 node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Install git (if not already installed)
RUN apt-get update && apt-get install -y git

# Clone your Node.js application from Git
RUN git clone https://github.com/mathiasoki/helga.git .

# Set the timezone
ENV TZ=Europe/Oslo

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "src/app.js"]