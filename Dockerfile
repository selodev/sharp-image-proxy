FROM node:current-alpine3.13

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts=false --unsafe-perm --verbose

COPY . .

#RUN echo "/usr/local/lib" >> /etc/ld.so.conf.d/usrlocal.conf && ldconfig -v

RUN npm run webpack

EXPOSE 8080

CMD [ "npm", "run", "dev" ]