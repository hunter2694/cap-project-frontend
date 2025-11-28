# Stage 1: Build stage
FROM node:18 AS build

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install all dependencies including devDependencies
# Use --legacy-peer-deps to avoid peer dependency errors
RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

# Build the app using npx (ensures local vite is found)
RUN npx vite build

# Stage 2: Nginx to serve the app
FROM nginx:stable

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
