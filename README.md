# team_project_25
zdrojove kody timoveho projektu 25

## Požiadavky na spustenie

- ASP.Net core 2.0
- MongoDB 3.4
- NodeJS + npm

##  Návod
### Stiahnute Node_Modules
V koreňovom priečinku cez bash zavolať "npm install"

Spustenie:

V priečinku TP-webApp/TP-webApp

./start.sh

Spúšťač sa pokúsi naštartovať MongoDB server.
Pokiaľ je nastavená premenná prostredia MONGOD_DB_PATH, tak jej obsah využije ako cestu k adresáru úložiska údajov pre databázu.
Inak použije predvolené nastavenie.

Pri prvom spustení je potrebné inicializovať databázu pomocou skriptu initDb.sh prítomného v priečinku TP_webApp/TP_webApp/db.
