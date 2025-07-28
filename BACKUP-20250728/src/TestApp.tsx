import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Super simplified test app
function TestApp() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-cyberdark-900 via-cyberdark-950 to-cyberblue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="liquid-glass p-8 rounded-2xl max-w-md">
            <h1 className="text-3xl font-bold text-white mb-4">🐍 SnakkaZ Chat Beta</h1>
            <p className="text-cybergold-400 mb-6">Test for liquid glass design</p>
            <div className="liquid-glass-subtle p-4 rounded-lg mb-4">
              <p className="text-white">Liquid Glass Subtle Effect</p>
            </div>
            <div className="liquid-glass-moderate p-4 rounded-lg mb-4">
              <p className="text-white">Liquid Glass Moderate Effect</p>
            </div>
            <div className="liquid-glass-dramatic p-4 rounded-lg">
              <p className="text-white">Liquid Glass Dramatic Effect</p>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default TestApp;
