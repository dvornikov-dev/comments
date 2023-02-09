#Stage 1
FROM node:alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]

#Stage 2
# FROM nginx:alpine
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=builder /app/build .
# ENTRYPOINT [ "nginx", "-g", "daemon off;" ]