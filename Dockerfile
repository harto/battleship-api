FROM node:4.4
RUN apt-get update \
 && apt-get install -y postgresql-client
