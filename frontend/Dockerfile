# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build the app
RUN yarn build

# Production stage
FROM nginx:stable-alpine

# Copy build artifacts from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
