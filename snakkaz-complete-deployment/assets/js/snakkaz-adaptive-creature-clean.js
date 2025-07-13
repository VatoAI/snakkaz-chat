/* 
🐛 SNAKKAZ ADAPTIVE CREATURE - CLEAN VERSION
Simple, syntax-error-free creature system
*/

class SnakkaZCreature {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            phase: 'larva',
            size: options.size || 'medium',
            userId: options.userId || 'default'
        };
        
        this.stats = {
            level: 1,
            phase: 'larva'
        };
        
        this.magicSystem = {
            clickChance: 0.15,
            sparkleActive: false,
            lastClick: 0,
            clickCooldown: 3000
        };
        
        this.init();
    }
    
    init() {
        this.createCreatureElement();
        this.bindEvents();
    }
    
    createCreatureElement() {
        const creatureHTML = `
            <div class="snakkaz-creature creature-larva creature-${this.options.size}" 
                 style="
                     position: relative;
                     display: inline-block;
                     font-size: 2em;
                     cursor: pointer;
                     animation: crawlAround 8s infinite linear;
                     user-select: none;
                 ">
                <span class="creature-emoji">🐛</span>
            </div>
        `;
        
        this.container.innerHTML = creatureHTML;
        this.element = this.container.querySelector('.snakkaz-creature');
        
        console.log('🐛 SnakkaZ Creature created!');
    }
    
    bindEvents() {
        if (this.element) {
            this.element.addEventListener('click', () => {
                this.handleMagicClick();
            });
        }
    }
    
    handleMagicClick() {
        const now = Date.now();
        if (now - this.magicSystem.lastClick < this.magicSystem.clickCooldown) {
            return;
        }
        
        this.magicSystem.lastClick = now;
        
        if (Math.random() < this.magicSystem.clickChance) {
            this.triggerMagicSparkle();
        }
        
        console.log('🐛 Creature clicked!');
    }
    
    triggerMagicSparkle() {
        if (this.magicSystem.sparkleActive) return;
        
        this.magicSystem.sparkleActive = true;
        
        // Add sparkle effect
        this.element.style.transform = 'scale(1.2)';
        this.element.style.filter = 'drop-shadow(0 0 10px gold)';
        
        setTimeout(() => {
            this.element.style.transform = 'scale(1)';
            this.element.style.filter = 'none';
            this.magicSystem.sparkleActive = false;
        }, 1000);
        
        console.log('✨ Magic sparkle triggered!');
    }
}

// Make available globally
window.SnakkaZCreature = SnakkaZCreature;

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('loading-creature');
    if (container && !window.snakkazCreature) {
        window.snakkazCreature = new SnakkaZCreature(container, {
            phase: 'larva',
            size: 'hero',
            userId: 'main-user'
        });
        console.log('🐛 Auto-initialized SnakkaZ Creature!');
    }
});

console.log('🐛 SnakkaZ Creature System loaded!');
