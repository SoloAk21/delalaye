FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g pm2
COPY . .
RUN npx prisma db push 
RUN npx prisma generate
#RUN npm run build

EXPOSE 5000
CMD ["pm2-runtime", "npm", "--", "run", "prod"]
