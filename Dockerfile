# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# Copy all files first (so devDependencies install correctly)
COPY package*.json ./
COPY vite.config.js ./
COPY . .

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable

# Copy build artifacts
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
