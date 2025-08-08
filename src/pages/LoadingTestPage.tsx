import React, { useState } from 'react';
import { MatrixLoadingScreen } from '../components/common/MatrixLoading';
import { StandardLoading } from '../components/common/StandardLoading';

const LoadingTestPage: React.FC = () => {
  const [currentTest, setCurrentTest] = useState<'matrix' | 'auth' | 'chat' | 'inline'>('matrix');
  const [isVisible, setIsVisible] = useState(true);

  const tests = [
    { key: 'matrix', name: '🧿 Psychedelic Matrix (ALL TYPES)', desc: 'Alex Grey + blå symboler - NY STANDARD' },
    { key: 'auth', name: '🔐 Auth Loading (Matrix)', desc: 'Samme som Matrix - unified design' },
    { key: 'chat', name: '💬 Chat Loading (Matrix)', desc: 'Samme som Matrix - unified design' },
    { key: 'inline', name: '⚡ Inline Loading', desc: 'Small component loader (unchanged)' }
  ] as const;

  const renderCurrentTest = () => {
    if (!isVisible) return null;

    switch (currentTest) {
      case 'matrix':
        return <MatrixLoadingScreen message="🧿 Testing Psychedelic Matrix Loading..." />;
      case 'auth':
        return <StandardLoading type="auth" message="🔐 Testing Auth Loading..." />;
      case 'chat':
        return <StandardLoading type="chat" message="💬 Testing Chat Loading..." />;
      case 'inline':
        return (
          <div className="min-h-screen bg-cyberdark-950 flex items-center justify-center">
            <div className="bg-cyberdark-800 p-8 rounded-lg">
              <h2 className="text-white mb-4">Inline Loading Test:</h2>
              <StandardLoading type="inline" message="Testing inline..." size="lg" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cyberdark-950 relative">
      {/* Control Panel - Fixed position */}
      <div className="fixed top-4 left-4 z-50 bg-cyberdark-800/90 backdrop-blur-sm rounded-lg p-4 border border-cyberblue-400/30">
        <h1 className="text-cyberblue-400 font-bold mb-4">🧿 SNAKKAZ LOADING TEST SUITE</h1>

        {/* Test Buttons */}
        <div className="space-y-2 mb-4">
          {tests.map((test) => (
            <button
              key={test.key}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentTest(test.key as any);
                  setIsVisible(true);
                }, 100);
              }}
              className={`w-full text-left p-3 rounded transition-colors ${currentTest === test.key
                  ? 'bg-cyberblue-500 text-white'
                  : 'bg-cyberdark-700 text-cyberblue-300 hover:bg-cyberdark-600'
                }`}
            >
              <div className="font-semibold">{test.name}</div>
              <div className="text-xs opacity-70">{test.desc}</div>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition-colors"
          >
            {isVisible ? '⏸️ Hide' : '▶️ Show'} Loading
          </button>

          <div className="text-xs text-cyberblue-300">
            Current: <span className="font-semibold text-cyberblue-400">
              {tests.find(t => t.key === currentTest)?.name}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-cyberdark-900 rounded text-xs text-cyberblue-300">
          <div className="font-semibold mb-1">🎯 Test Instructions:</div>
          <div>• Click different loading types</div>
          <div>• Observe animations and timing</div>
          <div>• Check mobile responsiveness</div>
          <div>• Use Hide/Show to replay animations</div>
        </div>
      </div>

      {/* Loading Display Area */}
      <div className="absolute inset-0">
        {renderCurrentTest()}
      </div>

      {/* Info Panel - Fixed bottom */}
      <div className="fixed bottom-4 right-4 z-50 bg-cyberdark-800/90 backdrop-blur-sm rounded-lg p-4 border border-cyberblue-400/30 max-w-sm">
        <h3 className="text-cyberblue-400 font-semibold mb-2">ℹ️ Current Test Info</h3>

        {currentTest === 'matrix' && (
          <div className="text-xs text-cyberblue-300 space-y-1">
            <div>🧿 <strong>Psychedelic Matrix Features:</strong></div>
            <div>• Alex Grey inspired eye center</div>
            <div>• Blue sacred geometry symbols</div>
            <div>• Rotating mandala rays</div>
            <div>• SnakkaZ cyberblue theme (#64b5f6)</div>
            <div>• Canvas-based animation</div>
            <div>• Interdimensional messages</div>
          </div>
        )}

        {currentTest === 'auth' && (
          <div className="text-xs text-cyberblue-300 space-y-1">
            <div>🔐 <strong>Auth Loading Features:</strong></div>
            <div>• Cyber blue spinner</div>
            <div>• Clean minimalist design</div>
            <div>• Supabase auth branding</div>
            <div>• Fast loading animation</div>
          </div>
        )}

        {currentTest === 'chat' && (
          <div className="text-xs text-cyberblue-300 space-y-1">
            <div>💬 <strong>Chat Loading Features:</strong></div>
            <div>• Golden ring spinner</div>
            <div>• Ping animation effect</div>
            <div>• Chat-specific messaging</div>
            <div>• SnakkaZ chat branding</div>
          </div>
        )}

        {currentTest === 'inline' && (
          <div className="text-xs text-cyberblue-300 space-y-1">
            <div>⚡ <strong>Inline Loading Features:</strong></div>
            <div>• Small component size</div>
            <div>• Multiple size options</div>
            <div>• Flexible placement</div>
            <div>• Button/form integration</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingTestPage;
