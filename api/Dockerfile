# Build layer

FROM node:10.15.3-alpine as build
WORKDIR /usr/src/app
COPY src/package.json src/yarn.lock ./
RUN yarn install --production
COPY src .
RUN yarn build

# Final layer

FROM alpine
WORKDIR /usr/src/app
RUN apk add --update nodejs tini

COPY --from=build /usr/src/app/db.json /usr/src/app
COPY --from=build /usr/src/app/dist /usr/src/app
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "/usr/src/app/server.js" ]

