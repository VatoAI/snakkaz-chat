# 🚨 EMERGENCY CSP FONT FIX - SNAKKAZ 🚨

## ⚠️ CRITICAL ISSUE IDENTIFIED

**Problem:** CSP header på serveren tillater IKKE Google Fonts!  
**Symptom:** `font-src 'self' data:` i stedet for `font-src 'self' https://fonts.gstatic.com`  

---

## 🚀 EMERGENCY SOLUTIONS:

### **OPTION 1: Quick .htaccess Upload (FASTEST)**

1. **Download:** `EMERGENCY-HTACCESS-FONT-FIX.txt`
2. **Rename:** til `.htaccess`
3. **Upload:** direkte til `/public_html/` 
4. **Overwrite:** existing .htaccess

### **OPTION 2: Full Package Update**

1. **Download:** `snakkaz-production-emergency-fix.zip`
2. **Upload + Extract** til `/public_html/`
3. **Overwrite all files**

---

## 🔧 FIXED CSP HEADER:

```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://wqp0ozrbxcucynsojmbk.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://wqp0ozrbxcucynsojmbk.supabase.co wss://wqp0ozrbxcucynsojmbk.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
```

**Key fixes:**
- ✅ `font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com`
- ✅ `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
- ✅ `connect-src` includes Google Fonts

---

## ⚡ IMMEDIATE ACTION REQUIRED:

1. **Download** `EMERGENCY-HTACCESS-FONT-FIX.txt`
2. **Rename** to `.htaccess`
3. **Upload** to cPanel `/public_html/`
4. **Test** www.snakkaz.com
5. **Verify** no more font CSP errors

---

## 📋 POST-FIX VERIFICATION:

### **Should be fixed:**
- ✅ Google Fonts laster
- ✅ No CSP font errors
- ✅ Typography fungerer

### **Still needs debugging:**
- 🔍 React createContext error
- 🔍 Full site functionality

---

**STATUS: EMERGENCY FIX READY - UPLOAD HTACCESS NOW! ⚡**
