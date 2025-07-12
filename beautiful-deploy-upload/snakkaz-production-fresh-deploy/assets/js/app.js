// SnakkaZ Production JavaScript - Lightweight & Fast
class SnakkaZApp {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.fadeInContent();
        });
        console.log('🚀 SnakkaZ ready!');
    }

    setupEventListeners() {
        // Form handling
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    fadeInContent() {
        const main = document.querySelector('main');
        if (main) main.classList.add('loading');
    }

    handleFormSubmit(event, form) {
        event.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        if (this.validateEmail(email)) {
            this.showMessage('Takk! Vi sender deg en invitasjon så snart beta er klar! 🚀', 'success');
            form.reset();
        } else {
            this.showMessage('Vennligst skriv inn en gyldig e-postadresse.', 'error');
        }
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.innerHTML = `
            <div style="position:fixed;top:20px;right:20px;background:${type === 'success' ? '#4ecdc4' : '#ff6b6b'};color:white;padding:15px 20px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.2);z-index:10000;transform:translateX(100%);transition:transform 0.3s ease;">
                ${message}
            </div>
        `;
        document.body.appendChild(messageEl);
        setTimeout(() => messageEl.firstElementChild.style.transform = 'translateX(0)', 100);
        setTimeout(() => document.body.removeChild(messageEl), 5000);
    }
}

new SnakkaZApp();
