#!/bin/bash

# 🌊 SnakkaZ Ollama Setup Script
# Automatisk installasjon og konfigurasjon av AI modeller

set -e  # Exit on any error

echo "🌊 =====================================================
       SnakkaZ Ollama AI Setup
       Installerer lokale AI modeller for SnakkaZ
======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check system requirements
check_requirements() {
    log_info "Sjekker system requirements..."
    
    # Check RAM
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        total_ram=$(free -g | awk '/^Mem:/{print $2}')
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        total_ram=$(($(sysctl -n hw.memsize) / 1024 / 1024 / 1024))
    else
        total_ram=8  # Assume 8GB if can't detect
    fi
    
    if [ "$total_ram" -lt 8 ]; then
        log_warning "Systemet har kun ${total_ram}GB RAM. Anbefaler minimum 8GB for Ollama."
        read -p "Vil du fortsette likevel? (y/N): " continue_setup
        if [[ ! "$continue_setup" =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        log_success "RAM OK: ${total_ram}GB tilgjengelig"
    fi
    
    # Check disk space
    available_space=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
    if [ "$available_space" -lt 20 ]; then
        log_warning "Kun ${available_space}GB ledig diskplass. Anbefaler minimum 20GB."
        read -p "Vil du fortsette likevel? (y/N): " continue_setup
        if [[ ! "$continue_setup" =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        log_success "Diskplass OK: ${available_space}GB tilgjengelig"
    fi
}

# Install Ollama if not present
install_ollama() {
    if command_exists ollama; then
        log_success "Ollama allerede installert"
        ollama --version
        return 0
    fi
    
    log_info "Installerer Ollama..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://ollama.com/install.sh | sh
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists brew; then
            brew install ollama
        else
            curl -fsSL https://ollama.com/install.sh | sh
        fi
    else
        log_error "Unsupported OS. Please install Ollama manually from https://ollama.com"
        exit 1
    fi
    
    if command_exists ollama; then
        log_success "Ollama installert!"
        ollama --version
    else
        log_error "Ollama installasjon feilet"
        exit 1
    fi
}

# Start Ollama server
start_ollama() {
    log_info "Starter Ollama server..."
    
    # Check if already running
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        log_success "Ollama server kjører allerede"
        return 0
    fi
    
    # Start in background
    nohup ollama serve > ollama.log 2>&1 &
    
    # Wait for server to start
    local timeout=30
    local count=0
    while [ $count -lt $timeout ]; do
        if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
            log_success "Ollama server startet på port 11434"
            return 0
        fi
        sleep 1
        count=$((count + 1))
    done
    
    log_error "Ollama server startet ikke innen ${timeout} sekunder"
    exit 1
}

# Pull a model with progress
pull_model() {
    local model=$1
    local description=$2
    
    log_info "Laster ned $model ($description)..."
    
    # Check if model already exists
    if ollama list | grep -q "$model"; then
        log_success "$model allerede installert"
        return 0
    fi
    
    # Pull model
    if ollama pull "$model"; then
        log_success "$model installert!"
    else
        log_error "Feil ved nedlasting av $model"
        return 1
    fi
}

# Install essential models
install_models() {
    log_info "Installerer essensielle AI modeller for SnakkaZ..."
    
    # Essential models for SnakkaZ
    declare -A models=(
        ["llama3.2:3b"]="Norsk chat & samtaler (høyest prioritet)"
        ["nomic-embed-text"]="Tekst embeddings for søk"
        ["codellama:7b"]="Kode-assistanse TypeScript/React"
    )
    
    local failed_models=()
    
    for model in "${!models[@]}"; do
        if ! pull_model "$model" "${models[$model]}"; then
            failed_models+=("$model")
        fi
    done
    
    if [ ${#failed_models[@]} -eq 0 ]; then
        log_success "Alle essensielle modeller installert!"
    else
        log_warning "Følgende modeller feilet: ${failed_models[*]}"
    fi
}

# Install optional models
install_optional_models() {
    log_info "Ønsker du å installere valgfrie modeller? (krever mer diskplass)"
    
    declare -A optional_models=(
        ["mistral:7b-instruct"]="Avansert flerspråklig modell (4.1GB)"
        ["llava:7b"]="Multimodal (tekst + bilde) modell (4.5GB)"
    )
    
    for model in "${!optional_models[@]}"; do
        echo
        read -p "Installer $model - ${optional_models[$model]}? (y/N): " install_model
        if [[ "$install_model" =~ ^[Yy]$ ]]; then
            pull_model "$model" "${optional_models[$model]}"
        fi
    done
}

# Test models
test_models() {
    log_info "Testing AI modeller..."
    
    # Test Norwegian chat
    if ollama list | grep -q "llama3.2:3b"; then
        log_info "Testing norsk chat..."
        echo "🧪 Test: Norsk AI Chat"
        echo "Prompt: 'Hei! Kan du hjelpe meg med SnakkaZ?'"
        echo "Response:"
        echo "─────────────────────────────────────────"
        ollama run llama3.2:3b "Hei! Kan du hjelpe meg med SnakkaZ? Svar kort på norsk." 2>/dev/null
        echo "─────────────────────────────────────────"
        log_success "Norsk chat fungerer!"
    fi
    
    # Test code generation
    if ollama list | grep -q "codellama:7b"; then
        echo
        log_info "Testing kode-generering..."
        echo "🧪 Test: TypeScript Code Generation"
        echo "Prompt: 'Create a simple React button component'"
        echo "Response:"
        echo "─────────────────────────────────────────"
        ollama run codellama:7b "Create a simple React button component in TypeScript. Keep it brief." 2>/dev/null
        echo "─────────────────────────────────────────"
        log_success "Kode-generering fungerer!"
    fi
}

# Create environment config
create_env_config() {
    log_info "Oppretter miljøkonfigurasjon..."
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        touch .env.local
    fi
    
    # Add Ollama config if not present
    if ! grep -q "VITE_OLLAMA_URL" .env.local; then
        echo "
# Ollama AI Configuration
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_DEFAULT_MODEL=llama3.2:3b
VITE_OLLAMA_CODE_MODEL=codellama:7b
VITE_OLLAMA_EMBED_MODEL=nomic-embed-text
VITE_OLLAMA_ENABLED=true" >> .env.local
        
        log_success "Ollama konfigurasjon lagt til .env.local"
    else
        log_success "Ollama konfigurasjon allerede i .env.local"
    fi
}

# Main setup function
main() {
    echo
    log_info "Starter SnakkaZ Ollama setup..."
    
    # Check requirements
    check_requirements
    
    # Install Ollama
    install_ollama
    
    # Start server
    start_ollama
    
    # Install models
    install_models
    
    # Ask for optional models
    echo
    read -p "🤔 Installer valgfrie modeller? (krever mer plass) (y/N): " install_optional
    if [[ "$install_optional" =~ ^[Yy]$ ]]; then
        install_optional_models
    fi
    
    # Test functionality
    echo
    read -p "🧪 Test AI modeller? (y/N): " test_ai
    if [[ "$test_ai" =~ ^[Yy]$ ]]; then
        test_models
    fi
    
    # Create environment config
    create_env_config
    
    # Final status
    echo
    echo "🌊 ================================================="
    log_success "SnakkaZ Ollama setup komplett!"
    echo "================================================="
    echo
    echo "📊 Installerte modeller:"
    ollama list
    echo
    echo "🚀 Neste steg:"
    echo "   1. Start SnakkaZ: npm run dev"
    echo "   2. Gå til http://localhost:4000/beta"
    echo "   3. Test AI chat-funksjonalitet"
    echo
    echo "🔧 Nyttige kommandoer:"
    echo "   ollama list          - Vis installerte modeller"
    echo "   ollama ps            - Vis kjørende modeller"
    echo "   ollama run <model>   - Test en modell"
    echo "   ollama serve         - Start server manuelt"
    echo
    log_success "Happy coding med SnakkaZ AI! 🇳🇴🤖"
}

# Run main function
main "$@"
