# Cloudflare DNS Konfigurering for Snakkaz.com

## Instruksjoner for å legge til Cloudflare nameservers i Namecheap

### Trinn 1: Logge inn på Namecheap
1. Gå til Namecheap.com
2. Logg inn på din konto

### Trinn 2: Finn ditt domene
1. Gå til "Domain List" i sidemenyen
2. Finn snakkaz.com i listen
3. Klikk på knappen "MANAGE"

### Trinn 3: Endre nameservers
1. Sørg for at du er på "Domain"-fanen (ikke "Advanced DNS")
2. Bla ned til seksjonen som heter "NAMESERVERS"
3. Endre fra "Namecheap BasicDNS" til "Custom DNS" i nedtrekksmenyen
4. Du vil nå se tekstfelter hvor du kan legge inn de nye nameserver-navnene
5. I det første feltet, skriv inn: `kyle.ns.cloudflare.com`
6. I det andre feltet, skriv inn: `vita.ns.cloudflare.com`
7. Klikk på "✓" (hake) eller "Save" for å lagre endringene

### Trinn 4: Vent på DNS-propagering
1. Det kan ta fra 30 minutter til 48 timer før endringen er fullt propagert
2. Du kan sjekke status på Cloudflare-dashbordet

### Trinn 5: Verifiser at alt fungerer
Bruk systemHealthCheck-modulen for å verifisere at alt fungerer:
```javascript
// I nettleserkonsollen på www.snakkaz.com:
checkHealth().then(console.log);
```

## Fordeler med Cloudflare DNS
1. Bedre ytelse gjennom Cloudflare CDN
2. DDoS-beskyttelse
3. Gratis SSL/TLS-sertifikat
4. Bedre sikkerhet
5. Web Application Firewall
6. Enkel analyse gjennom Cloudflare Analytics

## Feilsøking
Hvis du får feilmeldingen "Please provide a valid IP address", sørg for at:
1. Du bruker "Custom DNS" alternativet under NAMESERVERS
2. Ikke prøv å legge til nameservere under "PERSONAL DNS SERVER"-seksjonen
