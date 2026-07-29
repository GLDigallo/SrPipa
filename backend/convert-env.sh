#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  HOST_PORT_DB=$(echo "$DATABASE_URL" | sed 's|^postgresql://||' | cut -d@ -f2)
  USER=$(echo "$DATABASE_URL" | sed 's|^postgresql://||' | cut -d: -f1)
  PASS=$(echo "$DATABASE_URL" | sed 's|^postgresql://||' | cut -d@ -f1 | cut -d: -f2-)

  case "$HOST_PORT_DB" in
    *sslmode=*) JDBC_URL="jdbc:postgresql://$HOST_PORT_DB" ;;
    *)
      if echo "$HOST_PORT_DB" | grep -q '?'; then
        JDBC_URL="jdbc:postgresql://${HOST_PORT_DB}&sslmode=require"
      else
        JDBC_URL="jdbc:postgresql://${HOST_PORT_DB}?sslmode=require"
      fi
      ;;
  esac

  export SPRING_DATASOURCE_URL="$JDBC_URL"
  export SPRING_DATASOURCE_USERNAME="$USER"
  export SPRING_DATASOURCE_PASSWORD="$PASS"
fi

exec java -jar /app/app.jar
