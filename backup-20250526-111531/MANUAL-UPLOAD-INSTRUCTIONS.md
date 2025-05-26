# Manuell opplastingsinstruksjon for Snakkaz Chat

Dette dokumentet gir instruksjoner om hvordan du manuelt laster opp filene for å fikse problemene med Snakkaz Chat.

## Filer som skal lastes opp

I `files-to-upload`-mappen finner du disse filene:

1. `htaccess-file.txt` - Last opp som `.htaccess` i root-mappen (public_html)
2. `supabaseClient.ts` - Last opp som `src/lib/supabaseClient.ts` 
3. `supabasePatch.ts` - Last opp som `src/services/encryption/supabasePatch.ts`
4. `mime-test.js` - Last opp som `mime-test.js` i root-mappen (public_html)

## Trinn for manuell opplasting via cPanel File Manager

1. Logg inn på Namecheap cPanel
2. Gå til "File Manager"
3. Navigér til `public_html`
4. Last opp `.htaccess`:
   - Klikk på "Upload" knappen
   - Velg `htaccess-file.txt` fra din datamaskin
   - Etter opplasting, gi filen nytt navn til `.htaccess` (sørg for at du overskriver den eksisterende filen)

5. Opprett nødvendige mapper hvis de ikke eksisterer:
   - Opprett `src/lib` hvis den ikke finnes
   - Opprett `src/services/encryption` hvis den ikke finnes

6. Last opp de andre filene til deres respektive plasseringer

## Aktivere SSL og HTTPS

1. I cPanel, navigér til `SSL/TLS Status`
2. Sett "HTTPS Redirect" til "On" for alle dine domener
3. Klikk på "HTTPS by default" knappen som vises på SSL/TLS Status-siden

## Verifiser fiksene

1. Slett nettleserdata (cookies, cache, osv.)
2. Besøk `https://snakkaz.com` (legg merke til HTTPS)
3. Åpne utviklerkonsollet (F12)
4. Verifiser at:
   - Det ikke lenger er "Multiple GoTrueClient instances detected" advarsler
   - Det ikke er noen MIME-type feil
   - Alle JavaScript-filer lastes korrekt

## Feilsøking

Hvis du fortsatt ser feil:

1. Verifiser at .htaccess-filen er riktig lastet opp og har riktig innhold
2. Sjekk at SSL er riktig konfigurert i cPanel
3. Verifiser at alle filstier er korrekte
4. Se på dokumentasjonen i `docs/FIXES-SUMMARY-MAY-18-2025.md` og `docs/TROUBLESHOOTING-GUIDE-MAY-18-2025.md`
