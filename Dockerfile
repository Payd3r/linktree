# Stage 1: Build the React/Vite application
FROM node:20-slim AS build

WORKDIR /app

# Copia i file di package e installa le dipendenze in modo affidabile
COPY package*.json ./
RUN npm install --verbose

# Copia il resto del codice sorgente
COPY . .

# Esegui il comando di build che genera i file statici
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copia i file statici costruiti (Vite produce 'dist')
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configurazione personalizzata di Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

