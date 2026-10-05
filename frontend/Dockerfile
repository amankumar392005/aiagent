FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build args become env vars at build time for Vite
ARG VITE_FIREBASE_APIKEY
ARG VITE_RAZORPAY_KEY_ID
ARG VITE_BACKEND_URL

RUN npm run build

# Serve with a lightweight static server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
