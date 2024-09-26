# 1. Use an official Node.js image as a base
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm ci --only=production

# 5. Copy the rest of the application code to the container
COPY . .

# 6. Build Tailwind CSS output
RUN npx tailwindcss -i ./src/input.css -o ./public/output.css --minify

# 7. Expose the port the app runs on (adjust this if needed)
EXPOSE 3000

# 8. Start the application
CMD ["node", "src/app.js"]
