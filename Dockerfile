# Compile smart contract
FROM node:alpine
RUN npm install -g truffle
COPY contracts contracts/
COPY truffle-config.js .
RUN truffle compile --all

# Build frontend
FROM node:alpine
COPY docs .
RUN apk add --update git python make g++
RUN npm install
COPY --from=0 build/contracts/BlockchainPassword.json src/
ENV PUBLIC_URL /
RUN npm run build

# Host frontend
FROM nginx:alpine
COPY --from=1 build /usr/share/nginx/html
