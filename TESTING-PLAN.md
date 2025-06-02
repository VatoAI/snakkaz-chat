# Snakkaz Chat - Kritisk Testing Plan
*Dato: Juni 2, 2025*

## KRITISKE TESTER SOM MÅ UTFØRES

### 1. 🚨 HØYEST PRIORITET - MathCaptcha Testing
**Problem**: Brukere kan ikke skrive mer enn ett siffer i MathCaptcha feltet

#### Test Steg:
1. **Registrering**: http://localhost:5175/register
   - [ ] Test MathCaptcha input - kan du skrive flere tall?
   - [ ] Test med forskjellige tall (10, 15, 20, etc.)
   - [ ] Test copy/paste funksjonalitet
   - [ ] Test delete/backspace funksjonalitet

2. **Login**: http://localhost:5175/login  
   - [ ] Test MathCaptcha input på login form
   - [ ] Sammenlign med registrering

3. **Forgot Password**: http://localhost:5175/forgot-password
   - [ ] Test MathCaptcha input på forgot password form

#### Forventet Resultat:
- Brukere SKAL kunne skrive flere tall (f.eks. "15" for 7+8)
- Input feltet skal ikke begrense til kun ett siffer

---

### 2. 🚨 HØYEST PRIORITET - Navigation Testing  
**Problem**: Kun 10% av knappene fungerer

#### Test alle navigasjons-elementer:
1. **Header Navigation** - test alle knapper/linker
2. **Mobile Navigation** - test hamburger menu
3. **Footer Navigation** - test alle footer linker  
4. **Chat Navigation** - test chat-relaterte knapper
5. **Side Navigation** - test sidebars og menyer

#### Systematisk Test:
```
For hver knapp/link:
- [ ] Klikk på element
- [ ] Noter om den navigerer riktig
- [ ] Noter eventuelle feilmeldinger i console
- [ ] Test på både desktop og mobil størrelse
```

---

### 3. 🚨 HØYEST PRIORITET - Chat Routing
**Problem**: Etter login redirect brukere ikke til chat

#### Test Steg:
1. **Login Flow**:
   - [ ] Gå til /login
   - [ ] Logg inn med gyldig bruker
   - [ ] Noter hvor du blir redirected
   - [ ] Forventet: skal gå til /chat

2. **Direct Chat Access**:
   - [ ] Test /chat URL direkte
   - [ ] Test /basic-chat URL direkte  
   - [ ] Test /messages URL direkte

3. **Authentication Check**:
   - [ ] Test at uautoriserte brukere redirectes til /login
   - [ ] Test at autoriserte brukere kommer til chat

---

### 4. 🔥 HØY PRIORITET - Mobile Header Overload
**Problem**: For mye innhold i header på mobil

#### Test Steg:
1. **Mobile View Testing**:
   - [ ] Set browser til mobil størrelse (375px bred)
   - [ ] Noter alt innhold i header
   - [ ] Identifiser hva som overlapper eller er skjult
   - [ ] Test scrolling og navigation på mobil

2. **Header Element Analysis**:
   - [ ] Logo/brand
   - [ ] Navigation links  
   - [ ] User menu
   - [ ] Search
   - [ ] Notifications
   - [ ] Premium ads

---

### 5. 🔥 HØY PRIORITET - Duplicate Navigation  
**Problem**: Duplikate hjem/tilbake knapper

#### Test Steg:
1. **Navigation Audit**:
   - [ ] Tell antall "Hjem" knapper på hver side
   - [ ] Tell antall "Tilbake" knapper på hver side
   - [ ] Identifiser hvilke som er duplikater
   - [ ] Test funksjonalitet på hver knapp

---

### 6. 🟡 MEDIUM PRIORITET - Premium Advertising
**Problem**: For mye premium reklame

#### Test Steg:
1. **Premium Message Count**:
   - [ ] Tell premium meldinger på hovedsiden
   - [ ] Tell premium meldinger i chat
   - [ ] Noter hvor ofte pop-ups vises
   - [ ] Identifiser mest irriterende premium meldinger

---

## TESTING RESULTATER

### MathCaptcha Test Resultater:
```
Registrering: [ ] PASS / [ ] FAIL
Login: [ ] PASS / [ ] FAIL  
Forgot Password: [ ] PASS / [ ] FAIL

Notater:
_____________________________________
```

### Navigation Test Resultater:
```
Fungerende knapper: ___/___
Ikke-fungerende knapper: ___/___
Prosentandel fungerende: ___%

Kritiske navigation feil:
_____________________________________
```

### Chat Routing Test Resultater:
```
Login redirect: [ ] PASS / [ ] FAIL
Direct chat access: [ ] PASS / [ ] FAIL
Auth protection: [ ] PASS / [ ] FAIL

Notater:
_____________________________________
```

---

## NESTE STEG ETTER TESTING

1. **Hvis MathCaptcha feiler**: Analyser input event handlers og CSS som kan blokkere input
2. **Hvis navigation feiler**: Auditér alle router linkser og event handlers  
3. **Hvis chat routing feiler**: Fikse login redirect logic i AuthAwareRedirect
4. **Hvis mobile header er overbelastet**: Implement hamburger menu og skjul unødvendige elementer
5. **Hvis premium ads er irriterende**: Redusér frekvens og forbedre timing

## PRIORITETSREKKEFØLGE FOR FIXES:
1. MathCaptcha input fix (BLOCKER)
2. Critical navigation fixes (BLOCKER)  
3. Chat routing fix (BLOCKER)
4. Mobile header redesign (UX)
5. Premium ad optimization (UX)
6. Navigation cleanup (Polish)
