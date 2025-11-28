# Stage 1: Build
FROM node:22 AS build

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy all source files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable

# Copy build artifacts
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
