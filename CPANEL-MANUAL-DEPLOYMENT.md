# 🔧 cPanel Manual Deployment - Emergency Hotfix

## 🎯 EMERGENCY REACT HOOKS FIX FOR WWW.SNAKKAZ.COM

### Steg 1: Forbered filene
✅ **Disse filene er klare for upload:**
- `snakkaz-hotfix.zip` (komplett hotfix pakke)
- `emergency-react-hooks-patch.js` (React hooks fix)
- `emergency-index-fixed.html` (oppdatert index med feil-håndtering)

### Steg 2: Logg inn på cPanel
```
🌐 Gå til: premium123.web-hosting.com:2083
🔑 Bruk dine cPanel credentials
```

### Steg 3: Åpne File Manager
```
📁 Klikk "File Manager" i cPanel
📂 Naviger til "public_html" mappen
🔍 Du skal se eksisterende snakkaz filer
```

### Steg 4: Upload Emergency Files
```
📤 Klikk "Upload" knappen øverst
📦 Velg disse filene:
   - snakkaz-hotfix.zip
   - emergency-react-hooks-patch.js
   - emergency-index-fixed.html
⏱️ Vent på upload (1-2 minutter)
```

### Steg 5: Extract Hotfix
```
📦 Høyreklikk på "snakkaz-hotfix.zip"
🔧 Velg "Extract"
📁 Bekreft extraction til public_html
✅ Alle filer blir oppdatert automatisk
```

### Steg 6: Backup og Erstatt (VIKTIG)
```
🔄 Hvis du vil være extra sikker:
   1. Høyreklikk på eksisterende "index.html"
   2. Velg "Rename" til "index-backup.html"
   3. Høyreklikk på "emergency-index-fixed.html"
   4. Velg "Rename" til "index.html"
```

### Steg 7: Test Live Site
```
🌐 Gå til: www.snakkaz.com
🔄 Trykk Ctrl+F5 for hard refresh
✅ React hooks error skal være fikset
🔐 Test chat funktionalitet
```

## 🚨 ALTERNATIVE: Kjapp Fix
Hvis du bare vil fikse React hooks error raskt:

```
1. Upload kun "emergency-react-hooks-patch.js" til public_html
2. Legg til denne linjen i eksisterende index.html:
   <script src="emergency-react-hooks-patch.js"></script>
3. Test www.snakkaz.com
```

## 📁 Hva er i snakkaz-hotfix.zip:
- ✅ Oppdatert index.html med error handling
- ✅ React hooks patch (emergency-react-hooks-patch.js)
- ✅ Optimalisert JavaScript bundles
- ✅ Service Worker oppdateringer
- ✅ PWA manifest filer
- ✅ CSS optimalisering

## 🎉 Etter Deployment:
1. **Test www.snakkaz.com** - skal laste uten JavaScript errors
2. **Test chat** - skal fungere normalt
3. **Test PWA** - "Add to Home Screen" skal virke
4. **Test E2EE** - kryptering skal fungere

## 🔍 Debugging:
Hvis problemer fortsatt:
1. Åpne Developer Tools (F12)
2. Se Console for errors
3. Check Network tab for loading issues
4. Test på inkognito mode

**🚀 Etter dette skal www.snakkaz.com fungere perfekt! 🎊**
