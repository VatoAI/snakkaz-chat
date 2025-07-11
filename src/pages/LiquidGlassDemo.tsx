import React, { useState } from 'react';
import '../styles/liquid-glass-clean.css';

export const LiquidGlassDemo: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const subtleVariants = [
    {
      title: "Minimal Glass",
      description: "Svært subtil effekt for daglig bruk",
      classes: "liquid-glass-minimal liquid-card",
      intensity: "Minimal"
    },
    {
      title: "Subtle Glass",
      description: "Lett glassmorphism, ikke påtrengende",
      classes: "liquid-glass-subtle liquid-card",
      intensity: "Subtle"
    },
    {
      title: "Chat Variant",
      description: "Optimalisert for chat-komponenter",
      classes: "liquid-glass-chat liquid-card",
      intensity: "Chat"
    }
  ];

  const moderateVariants = [
    {
      title: "Moderate Glass",
      description: "Balansert effekt for de fleste brukere",
      classes: "liquid-glass-moderate liquid-card",
      intensity: "Moderate"
    },
    {
      title: "Primary Blue",
      description: "Moderate med blå tema",
      classes: "liquid-glass-moderate liquid-glass-primary liquid-card",
      intensity: "Moderate"
    },
    {
      title: "Brand Gold",
      description: "Moderate med gull tema",
      classes: "liquid-glass-moderate liquid-glass-gold liquid-card",
      intensity: "Moderate"
    }
  ];

  const dramaticVariants = [
    {
      title: "Dramatic Glass",
      description: "Perfekt for login/register sider",
      classes: "liquid-glass-dramatic liquid-card",
      intensity: "Dramatic"
    },
    {
      title: "Premium VIP",
      description: "Luksuriøs effekt med gull shimmer",
      classes: "liquid-glass-premium liquid-card",
      intensity: "Premium"
    },
    {
      title: "Full Effect",
      description: "Original liquid glass med alle effekter",
      classes: "liquid-glass liquid-card",
      intensity: "Full"
    }
  ];

  const specialEffects = [
    {
      title: "Bubble Effect",
      description: "Moderate + animerte bobler",
      classes: "liquid-glass-moderate liquid-bubbles liquid-card",
      intensity: "Special"
    },
    {
      title: "Wave Effect",
      description: "Subtle + strømende bølger",
      classes: "liquid-glass-subtle liquid-wave liquid-card",
      intensity: "Special"
    },
    {
      title: "Interactive",
      description: "Dramatic + interaktive effekter",
      classes: "liquid-glass-dramatic liquid-interactive liquid-card",
      intensity: "Special"
    }
  ];

  return (
    <div className="min-h-screen bg-cyberdark-950 p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="liquid-text text-6xl font-bold mb-4">
          LiquidGlass Demo
        </h1>
        <p className="text-cybergold-400 text-xl max-w-3xl mx-auto">
          Velg perfekt intensitetsnivå for din app! Fra subtile daglige effekter til dramatiske login-sider - alt optimalisert for SnakkaZ Chat.
        </p>
      </div>

      {/* Intensity Selector */}
      <div className="text-center mb-8">
        <p className="text-cybergold-300 text-lg">
          Velg intensitetsnivå som passer deg best 👇
        </p>
      </div>

      {/* Subtle Variants - For daglig bruk */}
      <div className="mb-12">
        <h2 className="text-cybergold-400 text-2xl font-bold mb-6 text-center">
          😌 Subtile Varianter - For daglig bruk
        </h2>
        <div className="liquid-grid max-w-5xl mx-auto">
          {subtleVariants.map((card, index) => (
            <div
              key={`subtle-${index}`}
              className={`${card.classes} cursor-pointer transition-all duration-300`}
              onClick={() => setActiveCard(activeCard === `subtle-${index}` ? null : `subtle-${index}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white text-xl font-semibold">{card.title}</h3>
                <span className="text-xs bg-cyberblue-500/20 text-cyberblue-300 px-2 py-1 rounded">
                  {card.intensity}
                </span>
              </div>
              <p className="text-cybergold-300 mb-4">{card.description}</p>

              {activeCard === `subtle-${index}` && (
                <div className="mt-4 p-3 bg-cyberdark-800/50 rounded-lg">
                  <p className="text-cybergold-500 text-sm">
                    ✨ CSS: <code className="text-cyberblue-400">{card.classes}</code>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Moderate Variants */}
      <div className="mb-12">
        <h2 className="text-cybergold-400 text-2xl font-bold mb-6 text-center">
          ⚖️ Moderate Varianter - Balansert for de fleste
        </h2>
        <div className="liquid-grid max-w-5xl mx-auto">
          {moderateVariants.map((card, index) => (
            <div
              key={`moderate-${index}`}
              className={`${card.classes} cursor-pointer transition-all duration-300`}
              onClick={() => setActiveCard(activeCard === `moderate-${index}` ? null : `moderate-${index}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white text-xl font-semibold">{card.title}</h3>
                <span className="text-xs bg-cybergold-500/20 text-cybergold-300 px-2 py-1 rounded">
                  {card.intensity}
                </span>
              </div>
              <p className="text-cybergold-300 mb-4">{card.description}</p>

              {activeCard === `moderate-${index}` && (
                <div className="mt-4 p-3 bg-cyberdark-800/50 rounded-lg">
                  <p className="text-cybergold-500 text-sm">
                    ✨ CSS: <code className="text-cyberblue-400">{card.classes}</code>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dramatic Variants */}
      <div className="mb-12">
        <h2 className="text-cybergold-400 text-2xl font-bold mb-6 text-center">
          🎭 Dramatiske Varianter - For spesielle sider (Login/Register)
        </h2>
        <div className="liquid-grid max-w-5xl mx-auto">
          {dramaticVariants.map((card, index) => (
            <div
              key={`dramatic-${index}`}
              className={`${card.classes} cursor-pointer transition-all duration-300`}
              onClick={() => setActiveCard(activeCard === `dramatic-${index}` ? null : `dramatic-${index}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white text-xl font-semibold">{card.title}</h3>
                <span className="text-xs bg-cyberred-500/20 text-cyberred-300 px-2 py-1 rounded">
                  {card.intensity}
                </span>
              </div>
              <p className="text-cybergold-300 mb-4">{card.description}</p>

              {activeCard === `dramatic-${index}` && (
                <div className="mt-4 p-3 bg-cyberdark-800/50 rounded-lg">
                  <p className="text-cybergold-500 text-sm">
                    ✨ CSS: <code className="text-cyberblue-400">{card.classes}</code>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Special Effects */}
      <div className="mb-12">
        <h2 className="text-cybergold-400 text-2xl font-bold mb-6 text-center">
          ✨ Spesialeffekter - Kombiner med andre varianter
        </h2>
        <div className="liquid-grid max-w-5xl mx-auto">
          {specialEffects.map((card, index) => (
            <div
              key={`special-${index}`}
              className={`${card.classes} cursor-pointer transition-all duration-300`}
              onClick={() => setActiveCard(activeCard === `special-${index}` ? null : `special-${index}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white text-xl font-semibold">{card.title}</h3>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  {card.intensity}
                </span>
              </div>
              <p className="text-cybergold-300 mb-4">{card.description}</p>

              {activeCard === `special-${index}` && (
                <div className="mt-4 p-3 bg-cyberdark-800/50 rounded-lg">
                  <p className="text-cybergold-500 text-sm">
                    ✨ CSS: <code className="text-cyberblue-400">{card.classes}</code>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Text Effects Demo */}
      <div className="liquid-glass liquid-panel max-w-4xl mx-auto mb-12">
        <h2 className="liquid-text text-4xl font-bold mb-6 text-center">
          Liquid Text Effects
        </h2>
        <div className="space-y-4">
          <p className="liquid-text text-2xl">
            Flytende tekst med fargeanimasjon
          </p>
          <p className="text-white text-lg">
            Standard hvit tekst for sammenligning
          </p>
          <p className="cyber-text text-xl">
            SnakkaZ cyberpunk tekst-stil
          </p>
        </div>
      </div>

      {/* Loading Effects Demo */}
      <div className="liquid-glass liquid-panel max-w-4xl mx-auto mb-12">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          Loading Effects
        </h2>
        <div className="space-y-6">
          <div className="liquid-glass liquid-loading h-16 flex items-center justify-center">
            <span className="text-white">Liquid Loading Effect</span>
          </div>
          <div className="liquid-glass liquid-card liquid-interactive">
            <span className="text-white">Interactive Card - Hover Me!</span>
          </div>
        </div>
      </div>

      {/* Color Variants Showcase */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="liquid-text text-3xl font-bold mb-8 text-center">
          Color Variants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-glass liquid-glass-primary liquid-card text-center">
            <div className="w-16 h-16 bg-cyberblue-500 rounded-full mx-auto mb-4 opacity-70"></div>
            <h3 className="text-cyberblue-300 text-xl font-semibold">Primary Blue</h3>
            <p className="text-white mt-2">SnakkaZ blue theme</p>
          </div>
          <div className="liquid-glass liquid-glass-gold liquid-card text-center">
            <div className="w-16 h-16 bg-cybergold-500 rounded-full mx-auto mb-4 opacity-70"></div>
            <h3 className="text-cybergold-300 text-xl font-semibold">Brand Gold</h3>
            <p className="text-white mt-2">Premium gold accent</p>
          </div>
          <div className="liquid-glass liquid-glass-danger liquid-card text-center">
            <div className="w-16 h-16 bg-cyberred-500 rounded-full mx-auto mb-4 opacity-70"></div>
            <h3 className="text-cyberred-300 text-xl font-semibold">Alert Red</h3>
            <p className="text-white mt-2">Error and warning states</p>
          </div>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="liquid-glass-moderate liquid-card max-w-6xl mx-auto mb-12">
        <h3 className="text-cybergold-400 text-2xl font-semibold mb-6 text-center">
          � Bruksanvisning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">🎯 Anbefalte bruksområder:</h4>
            <ul className="text-cybergold-300 space-y-2">
              <li><strong>Minimal/Subtle:</strong> Chat-paneler, daglige komponenter</li>
              <li><strong>Moderate:</strong> Dashboards, hovedinnhold</li>
              <li><strong>Dramatic:</strong> Login/register, landingssider</li>
              <li><strong>Premium:</strong> VIP-funksjoner, betalte tjenester</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">💡 Tips for implementering:</h4>
            <ul className="text-cybergold-300 space-y-2">
              <li>• Gi brukere valg mellom intensitetsnivåer</li>
              <li>• Bruk subtile varianter som standard</li>
              <li>• Kombiner med <code className="text-cyberblue-400">liquid-no-shimmer</code> for mindre bevegelse</li>
              <li>• Test på mobile enheter for beste opplevelse</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Note */}
      <div className="liquid-glass-subtle liquid-card max-w-4xl mx-auto text-center">
        <h3 className="text-cybergold-400 text-xl font-semibold mb-3">
          🚀 Performance & Tilgjengelighet
        </h3>
        <p className="text-white mb-4">
          Alle liquid glass effekter er optimalisert for ytelse og respekterer brukerinnstillinger.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-cybergold-300">
            <strong>GPU-akselerert</strong><br />
            Bruker CSS transforms
          </div>
          <div className="text-cybergold-300">
            <strong>Mobile-optimized</strong><br />
            Redusert kompleksitet på små skjermer
          </div>
          <div className="text-cybergold-300">
            <strong>Accessibility-aware</strong><br />
            Respekterer prefers-reduced-motion
          </div>
        </div>
      </div>
    </div>
  );
};