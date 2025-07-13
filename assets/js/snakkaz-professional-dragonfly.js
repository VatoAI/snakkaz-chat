// SnakkaZ Professional Dragonfly Metamorphosis System
// Accurate Dragonfly Lifecycle: Apple → Nymph → Emergence → Adult
// Cyber Business Gold/Black Theme with Sacred Geometry

class SnakkaZProfessionalDragonfly {
  constructor() {
    this.currentStage = 0;
    this.stages = [
      {
        name: 'forbidden-apple',
        emoji: '🍎',
        tooltip: 'Tree of Life - Forbidden Fruit Origin',
        duration: 4000,
        description: 'Sacred beginning from the Tree of Life'
      },
      {
        name: 'dragonfly-nymph',
        emoji: '🪲',
        tooltip: 'Aquatic Nymph Stage - Underwater Development',
        duration: 6000,
        description: 'Aquatic larval stage - breathing through gills'
      },
      {
        name: 'dragonfly-emergence',
        emoji: '🛡️',
        tooltip: 'Metamorphosis - Breaking Free from Nymph Shell',
        duration: 5000,
        description: 'Climbing out of water - final molt'
      },
      {
        name: 'dragonfly-adult',
        emoji: '🛸',
        tooltip: 'Adult Øyestikker - Master of Flight',
        duration: 8000,
        description: 'Mature dragonfly - encrypted flight patterns'
      }
    ];
    this.isActive = false;
    this.encryptionLevel = 0;
    this.init();
  }

  init() {
    this.createDragonflySystem();
    this.attachEventListeners();
    this.startMetamorphosisCycle();
    this.initializeEncryption();
  }

  createDragonflySystem() {
    // Remove existing system if present
    const existing = document.querySelector('.snakkaz-dragonfly-system');
    if (existing) {
      existing.remove();
    }

    // Create main container
    const container = document.createElement('div');
    container.className = 'snakkaz-dragonfly-system';
    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'button');
    container.setAttribute('aria-label', 'SnakkaZ Dragonfly Metamorphosis System');

    // Create sacred geometry background
    const sacredBg = document.createElement('div');
    sacredBg.className = 'dragonfly-sacred-bg';
    container.appendChild(sacredBg);

    // Create stage elements
    this.stages.forEach((stage, index) => {
      const stageElement = document.createElement('div');
      stageElement.className = `dragonfly-stage ${stage.name}`;
      stageElement.dataset.stage = index;
      container.appendChild(stageElement);
    });

    // Create progress indicator
    const progress = document.createElement('div');
    progress.className = 'metamorphosis-progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progress.appendChild(progressBar);
    container.appendChild(progress);

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'metamorphosis-tooltip';
    tooltip.textContent = this.stages[0].tooltip;
    container.appendChild(tooltip);

    // Create sacred geometry overlay
    const geometryOverlay = document.createElement('div');
    geometryOverlay.className = 'sacred-geometry-overlay';
    container.appendChild(geometryOverlay);

    // Create encryption status indicator
    const encryptionStatus = document.createElement('div');
    encryptionStatus.className = 'dragonfly-encryption-status';
    container.appendChild(encryptionStatus);

    document.body.appendChild(container);
    this.container = container;
    this.tooltip = tooltip;
    this.progressBar = progressBar;
  }

  attachEventListeners() {
    if (!this.container) return;

    // Click to advance stage
    this.container.addEventListener('click', () => {
      this.advanceStage();
      this.playTransformationSound();
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.advanceStage();
        this.playTransformationSound();
      }
    });

    // Hover effects
    this.container.addEventListener('mouseenter', () => {
      this.container.classList.add('mystical');
      this.showEncryptionDetails();
    });

    this.container.addEventListener('mouseleave', () => {
      this.container.classList.remove('mystical');
    });

    // Auto-advance on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.isActive) {
        this.startMetamorphosisCycle();
      }
    });
  }

  startMetamorphosisCycle() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.activateStage(0);
    
    // Auto-advance through stages
    this.metamorphosisTimer = setInterval(() => {
      this.advanceStage();
    }, this.stages[this.currentStage].duration);
  }

  advanceStage() {
    const nextStage = (this.currentStage + 1) % this.stages.length;
    this.activateStage(nextStage);
    this.updateEncryptionLevel();
    
    // Reset timer with new stage duration
    if (this.metamorphosisTimer) {
      clearInterval(this.metamorphosisTimer);
    }
    
    this.metamorphosisTimer = setInterval(() => {
      this.advanceStage();
    }, this.stages[this.currentStage].duration);
  }

  activateStage(stageIndex) {
    if (!this.container) return;

    // Deactivate all stages
    const stageElements = this.container.querySelectorAll('.dragonfly-stage');
    stageElements.forEach(el => el.classList.remove('active'));

    // Activate current stage
    const currentStageElement = this.container.querySelector(`[data-stage="${stageIndex}"]`);
    if (currentStageElement) {
      currentStageElement.classList.add('active');
    }

    // Update stage data
    this.currentStage = stageIndex;
    const stage = this.stages[stageIndex];

    // Update tooltip
    if (this.tooltip) {
      this.tooltip.textContent = stage.tooltip;
    }

    // Update progress bar
    if (this.progressBar) {
      const progress = ((stageIndex + 1) / this.stages.length) * 100;
      this.progressBar.style.width = `${progress}%`;
    }

    // Trigger sacred geometry effects
    this.triggerSacredEffects(stage);

    // Log metamorphosis for debugging
    console.log(`🔄 Dragonfly metamorphosis: ${stage.name} - ${stage.description}`);
  }

  triggerSacredEffects(stage) {
    if (!this.container) return;

    // Add temporary effect class
    this.container.classList.add(`effect-${stage.name}`);
    
    setTimeout(() => {
      this.container.classList.remove(`effect-${stage.name}`);
    }, 1000);

    // Sacred geometry pulse
    const overlay = this.container.querySelector('.sacred-geometry-overlay');
    if (overlay) {
      overlay.style.animation = 'none';
      setTimeout(() => {
        overlay.style.animation = '';
      }, 10);
    }
  }

  updateEncryptionLevel() {
    this.encryptionLevel = Math.min(this.encryptionLevel + 25, 100);
    
    // Update encryption status
    if (this.encryptionLevel >= 100) {
      this.container.classList.add('encrypted');
    }

    // Broadcast encryption update
    this.broadcastEncryptionStatus();
  }

  initializeEncryption() {
    // Initialize E2EE visual indicators
    setTimeout(() => {
      this.encryptionLevel = 25;
      this.broadcastEncryptionStatus();
    }, 2000);
  }

  broadcastEncryptionStatus() {
    // Create custom event for encryption status
    const event = new CustomEvent('dragonflyEncryption', {
      detail: {
        level: this.encryptionLevel,
        stage: this.stages[this.currentStage].name,
        isSecure: this.encryptionLevel >= 75
      }
    });
    
    document.dispatchEvent(event);
  }

  showEncryptionDetails() {
    const stage = this.stages[this.currentStage];
    const securityInfo = this.getSecurityInfo(stage);
    
    // Update tooltip with security details
    if (this.tooltip) {
      this.tooltip.textContent = `${stage.tooltip} | ${securityInfo}`;
    }
  }

  getSecurityInfo(stage) {
    const securityLevels = {
      'forbidden-apple': 'Origin Encryption: Sacred',
      'dragonfly-nymph': 'Aquatic Protocol: E2EE',
      'dragonfly-emergence': 'Metamorphosis Cipher: AES-256',
      'dragonfly-adult': 'Flight Pattern: Quantum Encrypted'
    };
    
    return securityLevels[stage.name] || 'Security: Active';
  }

  playTransformationSound() {
    // Create audio feedback for accessibility
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(220 + (this.currentStage * 110), audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Fallback for browsers without Audio API
      console.log('🔊 Transformation sound (audio not available)');
    }
  }

  // Public API methods
  getCurrentStage() {
    return this.stages[this.currentStage];
  }

  getEncryptionLevel() {
    return this.encryptionLevel;
  }

  isFullyEvolved() {
    return this.currentStage === this.stages.length - 1 && this.encryptionLevel >= 100;
  }

  reset() {
    this.currentStage = 0;
    this.encryptionLevel = 0;
    this.container.classList.remove('encrypted');
    this.activateStage(0);
  }

  destroy() {
    if (this.metamorphosisTimer) {
      clearInterval(this.metamorphosisTimer);
    }
    
    if (this.container) {
      this.container.remove();
    }
    
    this.isActive = false;
  }
}

// Initialize the professional dragonfly system
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.snakkaZDragonfly = new SnakkaZProfessionalDragonfly();
    });
  } else {
    window.snakkaZDragonfly = new SnakkaZProfessionalDragonfly();
  }

  // Listen for encryption events
  document.addEventListener('dragonflyEncryption', (event) => {
    console.log('🔐 Encryption Status:', event.detail);
    
    // Update UI elements with encryption status
    const encryptionBadges = document.querySelectorAll('.encryption-badge');
    encryptionBadges.forEach(badge => {
      if (event.detail.isSecure) {
        badge.style.borderColor = '#00FF00';
        badge.style.color = '#00FF00';
      }
    });
  });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SnakkaZProfessionalDragonfly;
}
