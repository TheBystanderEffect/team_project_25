#!/usr/bin/env bash

if [ -z ${MONGOD_DB_PATH+x} ]; then PATHSTRING=" "
else PATHSTRING="--dbpath $MONGOD_DB_PATH"
fi

mongod $PATHSTRING || echo "ERROR: Mongod was unable to start automatically - please start mongod manually" &
../../node_modules/.bin/webpack --config ../../webpack.config.js --watch &
dotnet run --project TP_webApp.csproj

