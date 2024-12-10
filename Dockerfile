# 1. Use an official Node.js image as a base
FROM node:23-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# 4. Set the timezone
ENV TZ=Europe/Oslo

# 5. Install dependencies
RUN npm ci --only=production

# 6. Copy the rest of the application code to the container
COPY . .

# 7. Expose the port the app runs on (adjust this if needed)
EXPOSE 3000

# 8. Start the application
CMD ["node", "src/app.js"]
