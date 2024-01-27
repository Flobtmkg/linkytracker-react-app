FROM nginx:1.25.3-alpine

# Default ENV
ENV LINKY_SERVER_HOST="localhost"
ENV LINKY_SERVER_PROTOCOLE="http"
ENV LINKY_SERVER_PORT="8080"

COPY ./web-build/ /usr/share/nginx/html

RUN ["apk", "add", "--update", "curl"]
RUN ["apk", "add", "--update", "iputils"]

CMD echo "launching..." ; rm -f /usr/share/nginx/html/static/js/env.js ; printf "const LINKY_SERVER_HOST=\"%s\";\n" ${LINKY_SERVER_HOST} >> /usr/share/nginx/html/static/js/env.js ; printf "const LINKY_SERVER_PROTOCOLE=\"%s\";\n" ${LINKY_SERVER_PROTOCOLE} >> /usr/share/nginx/html/static/js/env.js ; printf "const LINKY_SERVER_PORT=\"%s\";\n" ${LINKY_SERVER_PORT} >> /usr/share/nginx/html/static/js/env.js ; nginx -g "daemon off;"