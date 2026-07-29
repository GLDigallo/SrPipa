#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && [ -z "$SPRING_DATASOURCE_URL" ]; then
  JDBC_URL=$(echo "$DATABASE_URL" | sed 's|^postgresql://|jdbc:postgresql://|')
  USER=$(echo "$DATABASE_URL" | sed 's|^postgresql://||' | cut -d: -f1)
  PASS=$(echo "$DATABASE_URL" | sed 's|^postgresql://||' | cut -d@ -f1 | cut -d: -f2-)

  case "$JDBC_URL" in
    *sslmode=*) ;;
    *)
      if echo "$JDBC_URL" | grep -q '?'; then
        JDBC_URL="${JDBC_URL}&sslmode=require"
      else
        JDBC_URL="${JDBC_URL}?sslmode=require"
      fi
      ;;
  esac

  export SPRING_DATASOURCE_URL="$JDBC_URL"
  export SPRING_DATASOURCE_USERNAME="$USER"
  export SPRING_DATASOURCE_PASSWORD="$PASS"
fi

exec java -jar /app/app.jar
