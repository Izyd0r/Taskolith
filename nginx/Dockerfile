FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=taskolith-webapp:latest /usr/share/nginx/html /usr/share/nginx/html 
