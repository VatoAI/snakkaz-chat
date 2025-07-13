/**
 * 🐛 SNAKKAZ ADAPTIVE CREATURE SYSTEM
 * Living creature that evolves with user activity (16-100 years)
 * Smart gamification system with emotional connection
 */

class SnakkaZCreature {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            phase: 'larva', // larva, water, dragonfly, legendary
            size: 'medium', // tiny, small, medium, large, hero
            autoEvolve: true,
            saveProgress: true,
            userId: options.userId || 'default',
            ...options
        };

        // 🎮 Creature stats
        this.stats = {
            level: 1,
            experience: 0,
            chatMessages: 0,
            timeActive: 0,
            friendsAdded: 0,
            phase: this.options.phase,
            lastSeen: Date.now(),
            achievements: []
        };

        // 🎯 Evolution thresholds
        this.evolutionThresholds = {
            larva: { messages: 0, friends: 0, timeActive: 0 },
            water: { messages: 50, friends: 2, timeActive: 300000 }, // 5 min
            dragonfly: { messages: 200, friends: 5, timeActive: 1800000 }, // 30 min
            legendary: { messages: 1000, friends: 15, timeActive: 7200000 } // 2 hours
        };

        // 🎨 Creature emojis by phase - ØYESTIKKER TRANSFORMATION! 🍎→🐛→🌊→🦋
        this.phaseEmojis = {
            apple: '🍎',        // Livets tre eple - creature starts here
            larva: '🐛',        // Larve som kommer ut av eplet
            water: '💧',        // Underwater transformation phase 
            dragonfly: '🦋',    // ØYESTIKKER/Dragonfly - beautiful wings!
            legendary: '✨🦋✨' // Legendary øyestikker with magic sparkles
        };

        // 🌳 Tree of Life concept - larva emerges from apple
        this.treeOfLife = {
            apple: '🍎🌳',      // Apple on the tree of life
            emergence: '🍎➡️🐛', // Larva emerging from apple
            blessing: '✨🌳✨'   // Tree blessing the transformation
        };

        // ✨ Magic interaction system
        this.magicSystem = {
            clickChance: 0.15, // 15% chance to catch the larva
            sparkleActive: false,
            lastClick: 0,
            clickCooldown: 3000, // 3 seconds between attempts
            sounds: {
                magic: '/assets/sounds/magic-sparkle.mp3',
                miss: '/assets/sounds/creature-escape.mp3'
            }
        };

        this.init();
    }

    init() {
        this.loadProgress();
        this.createCreatureElement();
        this.bindEvents();
        this.startActivityTracking();
        this.checkEvolution();

        console.log('🐛 SnakkaZ Adaptive Creature initialized:', this.stats);
    }

    createCreatureElement() {
        const creatureHTML = `
            <div class="snakkaz-creature creature-${this.stats.phase} creature-${this.options.size}" 
                 data-phase="${this.stats.phase}" 
                 data-level="${this.stats.level}">
                <div class="creature-environment ${this.getEnvironment()}"></div>
                <div class="creature-body">
                    <span class="creature-emoji">${this.phaseEmojis[this.stats.phase]}</span>
                </div>
                <div class="creature-stats">
                    Level ${this.stats.level} • ${this.stats.phase} • ${this.stats.chatMessages} msgs
                </div>
                ${this.getAchievementBadges()}
            </div>
        `;

        this.container.innerHTML = creatureHTML;
        this.element = this.container.querySelector('.snakkaz-creature');
    }

    getEnvironment() {
        switch (this.stats.phase) {
            case 'larva': return 'ground';
            case 'water': return 'water';
            case 'dragonfly':
            case 'legendary': return 'air';
            default: return 'ground';
        }
    }

    getAchievementBadges() {
        if (this.stats.achievements.length === 0) return '';

        return `<div class="creature-achievement">🏆</div>`;
    }

    bindEvents() {
        if (!this.element) return;

        // 🎯 Click interaction
        this.element.addEventListener('click', () => {
            this.interact('click');
        });

        // 🌊 Hover effects
        this.element.addEventListener('mouseenter', () => {
            this.interact('hover');
        });

        // 🎮 Keyboard interaction (accessibility)
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.interact('click');
            }
        });

        // Make focusable for accessibility
        this.element.setAttribute('tabindex', '0');
        this.element.setAttribute('role', 'button');
        this.element.setAttribute('aria-label', `SnakkaZ creature, ${this.stats.phase} phase, level ${this.stats.level}`);
    }

    interact(type) {
        switch (type) {
            case 'click':
                this.handleMagicClick();
                break;
            case 'hover':
                this.showEmotion('happy');
                break;
        }
    }

    handleMagicClick() {
        const now = Date.now();

        // Cooldown check
        if (now - this.magicSystem.lastClick < this.magicSystem.clickCooldown) {
            return;
        }

        this.magicSystem.lastClick = now;

        // Random chance to catch the creature
        const caught = Math.random() < this.magicSystem.clickChance;

        if (caught && this.stats.phase === 'larva') {
            this.triggerMagicSparkle();
            this.playSound('magic');
            this.addExperience(25); // Bonus XP for catching
            this.showEmotion('magical');
        } else {
            this.escapeAnimation();
            this.playSound('miss');
            this.showEmotion('playful');
        }
    }

    triggerMagicSparkle() {
        if (this.magicSystem.sparkleActive) return;

        this.magicSystem.sparkleActive = true;

        // Create sparkle effect
        const sparkles = document.createElement('div');
        sparkles.className = 'magic-sparkles';
        sparkles.innerHTML = '✨💫⭐🌟✨';
        sparkles.style.cssText = `
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 20px;
            animation: sparkleFloat 2s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;

        this.element.appendChild(sparkles);

        // Add sparkle animation CSS if not exists
        this.addSparkleCSS();

        // Remove sparkles after animation
        setTimeout(() => {
            if (sparkles.parentNode) {
                sparkles.parentNode.removeChild(sparkles);
            }
            this.magicSystem.sparkleActive = false;
        }, 2000);
    }

    escapeAnimation() {
        if (!this.element) return;

        // Quick escape animation
        this.element.style.transform = 'scale(0.8) rotate(15deg)';
        this.element.style.transition = 'transform 0.3s ease-out';

        setTimeout(() => {
            this.element.style.transform = '';
            this.element.style.transition = '';
        }, 300);
    }

    playSound(type) {
        try {
            const soundUrl = this.magicSystem.sounds[type];
            if (soundUrl) {
                const audio = new Audio(soundUrl);
                audio.volume = 0.3; // Subtle volume
                audio.play().catch(() => { }); // Fail silently if no audio
            }
        } catch (e) {
            // Fail silently for audio issues
        }
    }

    addSparkleCSS() {
        if (document.querySelector('#sparkle-animations')) return;

        const style = document.createElement('style');
        style.id = 'sparkle-animations';
        style.textContent = `
            @keyframes sparkleFloat {
                0% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0) scale(1);
                }
                50% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(-30px) scale(1.2);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-60px) scale(0.5);
                }
            }
            
            .creature-phase-magical {
                animation: magicalGlow 1s ease-in-out;
                filter: drop-shadow(0 0 10px gold);
            }
            
            @keyframes magicalGlow {
                0%, 100% { filter: drop-shadow(0 0 5px gold); }
                50% { filter: drop-shadow(0 0 15px gold) brightness(1.2); }
            }
        `;
        document.head.appendChild(style);
    }

    showEmotion(emotion) {
        if (!this.element) return;

        // Remove existing emotion classes
        this.element.classList.remove('creature-happy', 'creature-excited', 'creature-sleeping', 'creature-magical', 'creature-playful');

        // Add new emotion
        this.element.classList.add(`creature-${emotion}`);

        // Special handling for magical emotion
        if (emotion === 'magical') {
            this.element.classList.add('creature-phase-magical');
            setTimeout(() => {
                this.element.classList.remove('creature-phase-magical');
            }, 1000);
        }

        // Remove after animation
        setTimeout(() => {
            this.element.classList.remove(`creature-${emotion}`);
        }, emotion === 'excited' || emotion === 'magical' ? 1500 : 2000);
    }

    // 🎮 Activity tracking methods
    onChatMessage() {
        this.stats.chatMessages++;
        this.stats.lastSeen = Date.now();
        this.addExperience(2);
        this.checkEvolution();
        this.saveProgress();

        // Random creature reaction
        if (Math.random() > 0.7) {
            this.showEmotion('happy');
        }
    }

    onFriendAdded() {
        this.stats.friendsAdded++;
        this.addExperience(20);
        this.showEmotion('excited');
        this.checkEvolution();
        this.saveProgress();
    }

    addExperience(amount) {
        this.stats.experience += amount;

        // Level up every 100 XP
        const newLevel = Math.floor(this.stats.experience / 100) + 1;
        if (newLevel > this.stats.level) {
            this.levelUp(newLevel);
        }
    }

    levelUp(newLevel) {
        this.stats.level = newLevel;
        this.showEmotion('excited');
        this.updateStatsDisplay();

        console.log(`🎉 SnakkaZ creature leveled up to ${newLevel}!`);

        // Achievement check
        this.checkAchievements();
    }

    checkEvolution() {
        const currentPhase = this.stats.phase;
        let newPhase = currentPhase;

        // Check if creature meets evolution criteria
        for (const [phase, requirements] of Object.entries(this.evolutionThresholds)) {
            if (this.stats.chatMessages >= requirements.messages &&
                this.stats.friendsAdded >= requirements.friends &&
                this.stats.timeActive >= requirements.timeActive) {
                newPhase = phase;
            }
        }

        if (newPhase !== currentPhase && this.options.autoEvolve) {
            this.evolve(newPhase);
        }
    }

    evolve(newPhase) {
        if (newPhase === this.stats.phase) return;

        console.log(`🔄 SnakkaZ creature evolving from ${this.stats.phase} to ${newPhase}!`);

        this.stats.phase = newPhase;

        // Show evolution animation
        if (this.element) {
            this.element.classList.add('creature-evolving');

            setTimeout(() => {
                // Update creature appearance
                this.element.classList.remove(`creature-${this.getOldPhase()}`);
                this.element.classList.add(`creature-${newPhase}`);
                this.element.setAttribute('data-phase', newPhase);

                // Update emoji
                const emojiElement = this.element.querySelector('.creature-emoji');
                if (emojiElement) {
                    emojiElement.textContent = this.phaseEmojis[newPhase];
                }

                // Update environment
                const envElement = this.element.querySelector('.creature-environment');
                if (envElement) {
                    envElement.className = `creature-environment ${this.getEnvironment()}`;
                }

                this.element.classList.remove('creature-evolving');
                this.updateStatsDisplay();

            }, 1500); // Mid-evolution
        }

        // Achievement for evolution
        this.unlockAchievement(`evolved_to_${newPhase}`);
        this.saveProgress();
    }

    getOldPhase() {
        // Helper to get previous phase for class removal
        const phases = ['larva', 'water', 'dragonfly', 'legendary'];
        const currentIndex = phases.indexOf(this.stats.phase);
        return currentIndex > 0 ? phases[currentIndex - 1] : 'larva';
    }

    checkAchievements() {
        const achievements = [
            { id: 'first_chat', name: 'First Words', requirement: () => this.stats.chatMessages >= 1 },
            { id: 'social_butterfly', name: 'Social Butterfly', requirement: () => this.stats.friendsAdded >= 5 },
            { id: 'level_10', name: 'Growing Strong', requirement: () => this.stats.level >= 10 },
            { id: 'chat_master', name: 'Chat Master', requirement: () => this.stats.chatMessages >= 500 },
            { id: 'time_lord', name: 'Time Lord', requirement: () => this.stats.timeActive >= 3600000 } // 1 hour
        ];

        achievements.forEach(achievement => {
            if (!this.stats.achievements.includes(achievement.id) && achievement.requirement()) {
                this.unlockAchievement(achievement.id);
            }
        });
    }

    unlockAchievement(achievementId) {
        if (this.stats.achievements.includes(achievementId)) return;

        this.stats.achievements.push(achievementId);
        this.showEmotion('excited');

        console.log(`🏆 Achievement unlocked: ${achievementId}`);

        // Update badge display
        this.updateAchievementBadges();
    }

    updateStatsDisplay() {
        const statsElement = this.element?.querySelector('.creature-stats');
        if (statsElement) {
            statsElement.textContent = `Level ${this.stats.level} • ${this.stats.phase} • ${this.stats.chatMessages} msgs`;
        }

        // Update aria-label for accessibility
        if (this.element) {
            this.element.setAttribute('aria-label',
                `SnakkaZ creature, ${this.stats.phase} phase, level ${this.stats.level}`);
        }
    }

    updateAchievementBadges() {
        const existingBadge = this.element?.querySelector('.creature-achievement');
        if (this.stats.achievements.length > 0 && !existingBadge) {
            const badge = document.createElement('div');
            badge.className = 'creature-achievement';
            badge.textContent = '🏆';
            this.element.appendChild(badge);
        }
    }

    startActivityTracking() {
        // Track time active
        this.activityInterval = setInterval(() => {
            this.stats.timeActive += 5000; // 5 seconds
            this.checkEvolution();
        }, 5000);

        // Check if creature should sleep when inactive
        this.sleepCheckInterval = setInterval(() => {
            const timeSinceLastSeen = Date.now() - this.stats.lastSeen;
            if (timeSinceLastSeen > 60000) { // 1 minute inactive
                this.showEmotion('sleeping');
            }
        }, 30000);
    }

    saveProgress() {
        if (!this.options.saveProgress) return;

        try {
            const saveData = {
                stats: this.stats,
                timestamp: Date.now()
            };
            localStorage.setItem(`snakkaz_creature_${this.options.userId}`, JSON.stringify(saveData));
        } catch (e) {
            console.warn('Could not save creature progress:', e);
        }
    }

    loadProgress() {
        if (!this.options.saveProgress) return;

        try {
            const saved = localStorage.getItem(`snakkaz_creature_${this.options.userId}`);
            if (saved) {
                const saveData = JSON.parse(saved);
                this.stats = { ...this.stats, ...saveData.stats };

                // Calculate time away (creature missed you!)
                const timeAway = Date.now() - saveData.timestamp;
                if (timeAway > 300000) { // 5 minutes away
                    setTimeout(() => {
                        this.showEmotion('excited'); // Happy to see you back!
                    }, 1000);
                }
            }
        } catch (e) {
            console.warn('Could not load creature progress:', e);
        }
    }

    // 🧹 Cleanup
    destroy() {
        if (this.activityInterval) clearInterval(this.activityInterval);
        if (this.sleepCheckInterval) clearInterval(this.sleepCheckInterval);
        this.saveProgress();
    }

    // 🎯 Manual controls for testing/admin
    forceEvolve(phase) {
        if (this.evolutionThresholds[phase]) {
            this.evolve(phase);
        }
    }

    addManualExperience(amount) {
        this.addExperience(amount);
    }

    resetCreature() {
        this.stats = {
            level: 1,
            experience: 0,
            chatMessages: 0,
            timeActive: 0,
            friendsAdded: 0,
            phase: 'larva',
            lastSeen: Date.now(),
            achievements: []
        };
        this.createCreatureElement();
        this.bindEvents();
        this.saveProgress();
    }
}

// 🌟 Global SnakkaZ Creature Manager
window.SnakkaZCreatureManager = {
    creatures: new Map(),

    create(containerId, options = {}) {
        const container = document.getElementById(containerId) || document.querySelector(containerId);
        if (!container) {
            console.error('SnakkaZ Creature: Container not found:', containerId);
            return null;
        }

        const creature = new SnakkaZCreature(container, options);
        this.creatures.set(containerId, creature);
        return creature;
    },

    get(containerId) {
        return this.creatures.get(containerId);
    },

    // 🎮 Global event handlers for app integration
    onChatMessage(userId = 'default') {
        this.creatures.forEach(creature => {
            if (creature.options.userId === userId) {
                creature.onChatMessage();
            }
        });
    },

    onFriendAdded(userId = 'default') {
        this.creatures.forEach(creature => {
            if (creature.options.userId === userId) {
                creature.onFriendAdded();
            }
        });
    },

    destroyAll() {
        this.creatures.forEach(creature => creature.destroy());
        this.creatures.clear();
    }
};

// 🚀 Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Look for creatures to auto-initialize
    document.querySelectorAll('[data-snakkaz-creature]').forEach(container => {
        const options = {
            size: container.dataset.size || 'medium',
            phase: container.dataset.phase || 'larva',
            userId: container.dataset.userId || 'default',
            autoEvolve: container.dataset.autoEvolve !== 'false'
        };

        window.SnakkaZCreatureManager.create(container.id || container, options);
    });

    console.log('🐛 SnakkaZ Adaptive Creature System ready!');
});

// Make classes globally available
window.SnakkaZCreature = SnakkaZCreature;

console.log('🐛 SnakkaZ Adaptive Creature System ready!');
});

// 🧹 Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.SnakkaZCreatureManager.destroyAll();
});

export { SnakkaZCreature };
