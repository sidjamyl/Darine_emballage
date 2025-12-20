from node:20-alpine
workdir /app
copy package*.json ./
run npm install
copy . .
run npx prisma generate
run npm run build
expose 3000
cmd ["npm","start"]