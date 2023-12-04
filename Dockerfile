FROM node:18
ENV HOME /root
WORKDIR /root

COPY package*.json ./
# Download dependancies
RUN npm install
RUN npm install express nodemailer uuid 
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]
