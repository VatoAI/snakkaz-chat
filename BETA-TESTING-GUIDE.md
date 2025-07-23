# SnakkaZ Beta Testing## 🎯 **UMIDDELBAR TESTING - START HER**

### Steg 1: Cross-Browser Testing (NYTT!)
1. **Test Firefox først**: Gå til snakkaz.com - skal ikke vise "Last inn på nytt"
2. **Test Brave**: Skal laste normalt uten black screen
3. **Test Chrome**: Bekreft fortsatt fungerer som før
4. **Mål**: App laster riktig på ALLE browsere

### Steg 2: Få appen til å laste
1. **Gå til snakkaz.com eller www.snakkaz.com**
2. **Bekreft**: Ingen error screen - skal laste direkte til app
3. **Hvis problemer**: Hard refresh (Ctrl+F5 eller Cmd+Shift+R)
4. **Mål**: Se liquid glass design og SnakkaZ interface

### Steg 3: Grunnleggende funksjonalitet
- **Se etter**: Lobby interface, knapper, inputs
- **Test**: Navigasjon i appen
- **Rapporter**: Hva fungerer og hva som ikke fungereror når siden kommer online!*

## 🚀 Før du starter

### Tilgangsinformasjon
- **Live Beta URL**: https://snakkaz.com
- **Backup URL**: https://www.snakkaz.com
- **Status side**: https://snakkaz.com/health (sjekk hvis noe ikke fungerer)

### Browser kompatibilitet
✅ **Anbefalt browsers:**
- Chrome 100+
- Firefox 95+
- Safari 15+
- Edge 100+

⚠️ **Ikke støttet:**
- Internet Explorer (alle versjoner)
- Chrome under 100
- Safari under 15

## � **UMIDDELBAR TESTING - START HER**

### Steg 1: Få appen til å laste
1. **Gå til snakkaz.com eller www.snakkaz.com**
2. **Hvis du ser error screen**: Klikk "Last inn på nytt"
3. **Alternativt**: Hard refresh (Ctrl+F5 eller Cmd+Shift+R)
4. **Mål**: Komme forbi error screen til selve appen

### Steg 2: Grunnleggende funksjonalitet
- **Se etter**: Lobby interface, knapper, inputs
- **Test**: Navigasjon i appen
- **Rapporter**: Hva fungerer og hva som ikke fungerer

## 🎮 Core Feature Testing - START HER

### 🔥 **FØRSTE TEST - App Loading**:
1. **Gå til snakkaz.com eller www.snakkaz.com**
2. **Klikk "Last inn på nytt" hvis du ser error screen**
3. **Bekreft at appen laster inn korrekt**
4. **Se etter lobby/interface** (ikke error melding)

### 1. Lobby System 🏠
- [ ] **Lag nytt rom**: Klikk "Create Room"
- [ ] **Sjekk rom-kode**: 6-sifret kode genereres
- [ ] **Kopier rom-kode**: Klikk på kode for å kopiere
- [ ] **Test deling**: Del kode med testpartner
- [ ] **Bli med i rom**: Skriv inn gyldig rom-kode

### 2. Video Chat Features 🎥
- [ ] **Lokal video**: Kamera aktiveres automatisk
- [ ] **Remote video**: Partner's video vises
- [ ] **Audio kvalitet**: Krystallklar lyd uten echo
- [ ] **Video kvalitet**: Skarpt bilde, god oppløsning
- [ ] **Pause/resume**: Video og audio kan pauseres

### 3. Real-time Communication 💬
- [ ] **Chat fungerer**: Meldinger vises øyeblikkelig
- [ ] **Emoji support**: 😎 Emojis rendres korrekt
- [ ] **Lange meldinger**: 200+ tegn meldinger fungerer
- [ ] **Spesielle tegn**: æøå, ñ, ü osv fungerer
- [ ] **Link deling**: URLs blir klikkbare

### 4. Game Integration 🎯
- [ ] **Start spill**: Begge spillere kan starte spill
- [ ] **Sanntid syncing**: Spilltilstand synkroniseres
- [ ] **Scoring system**: Poeng telles korrekt
- [ ] **Game over**: Spill avsluttes normalt
- [ ] **Restart**: Kan starte nytt spill

## 🔧 Technical Testing

### Performance Tests
- [ ] **Innlasting tid**: Side laster under 3 sekunder
- [ ] **Video latency**: Under 200ms forsinkelse
- [ ] **CPU bruk**: Ikke over 30% på moderne PC
- [ ] **Battery drain**: Akseptabelt på mobil (test 10 min)
- [ ] **Memory usage**: Ikke over 200MB RAM

### Network Tests
- [ ] **3G forbindelse**: Fungerer på treg nett
- [ ] **WiFi switching**: Håndterer nettverksskifte
- [ ] **Forbindelse tapt**: Reconnect fungerer automatisk
- [ ] **Firewall test**: Fungerer på bedriftsnettverk
- [ ] **VPN test**: Fungerer med VPN aktivert

### Cross-device Testing
- [ ] **Phone → Desktop**: Ring fra mobil til PC
- [ ] **Desktop → Phone**: Ring fra PC til mobil
- [ ] **Tablet support**: Fungerer på iPad/Android tablet
- [ ] **Multiple tabs**: Håndterer flere faner åpne
- [ ] **Background mode**: Fungerer når minimert

## 🚨 Error Scenario Testing

### Connection Issues
1. **Test tap av internett**:
   - Start samtale → Slå av WiFi → Slå på igjen
   - **Forventet**: Auto-reconnect etter 5-10 sekunder

2. **Test kamera/mikrofon blokkering**:
   - Blokker tilgang i browser
   - **Forventet**: Tydelig feilmelding + instruksjoner

3. **Test ugyldig rom-kode**:
   - Skriv inn "123456" eller random kode
   - **Forventet**: "Room not found" melding

### Browser Specific
- [ ] **Firefox**: Test alle core features
- [ ] **Safari**: Test PWA installasjon spesielt
- [ ] **Mobile Chrome**: Test fullskjerm modus
- [ ] **Edge**: Test WebRTC kompatibilitet

## 📊 What to Report

### 🟢 Success Report Template
```
✅ FUNGERER: [Feature navn]
- Browser: [Chrome 120, Firefox 115, etc]
- Device: [iPhone 14, MacBook Pro, etc]
- Network: [WiFi, 4G, etc]
- Notes: [Any special observations]
```

### 🔴 Bug Report Template
```
❌ BUG: [Kort beskrivelse]
- Browser: [Chrome 120, Firefox 115, etc]
- Device: [iPhone 14, MacBook Pro, etc]
- Network: [WiFi, 4G, etc]
- Steps to reproduce:
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- Expected: [What should happen]
- Actual: [What actually happened]
- Screenshot: [If relevant]
```

## 🎯 Priority Testing Areas

### 🔥 HØYEST PRIORITET (test først)
1. **Cross-browser kompatibilitet** - Error boundary fikset! Test Firefox/Brave
2. **App loading på alle browsere** - Ingen mer black screen
3. **Rom oppretting og deltakelse**
4. **Video/audio kvalitet**

### 🟡 MEDIUM PRIORITET
1. **PWA installasjon på mobil** (etter cross-browser bekreftelse)
2. **Game integration**
3. **Chat funktionalitet**
4. **Performance på treg nett**

### 🟢 LAV PRIORITET (nice to have)
1. **Error handling edge cases**
2. **Advanced PWA features**
3. **Accessibility testing**
4. **SEO verification**

## 📞 Emergency Contacts

### Technical Issues
- **Developer**: @dev-team
- **Infrastructure**: Check DNS-TROUBLESHOOTING-NO-CLOUDFLARE.md
- **CSP Issues**: Check CSP-FIX-SUCCESS-VERIFICATION.md

### Quick Fixes
- **Hvis siden ikke laster**: Prøv hard refresh (Ctrl+F5)
- **Hvis kamera ikke fungerer**: Sjekk browser permissions
- **Hvis ingen lyd**: Sjekk system volum + browser permissions
- **Hvis PWA ikke installeres**: Prøv incognito mode først

## 🏆 Success Metrics

### Launch Ready Criteria
- [ ] **95%+ success rate** på core features
- [ ] **Zero critical bugs** i video/audio
- [ ] **PWA installasjon** fungerer på alle devices
- [ ] **Cross-browser** compatibility confirmed
- [ ] **Performance** godkjennes på slow 3G

### Go-Live Checklist
- [ ] All HIGH priority tests passed
- [ ] No CRITICAL bugs reported
- [ ] PWA manifest verified
- [ ] SEO tags verified
- [ ] DNS fully propagated
- [ ] Error handling tested
- [ ] Performance benchmarks met

---

**🎉 Happy Testing! La oss gjøre SnakkaZ til den beste video chat opplevelsen!**

*Opprettet: $(date)*
*Versjon: Beta 1.0*
*Status: Ready for testing når DNS propagerer*
