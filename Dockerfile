# syntax=docker/dockerfile:1
# activation of the last 1.x available syntax for Dockerfile

FROM nginx:1.25.3-alpine

# we do not copy *.js.map debug mapping files, so JS and CSS files can not be decompiled easly
COPY ./web-build/static/js/*.js /usr/share/nginx/html/static/js/
COPY ./web-build/static/css/*.css /usr/share/nginx/html/static/css/
COPY ./web-build/*.* /usr/share/nginx/html/

RUN ["apk", "add", "--update", "curl"]
RUN ["apk", "add", "--update", "iputils"]

CMD echo "launching..."; nginx -g "daemon off;"