FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copie schema + génère AVANT le reste
COPY prisma ./prisma/
RUN npx prisma generate  # Utilise binaryTargets du schema

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
