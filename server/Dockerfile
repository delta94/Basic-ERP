FROM node:latest as builder
WORKDIR /installer
COPY package.json /installer/
RUN npm install
COPY . /installer/
RUN npx gulp --releaseVersion 1.0.0

FROM node:latest
WORKDIR /app
COPY --from=builder /installer/build/  /app

EXPOSE 3001

# WORKDIR /server/build
CMD ["npm","start"]