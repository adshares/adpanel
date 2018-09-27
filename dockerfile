FROM pawzar/devops:php-fpm

ARG SYSTEM_USER_ID
ARG SYSTEM_USER_NAME

RUN if [ $SYSTEM_USER_ID -gt 1000 ];then \
    useradd \
    --uid $SYSTEM_USER_ID \
    --no-user-group \
    --create-home \
    $SYSTEM_USER_NAME \
    ;fi
