
FROM node:7.8

# for unbuntu
RUN echo "Asia/Shanghai" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata









RUN mkdir -p /ebsa/service \
  && mkdir -p /tmp/service \
  && mkdir -p /int/www \
  && touch /int/www/stats.html

# for npm install
# ADD package.json /tmp/service/
# RUN cd /tmp/service && NODE_ENV=development npm install
# WORKDIR /ebsa/service
# RUN ln -s /tmp/service/node_modules
# for yarn
ADD package.json yarn.lock /tmp/service/
RUN cd /tmp/service && NODE_ENV=development yarn
WORKDIR /ebsa/service
RUN ln -s /tmp/service/node_modules

COPY . /ebsa/service

EXPOSE 80
CMD ["npm", "run", "start"]
