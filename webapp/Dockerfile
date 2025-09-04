# Build stage
FROM node:latest AS BUILD
WORKDIR /app

# --- CHANGE THESE LINES ---
COPY package*.json ./
RUN npm install
COPY . .
# --- END CHANGES ---

RUN npm run build

# Final stage
# This part is for the nginx service to copy from, it can stay
FROM nginx:alpine
COPY --from=BUILD /app/dist /usr/share/nginx/html
