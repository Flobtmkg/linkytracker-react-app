FROM httpd:2.4

# Default ENV
ENV LINKY_SERVER_HOST="localhost"
ENV LINKY_SERVER_PROTOCOLE="http"
ENV LINKY_SERVER_PORT="8080"

COPY ./web-build/ /usr/local/apache2/htdocs/
COPY ./docker-container-launcher.sh  /usr/local/apache2/

RUN ["chmod", "+x", "/usr/local/apache2/docker-container-launcher.sh"]
RUN ["apt-get", "-y", "update"]
RUN ["apt-get", "-y", "install", "curl"]
RUN ["apt-get", "-y", "install", "iputils-ping"]

CMD ["/bin/sh", "/usr/local/apache2/docker-container-launcher.sh"]