# Sjekkliste for verifisering av assets-opplasting

## Kritiske filer å sjekke
Sjekk at følgende filer er tilgjengelige på serveren:

- [ ] index-GRqizV24.css
- [ ] index-DQJNfLon.js
- [ ] vendor-react-CkjGjP8g.js
- [ ] vendor-supabase-0rZ8WFOd.js
- [ ] Subscription-DWohK-WG.js (kritisk for abonnementsfunksjonalitet)

## Sjekk med nettleser
1. Besøk https://www.snakkaz.com
2. Trykk CTRL+F5 for å tømme cachen
3. Åpne utviklerverktøy (F12)
4. Sjekk Console-tabben for feilmeldinger
5. Sjekk Network-tabben og filtrer for JS/CSS filer

## Sjekk med curl
```bash
# Kjør disse kommandoene for å sjekke om filene er tilgjengelige
curl -I https://www.snakkaz.com/assets/index-GRqizV24.css
curl -I https://www.snakkaz.com/assets/index-DQJNfLon.js
curl -I https://www.snakkaz.com/assets/vendor-react-CkjGjP8g.js
curl -I https://www.snakkaz.com/assets/Subscription-DWohK-WG.js
```

Sjekk at response-koden er 200 OK og at Content-Type er korrekt:
- For JS-filer bør Content-Type være: application/javascript eller text/javascript
- For CSS-filer bør Content-Type være: text/css

## Feilsøkingstrinn
Hvis filene ikke lastes korrekt:

1. Sjekk .htaccess-filen for MIME-type konfigurasjoner
2. Verifiser at assets-mappen har korrekte rettigheter (755)
3. Prøv å laste ned en fil direkte for å sjekke innholdet
4. Sammenlign filstørrelsen på serveren med lokal kopi
