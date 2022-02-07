FROM node:latest as builder
COPY . .
RUN npm ci
RUN npm run build

FROM node:latest
COPY ./package*.json /opt/app/
COPY --from=builder ./dist /opt/app/dist
WORKDIR /opt/app
EXPOSE 443
CMD ["npm", "start"]