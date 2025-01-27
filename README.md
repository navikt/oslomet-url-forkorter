# Url-forkorter (bacheloroppgave OsloMet)

## Formål
Applikasjon for backend og frontend for tjenesten.

Se flere detaljer i [dokumentasjon](/dokumentasjon).

## Lokal utvikling

Forutsetninger:
- Node
- Maven
- Java > 21

For å bygge backend:
```shell
cd backend
mvn verify
```

For å bygge frontend:
```shell
cd frontend
npm install
npm run build
npm run copy
```

### Starte opp lokalt
Kjør `main`-metoden i `UrlForkorterApi`. Denne bruker `resources/local.properties` som konfigurasjon.

Backend starter på [http://localhost:8080](http://localhost:8080)

Hvis du skal gjøre endringer i frontend med hot deploy:

```shell
cd frontend
npm run dev
```

Dev starter på [http://localhost:5173](http://localhost:5173)

## NAIS / Github actions
Nais oppsettet ligger i mappen `.nais`, og GitHub Actions ligger i `.github/workflows` les [dokumentasjon](https://docs.test-nais.cloud.nais.io/) for mer informasjon om oppsett.

## Dokumentasjon
Arkitekturskisser og annen dokumentasjon skal legges i en mappen `/dokumentasjon`.
Hvis det gjøres større endringer i koden bør dokumentasjonen oppdateres i samme merge-request som for kodeendringen.

Prinsipielle beslutninger rundt arkitektur og design ligger i `/dokumentasjon/adr`