FROM node:latest as builder
WORKDIR /home
COPY . .
RUN npm ci
RUN npm run build

FROM node:latest
COPY ./package*.json /opt/app/
COPY --from=builder /home/dist /opt/app/dist
WORKDIR /opt/app
EXPOSE 443
CMD ["npm", "start"]