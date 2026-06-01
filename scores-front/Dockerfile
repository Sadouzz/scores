# Étape 1 : Build de l'application
FROM node:20-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste du code source
COPY . .

# Construction de l'application React avec Vite (les fichiers iront dans /app/dist)
RUN npm run build

# Étape 2 : Serveur Web pour exposer l'application
FROM nginx:alpine

# Copie des fichiers compilés depuis l'étape de build vers le dossier web d'Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Optionnel : Si tu utilises React Router, Nginx a besoin d'être configuré pour rediriger toutes les requêtes vers index.html.
# Pour l'instant, on utilise la configuration par défaut.

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
