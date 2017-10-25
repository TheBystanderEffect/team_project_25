
#!/usr/bin/env bash

mongod || echo "Mongod was unable to start automatically - please start mongod manually" &
../../node_modules/.bin/webpack --config ../../webpack.config.js --watch &
dotnet run --project TP_webApp.csproj