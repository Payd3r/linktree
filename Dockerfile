# Stage 1: Build Frontend
FROM node:20-slim AS frontend-build

WORKDIR /app

# Copia i file di package e installa le dipendenze
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install --verbose

# Copia la cartella public (necessaria per Vite publicDir)
COPY public/ ./public/

# Copia il resto del codice sorgente frontend
COPY frontend/ ./frontend/

# Esegui il build che genera i file statici in dist/
WORKDIR /app/frontend
RUN npm run build

# Stage 2: Setup Backend
FROM node:20-slim AS backend-setup

WORKDIR /app/backend

# Copia i file di package e installa le dipendenze
COPY backend/package*.json ./
RUN npm install --verbose

# Copia il resto del codice sorgente backend
COPY backend/ ./

# Stage 3: Nginx + Supervisord
FROM nginx:stable-alpine

# Installa supervisord e node per eseguire il backend
RUN apk add --no-cache supervisor nodejs npm

# Copia i file statici del frontend dal stage di build
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copia il backend dal stage di setup
COPY --from=backend-setup /app/backend /app/backend

# Copia la configurazione di Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia la configurazione di Supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Crea le directory necessarie
RUN mkdir -p /app/backend/public/uploads && \
    mkdir -p /app/backend/data && \
    mkdir -p /var/log/supervisor && \
    mkdir -p /var/run

# Esponi la porta 80
EXPOSE 80

# Avvia supervisord che gestirà nginx e il backend
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

