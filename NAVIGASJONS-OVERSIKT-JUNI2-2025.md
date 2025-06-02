# SNAKKAZ CHAT – NAVIGASJONS- OG SIDEOVERSIKT (JUNI 2025)

## 1. Hvor havner brukeren etter login/registrering?
- **Etter login:** Brukeren sendes direkte til `/basic-chat` (hovedchatten).
- **Etter registrering:** Brukeren sendes også til `/basic-chat` (ingen automatisk redirect til profil, men chat er "hjemmesiden").
- **Hvis ikke innlogget:** Forsøk på å gå til beskyttede sider sender brukeren til `/login`.

## 2. Hovednavigasjon og header (desktop og mobil)

### Desktop (UnifiedNavigation)
| Side/Lenke         | Path           | Ikon         | Krever innlogging | Admin? | Kommentar |
|--------------------|----------------|--------------|-------------------|--------|-----------|
| Hjem               | `/`            | Home         | Nei               | Nei    | Redirecter til chat hvis innlogget |
| Chat               | `/basic-chat`  | Message      | Ja                | Nei    | Hovedchat, også `/chat` redirecter hit |
| Venner             | `/friends`     | Heart        | Ja                | Nei    | Venneliste |
| Finn Venner        | `/find-friends`| Search       | Ja                | Nei    | Søk etter venner |
| AI Assistent       | `/ai-chat`     | Bot          | Ja                | Nei    | AI-chat |
| Grupper            | `/group-chat`  | Users        | Ja                | Nei    | Gruppechat |
| Ny Gruppe          | `/create-group`| UserPlus     | Ja                | Nei    | Opprett gruppe |
| Info               | `/info`        | Info         | Nei               | Nei    | Om appen |
| Profil             | `/profile`     | User         | Ja                | Nei    | Brukerprofil |
| Innstillinger      | `/settings`    | Settings     | Ja                | Nei    | Instillinger |
| Admin              | `/admin`       | ShieldCheck  | Ja                | Ja     | Kun for admin-brukere |

### Mobil (MobileMenu + UnifiedNavigation)
- Samme hovedlenker som over, men i hamburger-meny og bunnnavigasjon.
- Ekstra: Sikkerhet og Logg ut i menyen.

## 3. Spesielle/Skjulte sider og funksjoner
| Side/Lenke         | Path                | Tilgang         | Kommentar |
|--------------------|---------------------|-----------------|-----------|
| Admin Security     | `/admin/security`   | Skjult, kode    | Skjult panel, kun via direkte URL og kode |
| Subdomene-modus    | subdomene.*         | Automatisk      | dash, business, docs, analytics, mcp, help gir spesialmodus |
| Epost/Mail         | Ikke egen side      | -               | Ingen dedikert epost/mail-side funnet |
| Bitcoin/Electrum   | Ikke funnet         | -               | Ingen dedikert bitcoin/electrum-side funnet |

## 4. Andre relevante sider
| Side/Lenke         | Path                | Tilgang         | Kommentar |
|--------------------|---------------------|-----------------|-----------|
| Abonnement         | `/subscription`     | Ja              | Abonnement og premium |
| Glemt passord      | `/forgot-password`  | Nei             | For alle |
| Tilbakestill passord| `/reset-password`  | Nei             | For alle |

## 5. Subdomene-logikk
- Appen oppdager subdomener automatisk (dash, business, docs, analytics, mcp, help).
- Spesielle subdomener gir egen tittel og "modus" (f.eks. Dashboard, Business, osv).
- Ukjente subdomener gir advarsel i konsoll.

## 6. Oppsummering av brukerflyt
- **Login/Registrering:** Alltid til hovedchat (`/basic-chat`).
- **Navigasjon:** Alt samlet i UnifiedNavigation (desktop) og MobileMenu (mobil).
- **Admin/Sikkerhet:** Skjulte paneler kun for admin eller med kode.
- **Bitcoin/Electrum:** Ikke implementert som egne sider per juni 2025.
- **Mail/Epost:** Ikke egen side, men epost vises i brukerinfo.

---

**Denne oversikten er basert på faktisk kodebase og dekker alle hoved- og spesialsider, samt navigasjonsflyt og tilgang.**
