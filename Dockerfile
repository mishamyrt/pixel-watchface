FROM node:latest as builder
WORKDIR /home
COPY . .
RUN npm ci
RUN npm run build

FROM node:latest
COPY ./package*.json /opt/app/
COPY ./watchface /opt/app/watchface
COPY --from=builder /home/dist /opt/app/dist
WORKDIR /opt/app
RUN npm ci --production
EXPOSE 443
EXPOSE 80
CMD ["npm", "start"]