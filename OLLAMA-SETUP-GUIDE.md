# 🤖 SnakkaZ Ollama Setup Guide

## 📋 Installasjon av Ollama

### 1. Installer Ollama

```bash
# Linux/macOS
curl -fsSL https://ollama.com/install.sh | sh

# Eller last ned fra https://ollama.com/download
```

### 2. Start Ollama Service

```bash
# Start Ollama server (kjører på port 11434)
ollama serve
```

### 3. Test Installation

```bash
# Sjekk at Ollama kjører
curl http://localhost:11434/api/tags
```

---

## 🧠 Anbefalte AI Modeller for SnakkaZ

### **Norsk Chat & Samtale**

#### 1. Llama 3.2 3B (ANBEFALT for norsk)

```bash
ollama pull llama3.2:3b
```

- **Størrelse:** ~2.0 GB
- **Bruk:** Norsk chat, samtaler, hjelpsom AI
- **Minne:** ~3 GB RAM
- **Fordeler:** Rask, god norsk forståelse, lav ressursbruk

#### 2. Mistral 7B Instruct

```bash
ollama pull mistral:7b-instruct
```

- **Størrelse:** ~4.1 GB
- **Bruk:** Avanserte samtaler, flerspråklig
- **Minne:** ~6 GB RAM
- **Fordeler:** Meget god tekst-kvalitet

### **Kode & Teknisk Support**

#### 3. CodeLlama 7B

```bash
ollama pull codellama:7b
```

- **Størrelse:** ~3.8 GB
- **Bruk:** TypeScript, React, debugging
- **Minne:** ~5 GB RAM
- **Fordeler:** Ekspert på kode-generering

#### 4. CodeLlama 7B Instruct

```bash
ollama pull codellama:7b-instruct
```

- **Størrelse:** ~3.8 GB
- **Bruk:** Code chat, forklaringer
- **Minne:** ~5 GB RAM
- **Fordeler:** Bedre for code conversations

### **Embeddings & Søk**

#### 5. Nomic Embed Text

```bash
ollama pull nomic-embed-text
```

- **Størrelse:** ~274 MB
- **Bruk:** Tekst embeddings, semantisk søk
- **Minne:** ~500 MB RAM
- **Fordeler:** Rask, effektiv for søk

### **Multimodal (Bilde + Tekst)**

#### 6. LLaVA 7B (Fremtidig)

```bash
ollama pull llava:7b
```

- **Størrelse:** ~4.5 GB
- **Bruk:** Bilde-analyse, multimodal chat
- **Minne:** ~6 GB RAM
- **Fordeler:** Kan analysere bilder

---

## ⚡ SnakkaZ Quick Start

### 1. Essential Models Setup

```bash
# Installer kun det essensielle først (anbefalt rekkefølge)
ollama pull llama3.2:3b         # Norsk chat (høyest prioritet)
ollama pull nomic-embed-text    # Søk & embeddings
ollama pull codellama:7b        # Kode-assistanse
```

**Total størrelse:** ~6 GB
**Minne behov:** ~8 GB RAM

### 2. Test Norsk Chat

```bash
# Test norsk samtale
ollama run llama3.2:3b "Hei! Kan du hjelpe meg med SnakkaZ chat?"
```

### 3. Test Kode-generering

```bash
# Test TypeScript kode
ollama run codellama:7b "Lag en React komponent for chat i TypeScript"
```

---

## 🔧 SnakkaZ Integration

### Automatisk Setup Script

```bash
#!/bin/bash
# snakkaz-ollama-setup.sh

echo "🌊 SnakkaZ Ollama Setup - Starter installasjon..."

# Sjekk om Ollama er installert
if ! command -v ollama &> /dev/null; then
    echo "📦 Installerer Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
else
    echo "✅ Ollama allerede installert"
fi

# Start Ollama service (i bakgrunnen)
echo "🚀 Starter Ollama server..."
ollama serve &
sleep 5

# Installer essensielle modeller
echo "🧠 Installer AI modeller for SnakkaZ..."

echo "📥 Laster ned Llama 3.2 3B (norsk chat)..."
ollama pull llama3.2:3b

echo "📥 Laster ned Nomic Embed (søk)..."
ollama pull nomic-embed-text

echo "📥 Laster ned CodeLlama 7B (kode)..."
ollama pull codellama:7b

echo "✅ SnakkaZ Ollama setup komplett!"
echo "🌊 Du kan nå bruke AI-funksjoner i SnakkaZ!"

# Test
echo "🧪 Testing modeller..."
ollama run llama3.2:3b "Hei! Jeg er SnakkaZ AI. Klar til å hjelpe deg!" --verbose=false
```

### Environment Setup

```bash
# .env.local tillegg
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_DEFAULT_MODEL=llama3.2:3b
VITE_OLLAMA_CODE_MODEL=codellama:7b
VITE_OLLAMA_EMBED_MODEL=nomic-embed-text
```

---

## 📊 System Requirements

### **Minimum (Basis SnakkaZ)**

- **RAM:** 8 GB
- **Lagring:** 10 GB fri
- **Modeller:** llama3.2:3b + nomic-embed-text
- **Bruk:** Grunnleggende norsk chat

### **Anbefalt (Full SnakkaZ)**

- **RAM:** 16 GB
- **Lagring:** 20 GB fri
- **GPU:** CUDA-kompatibel (valgfritt, men raskere)
- **Modeller:** Alle anbefalte modeller
- **Bruk:** Full AI-funksjonalitet

### **Optimal (Produksjon)**

- **RAM:** 32 GB+
- **Lagring:** 50 GB+ SSD
- **GPU:** NVIDIA RTX 4070+
- **Nettverk:** Høy båndbredde for flere brukere

---

## 🚀 SnakkaZ-Specific Commands

### Start Complete SnakkaZ AI Stack

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start SnakkaZ Dev
cd /workspaces/snakkaz-chat
npm run dev

# Terminal 3: Monitor AI Usage
watch -n 1 'ollama ps'
```

### Monitor Model Performance

```bash
# Se kjørende modeller
ollama ps

# Se modell detaljer
ollama show llama3.2:3b

# Test responstid
time ollama run llama3.2:3b "Hvor lang tid tar dette?"
```

---

## 🔍 Feilsøking

### Ollama Kjører Ikke

```bash
# Sjekk prosess
ps aux | grep ollama

# Kill og restart
pkill ollama
ollama serve
```

### Modell Feil

```bash
# List tilgjengelige modeller
ollama list

# Remove og reinstaller
ollama rm llama3.2:3b
ollama pull llama3.2:3b
```

### Minne Problemer

```bash
# Sjekk minnebruk
ollama ps

# Stop unødvendige modeller
ollama stop mistral:7b
```

---

## 📈 Performance Tips

1. **GPU Acceleration:** Installer CUDA for NVIDIA GPU
2. **Model Quantization:** Bruk 4-bit modeller for mindre minnebruk
3. **Concurrent Limits:** Begrengs antall samtidige forespørsler
4. **Model Caching:** Hold populære modeller i minne
5. **System Monitoring:** Overvåk CPU/GPU/RAM kontinuerlig

---

## 🎯 Neste Steg

1. ✅ Installer grunnleggende modeller
2. 🔧 Integrer med SnakkaZ frontend
3. 🧠 Test norsk chat-funksjonalitet
4. 📊 Setup monitoring dashboard
5. 🚀 Deploy til produksjon

**God coding! 🌊🇳🇴**
