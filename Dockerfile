FROM node:20-alpine AS base
WORKDIR /app

# Instala dependências do backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copia o código do backend e frontend
COPY backend ./backend
COPY frontend ./frontend

WORKDIR /app/backend
EXPOSE 3000
CMD ["node", "server.js"]
