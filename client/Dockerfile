
# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:latest as builder
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=builder /app/build/ /usr/share/nginx/html

# Copy the default nginx.conf provided by node
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Running on port 80 outside but 80 inside (NginX)
EXPOSE 80 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]