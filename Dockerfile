# Stage 1: Build
FROM node:22 AS build

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install --include=dev

# Copy the rest of the project files
COPY . .

# Build the app using local Vite
RUN npx vite build

# Stage 2: Serve with nginx
FROM nginx:stable

# Copy build artifacts
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
