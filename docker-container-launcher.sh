# Add system environment variable to env.js which is already referenced by the index.html
# ./htdocs/static/js/env.js path is relatve to Apache2 home
printf "const LINKY_SERVER_HOST=\"%s\";\n" ${LINKY_SERVER_HOST} >> ./htdocs/static/js/env.js
printf "const LINKY_SERVER_PROTOCOLE=\"%s\";\n" ${LINKY_SERVER_PROTOCOLE} >> ./htdocs/static/js/env.js
printf "const LINKY_SERVER_PORT=\"%s\";\n" ${LINKY_SERVER_PORT} >> ./htdocs/static/js/env.js

# Launch Apache2 since all environment variables are set
/usr/local/bin/httpd-foreground