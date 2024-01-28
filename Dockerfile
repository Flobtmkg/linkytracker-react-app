# syntax=docker/dockerfile:1
# activation of the last 1.x available syntax for Dockerfile

FROM nginx:1.25.3-alpine

# Default ENV
ENV LINKY_SERVER_HOST="localhost"
ENV LINKY_SERVER_PROTOCOLE="http"
ENV LINKY_SERVER_PORT="8080"

# env.js is NOT present at build stage
# we do not copy *.js.map debug mapping files, so JS and CSS files can not be decompiled easly
COPY ./web-build/static/js/*.js /usr/share/nginx/html/static/js/
COPY ./web-build/static/css/*.css /usr/share/nginx/html/static/css/
COPY ./web-build/*.* /usr/share/nginx/html/

RUN ["apk", "add", "--update", "curl"]
RUN ["apk", "add", "--update", "iputils"]

# create env.js with environment variables injected at the launch stage in /usr/share/nginx/html/static/js/
# so LINKY_SERVER_HOST, LINKY_SERVER_PROTOCOLE, LINKY_SERVER_PORT can be controled by environment variable at the container launch stage via docker run or docker compose file
CMD echo "launching..." ; rm -f /usr/share/nginx/html/static/js/env.js ; printf "const LINKY_SERVER_HOST=\"%s\";\n" ${LINKY_SERVER_HOST} >> /usr/share/nginx/html/static/js/env.js ; printf "const LINKY_SERVER_PROTOCOLE=\"%s\";\n" ${LINKY_SERVER_PROTOCOLE} >> /usr/share/nginx/html/static/js/env.js ; printf "const LINKY_SERVER_PORT=\"%s\";\n" ${LINKY_SERVER_PORT} >> /usr/share/nginx/html/static/js/env.js ; nginx -g "daemon off;"