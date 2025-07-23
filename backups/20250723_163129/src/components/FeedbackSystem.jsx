/**
 * SnakkaZ Beta - User Feedback & Improvement System  
 * Collects feedback, suggestions, bug reports, and improvement ideas
 * Created: 2025-07-22
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqpoozpbceucynsojmbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';

class FeedbackSystem {
    constructor() {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.isVisible = false;
        this.container = null;
        
        this.feedbackTypes = {
            general: { label: 'Generell Feedback', emoji: '💬' },
            bug: { label: 'Bug Report', emoji: '🐛' },
            feature: { label: 'Feature Request', emoji: '💡' },
            performance: { label: 'Ytelse Problem', emoji: '⚡' },
            security: { label: 'Sikkerhet Bekymring', emoji: '🔒' },
            ui: { label: 'Design/UI Forbedring', emoji: '🎨' },
            marketplace: { label: 'Marketplace Forbedring', emoji: '🛒' },
            mobile: { label: 'Mobil App Problem', emoji: '📱' }
        };

        this.initialize();
    }

    initialize() {
        this.createFloatingButton();
        this.setupAutoTriggers();
    }

    createFloatingButton() {
        const button = document.createElement('button');
        button.innerHTML = '💬 Feedback';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 50px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = '#1d4ed8';
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = '#2563eb';
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => this.show());
        
        document.body.appendChild(button);
    }

    show(defaultType = 'general') {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.container = document.createElement('div');
        this.container.className = 'feedback-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        `;

        modal.innerHTML = this.createFeedbackForm(defaultType);
        this.container.appendChild(modal);
        document.body.appendChild(this.container);

        // Setup form handlers
        this.setupFormHandlers();
        
        // Close on background click
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.hide();
        });
    }

    createFeedbackForm(defaultType) {
        return `
            <div style="padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 20px; font-weight: 600;">📝 SnakkaZ Beta Feedback</h2>
                    <button class="close-btn" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #666;">✕</button>
                </div>

                <form id="feedbackForm" style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px;">
                            Hva vil du gi feedback på?
                        </label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            ${Object.entries(this.feedbackTypes).map(([key, type]) => `
                                <button type="button" data-type="${key}" class="feedback-type-btn"
                                        style="padding: 8px; font-size: 12px; border: 2px solid #d1d5db; 
                                               border-radius: 8px; background: #f9fafb; cursor: pointer; 
                                               transition: all 0.2s ease;">
                                    ${type.emoji} ${type.label}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px;">
                            Hvor fornøyd er du med SnakkaZ Beta? (<span id="ratingValue">5</span>/10)
                        </label>
                        <input type="range" id="rating" min="1" max="10" value="5" 
                               style="width: 100%; accent-color: #2563eb;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666; margin-top: 4px;">
                            <span>1 - Ikke fornøyd</span>
                            <span>10 - Veldig fornøyd</span>
                        </div>
                    </div>

                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px;">
                            Din tilbakemelding
                        </label>
                        <textarea id="message" placeholder="Beskriv din opplevelse, foreslå forbedringer, eller rapporter problemer..." 
                                  required style="width: 100%; padding: 12px; border: 2px solid #d1d5db; 
                                                 border-radius: 8px; resize: vertical; font-family: inherit;"
                                  rows="4"></textarea>
                    </div>

                    <div>
                        <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px;">
                            E-post (valgfritt - for oppfølging)
                        </label>
                        <input type="email" id="email" placeholder="din@email.no" 
                               style="width: 100%; padding: 12px; border: 2px solid #d1d5db; 
                                      border-radius: 8px; font-family: inherit;">
                    </div>

                    <div style="background: #f9fafb; padding: 12px; border-radius: 8px;">
                        <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500;">💡 Hjelp oss å forbedre:</p>
                        <div style="font-size: 12px; color: #666; line-height: 1.4;">
                            • Hvordan kan vi gjøre appen raskere?<br>
                            • Hvilke funksjoner savner du?<br>
                            • Er det lett å finne det du leter etter?<br>
                            • Fungerer chat og marketplace godt?<br>
                            • Opplever du sikkerhetsproblemer?
                        </div>
                    </div>

                    <div style="display: flex; gap: 12px; padding-top: 16px;">
                        <button type="button" class="cancel-btn"
                                style="flex: 1; padding: 12px; background: #f3f4f6; color: #374151; 
                                       border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                            Avbryt
                        </button>
                        <button type="submit" id="submitBtn"
                                style="flex: 1; padding: 12px; background: #2563eb; color: white; 
                                       border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                            Send Feedback
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    setupFormHandlers() {
        const form = document.getElementById('feedbackForm');
        const rating = document.getElementById('rating');
        const ratingValue = document.getElementById('ratingValue');
        const typeButtons = document.querySelectorAll('.feedback-type-btn');
        const closeBtn = document.querySelector('.close-btn');
        const cancelBtn = document.querySelector('.cancel-btn');
        
        let selectedType = 'general';

        // Close handlers
        closeBtn.addEventListener('click', () => this.hide());
        cancelBtn.addEventListener('click', () => this.hide());

        // Rating slider
        rating.addEventListener('input', () => {
            ratingValue.textContent = rating.value;
        });

        // Type selection
        typeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                typeButtons.forEach(b => {
                    b.style.background = '#f9fafb';
                    b.style.borderColor = '#d1d5db';
                    b.style.color = '#374151';
                });
                
                btn.style.background = '#dbeafe';
                btn.style.borderColor = '#2563eb';
                btn.style.color = '#1d4ed8';
                
                selectedType = btn.getAttribute('data-type');
            });
        });

        // Set default selection
        if (typeButtons.length > 0) {
            typeButtons[0].click();
        }

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitFeedback({
                type: selectedType,
                rating: parseInt(rating.value),
                message: document.getElementById('message').value,
                email: document.getElementById('email').value
            });
        });
    }

    async submitFeedback(data) {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.textContent = 'Sender...';
        submitBtn.disabled = true;

        try {
            const feedbackData = {
                type: data.type,
                rating: data.rating,
                message: data.message,
                email: data.email || null,
                page: window.location.pathname,
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                timestamp: new Date().toISOString(),
                session_id: window.SnakkazAnalytics?.sessionId || 'unknown'
            };

            const { error } = await this.supabase
                .from('user_feedback')
                .insert([feedbackData]);

            if (error) throw error;

            // Track with analytics
            if (window.SnakkazAnalytics) {
                await window.SnakkazAnalytics.submitFeedback(data);
            }

            this.showSuccessMessage();
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            submitBtn.textContent = 'Feil - Prøv igjen';
            submitBtn.style.background = '#dc2626';
            setTimeout(() => {
                submitBtn.textContent = 'Send Feedback';
                submitBtn.style.background = '#2563eb';
                submitBtn.disabled = false;
            }, 3000);
        }
    }

    showSuccessMessage() {
        this.container.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 40px; text-align: center; max-width: 400px;">
                <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
                <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Takk for din feedback!</h3>
                <p style="margin: 0; color: #666; line-height: 1.5;">
                    Vi setter stor pris på din tilbakemelding og vil bruke den til å forbedre SnakkaZ Beta.
                </p>
            </div>
        `;

        setTimeout(() => this.hide(), 3000);
    }

    hide() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.isVisible = false;
    }

    setupAutoTriggers() {
        // Show feedback after 1 minute if not shown before
        setTimeout(() => {
            if (!localStorage.getItem('snakkaz_feedback_shown')) {
                this.show();
                localStorage.setItem('snakkaz_feedback_shown', 'true');
            }
        }, 60000);

        // Trigger feedback after errors
        window.addEventListener('error', () => {
            if (Math.random() < 0.1) {
                setTimeout(() => this.show('bug'), 2000);
            }
        });
    }

    // Public API
    triggerFor(action) {
        this.show(action);
    }
}

// Initialize feedback system
const feedbackSystem = new FeedbackSystem();
window.feedbackSystem = feedbackSystem;

console.log('✅ SnakkaZ Feedback System loaded and ready');

export default feedbackSystem;
