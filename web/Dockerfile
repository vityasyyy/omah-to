# Use a lightweight Node.js image
FROM node:23-alpine3.21

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and pnpm-lock.yaml first for efficient caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN corepack enable && pnpm install

# Copy the rest of the frontend code
COPY . .

# Expose the default Next.js dev server port (change if needed)
EXPOSE 3000

# Start the dev server
CMD ["pnpm", "run", "dev"]
