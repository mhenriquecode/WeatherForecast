# Etapa 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências (runtime + dev)
RUN npm install

# Copia todo o código
COPY . .

# Define variável de ambiente para o build
ARG VITE_WEATHER_API_KEY
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY

# Gera build de produção (a variável VITE_WEATHER_API_KEY será embutida)
RUN npm run build

# Etapa 2: Servir a build com Nginx
FROM nginx:alpine

# Remove conteúdo default
RUN rm -rf /usr/share/nginx/html/*

# Copia a build gerada
COPY --from=build /app/dist /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Rodar Nginx em foreground
CMD ["nginx", "-g", "daemon off;"]
