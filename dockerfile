FROM node:18
ENV HOME /root
WORKDIR /root

COPY package*.json ./
# Download dependancies
RUN npm install
RUN npm install -g nodemon

COPY . .
EXPOSE 8080
CMD ["nodemon", "index.js"]