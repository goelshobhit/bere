FROM node:latest

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

COPY package.json yarn.lock ./
RUN yarn install --check-files

COPY . ./

EXPOSE 3000

COPY ./docker/entrypoints/app-entrypoint.sh ./entrypoint.sh
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]