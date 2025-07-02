# 🚨 RASK LØSNING: index.html fix

## Problem
Serveren laster `/src/main.tsx` i stedet for production bundle `/assets/js/index-C8UgCmie.js`

## ENKLESTE LØSNING (2 minutter)

### **Metode 1: cPanel File Manager**
1. **Åpne:** https://snakkaz.com:2083
2. **Logg inn:** admin@snakkaz.com
3. **Klikk:** "File Manager" 
4. **Finn:** `index.html` i root folder
5. **Høyreklikk:** → "Edit"
6. **Finn linje ca 106:**
   ```html
   <script type="module" src="/src/main.tsx"></script>
   ```
7. **Erstatt med:**
   ```html
   <script type="module" crossorigin src="/assets/js/index-C8UgCmie.js"></script>
   ```
8. **Lagre** filen

### **Metode 2: Last opp riktig fil**
Jeg har laget en riktig fil for deg:

📁 **Fil å laste opp:** `/workspaces/snakkaz-chat/emergency-index.html`

1. **Last ned** denne filen fra workspace
2. **Gå til cPanel File Manager**
3. **Upload** `emergency-index.html`
4. **Høyreklikk** → "Rename" til `index.html`
5. **Bekreft** overskriving

## ✅ TEST
Etter fix:
1. **Gå til:** https://snakkaz.com  
2. **Trykk:** Ctrl+Shift+R (hard refresh)
3. **Sjekk console:** Skal ikke se main.tsx feil
4. **Appen skal laste** riktig

---

**DERETTER:** Kan vi starte med den store oppryddingen! 🚀
