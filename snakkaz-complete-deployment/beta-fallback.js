// SnakkaZ Emergency Beta Fallback
(function() {
    'use strict';
    
    console.log('🚀 SnakkaZ Emergency Beta Fallback Loading...');
    
    // Wait for page to load
    setTimeout(() => {
        const root = document.getElementById('root');
        const loading = document.getElementById('emergency-loading');
        
        // If React app didn't load, show fallback beta page
        if (!root.innerHTML.trim()) {
            console.log('🔧 React app failed to load, showing beta fallback...');
            
            root.innerHTML = `
                <div style="
                    padding: 40px;
                    text-align: center;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
                    margin: 20px;
                    min-height: 60vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                ">
                    <div class="logo-container" style="margin-bottom: 30px;">
                        <img src="/assets/logos/snakkaz-gold.png" alt="SnakkaZ" class="snakkaz-logo snakkaz-logo-splash" style="
                            width: 150px;
                            height: 150px;
                            border-radius: 35px;
                            animation: logoGlow 3s ease-in-out infinite alternate;
                        ">
                    </div>
                    
                    <div class="snakkaz-brand">
                        <div class="snakkaz-brand-text" style="font-size: 3em; margin-bottom: 10px;">SnakkaZ Beta</div>
                    </div>
                    
                    <div style="max-width: 600px; margin-bottom: 40px;">
                        <h2 style="color: #ffffff; margin-bottom: 20px; font-size: 1.8em;">
                            Velkommen til SnakkaZ Beta!
                        </h2>
                        <p style="color: rgba(255, 255, 255, 0.8); font-size: 1.2em; line-height: 1.6; margin-bottom: 30px;">
                            Sikker end-to-end kryptert chat med moderne liquid glass design. 
                            Beta-versjonen er under utvikling og blir bedre hver dag!
                        </p>
                        
                        <div style="
                            background: rgba(0, 170, 255, 0.1);
                            border: 1px solid rgba(0, 170, 255, 0.3);
                            border-radius: 15px;
                            padding: 25px;
                            margin: 20px 0;
                        ">
                            <h3 style="color: #00aaff; margin-bottom: 15px;">🔐 Sikkerhetsfeatures</h3>
                            <ul style="text-align: left; color: rgba(255, 255, 255, 0.9); line-height: 1.8;">
                                <li>🛡️ End-to-end kryptering (AES-256-GCM)</li>
                                <li>📱 PWA - Installer som app</li>
                                <li>🌊 Liquid glass design</li>
                                <li>⚡ Sanntid meldinger</li>
                                <li>🔒 Sikker autentisering</li>
                                <li>✨ Kreative logo animasjoner</li>
                            </ul>
                        </div>
                        
                        <div style="margin-top: 30px;">
                            <button onclick="location.reload()" style="
                                background: linear-gradient(135deg, #00aaff, #0088cc);
                                border: none;
                                color: white;
                                padding: 15px 30px;
                                font-size: 1.1em;
                                border-radius: 25px;
                                cursor: pointer;
                                box-shadow: 0 8px 25px rgba(0, 170, 255, 0.3);
                                transition: all 0.3s ease;
                                margin: 10px;
                            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                🔄 Prøv igjen
                            </button>
                            
                            <button onclick="window.open('https://discord.gg/snakkaz', '_blank')" style="
                                background: rgba(255, 255, 255, 0.1);
                                border: 1px solid rgba(255, 255, 255, 0.3);
                                color: white;
                                padding: 15px 30px;
                                font-size: 1.1em;
                                border-radius: 25px;
                                cursor: pointer;
                                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                                transition: all 0.3s ease;
                                margin: 10px;
                            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                💬 Join Discord
                            </button>
                            
                            <button onclick="window.open('/logo-showcase-creative.html', '_blank')" style="
                                background: rgba(255, 215, 0, 0.1);
                                border: 1px solid rgba(255, 215, 0, 0.3);
                                color: #ffd700;
                                padding: 15px 30px;
                                font-size: 1.1em;
                                border-radius: 25px;
                                cursor: pointer;
                                box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
                                transition: all 0.3s ease;
                                margin: 10px;
                            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                🎨 Logo Showcase
                            </button>
                        </div>
                    </div>
                    
                    <div style="
                        margin-top: 40px;
                        padding: 20px;
                        background: rgba(255, 255, 255, 0.03);
                        border-radius: 15px;
                        font-size: 0.9em;
                        color: rgba(255, 255, 255, 0.6);
                        max-width: 500px;
                    ">
                        <p><strong>Beta Status:</strong> Denne versjonen er under aktiv utvikling</p>
                        <p><strong>Design:</strong> Liquid glass med kreative logo animasjoner</p>
                        <p><strong>Support:</strong> Rapporter problemer på Discord</p>
                        <p><strong>Privacy:</strong> Alle meldinger er end-to-end krypterte</p>
                    </div>
                </div>
            `;
            
            if (loading) {
                loading.style.display = 'none';
            }
            
            console.log('✅ Beta fallback page displayed');
        } else {
            console.log('✅ React app loaded successfully');
            if (loading) {
                loading.style.display = 'none';
            }
        }
    }, 5000); // Wait 5 seconds for React to load
    
})();
