FROM node:latest
FROM keymetrics/pm2:latest-alpine

#Specify the working directory 
WORKDIR /usr/src/thuyonlinesales/server

#Specify copy from...to...
COPY ./ ./

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install

CMD ["/bin/bash", "pm2-runtime", "start", "pm2.json"]