FROM node:22.16.0-alpine AS base
# set working directory
WORKDIR /usr/src/app

# --------- DEVELOPMENT stage
FROM base AS dev
# copy the source code into container
COPY . .
# install the dependencies
RUN npm install
# run in development mode with hot reload
CMD ["npx", "tsx", "watch", "--env-file=.env.local", "./src/app.ts"]


# --------- BUILD stage
FROM base AS build
# copy the source code into container
COPY . .
# install the dependencies
RUN npm install
# compile the code and rewire paths
RUN npx tsc && npx tsc-alias

# --------- PRODUCTION stage
FROM base AS prod
# copy the compiled app
COPY --from=build /usr/src/app/dist ./dist
# copy the .env file
COPY .env .env
# run the compiled app
CMD [ "node", "--env-file=.env", "dist/app.js" ]
