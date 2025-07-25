import React from 'react';
import { Link } from 'react-router-dom';

const DesignOverviewPage = () => {
  return (
    <div className="min-h-screen bg-cyberdark-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-cybergold-400 mb-8 text-center">
          🎨 SnakkaZ Design System Overview
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CloudMCP Liquid Glass Design */}
          <div className="glass-container p-6 hover:scale-105 transition-transform">
            <h2 className="text-xl font-bold text-cybergold-400 mb-4">
              ✨ CloudMCP Liquid Glass
            </h2>
            <p className="text-gray-300 mb-4">
              Moderne frosted glass design inspirert av CloudMCP.run og Telegram. 
              Features liquid effects, gull-tema og responsive layout.
            </p>
            <div className="space-y-2">
              <Link 
                to="/cloudmcp-demo" 
                className="block w-full py-2 px-4 bg-gradient-to-r from-cybergold-600 to-cybergold-500 
                          rounded-lg text-center hover:from-cybergold-500 hover:to-cybergold-400 transition-all"
              >
                🚀 CloudMCP Quantum Demo
              </Link>
              <Link 
                to="/cloudmcp-profile" 
                className="block w-full py-2 px-4 bg-gradient-to-r from-cybergold-600 to-cybergold-500 
                          rounded-lg text-center hover:from-cybergold-500 hover:to-cybergold-400 transition-all"
              >
                🧑‍💼 CloudMCP Profile
              </Link>
              <Link 
                to="/cloudmcp-chat" 
                className="block w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-500 
                          rounded-lg text-center hover:from-blue-500 hover:to-blue-400 transition-all"
              >
                💬 CloudMCP Chat
              </Link>
            </div>
          </div>

          {/* Professional Design */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold text-blue-400 mb-4">
              💼 Professional Design
            </h2>
            <p className="text-gray-300 mb-4">
              Clean, business-fokusert design for profesjonelle brukergrupper.
            </p>
            <div className="space-y-2">
              <Link 
                to="/profile-new" 
                className="block w-full py-2 px-4 bg-blue-600 rounded-lg text-center hover:bg-blue-500 transition-colors"
              >
                👤 Professional Profile
              </Link>
              <Link 
                to="/basic-chat" 
                className="block w-full py-2 px-4 bg-slate-600 rounded-lg text-center hover:bg-slate-500 transition-colors"
              >
                💼 Professional Chat
              </Link>
            </div>
          </div>

          {/* Beta/Liquid Glass Demo */}
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-xl border border-purple-700">
            <h2 className="text-xl font-bold text-purple-400 mb-4">
              🚀 SnakkaZ Beta
            </h2>
            <p className="text-gray-300 mb-4">
              Full-featured beta versjon med alle nye funksjoner og liquid glass effects.
            </p>
            <div className="space-y-2">
              <Link 
                to="/beta" 
                className="block w-full py-2 px-4 bg-purple-600 rounded-lg text-center hover:bg-purple-500 transition-colors"
              >
                🎯 Beta Landing
              </Link>
              <Link 
                to="/beta-chat" 
                className="block w-full py-2 px-4 bg-indigo-600 rounded-lg text-center hover:bg-indigo-500 transition-colors"
              >
                🔥 Beta Chat
              </Link>
              <Link 
                to="/liquid-glass-demo" 
                className="block w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 
                          rounded-lg text-center hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                ✨ Liquid Glass Demo
              </Link>
            </div>
          </div>

          {/* Mobile Designs */}
          <div className="bg-gradient-to-br from-green-900 to-teal-900 p-6 rounded-xl border border-green-700">
            <h2 className="text-xl font-bold text-green-400 mb-4">
              📱 Mobile Designs
            </h2>
            <p className="text-gray-300 mb-4">
              Responsive mobile-optimized interfaces.
            </p>
            <div className="space-y-2">
              <Link 
                to="/mobile-test" 
                className="block w-full py-2 px-4 bg-green-600 rounded-lg text-center hover:bg-green-500 transition-colors"
              >
                📱 Mobile Test
              </Link>
              <Link 
                to="/complete-mobile-test" 
                className="block w-full py-2 px-4 bg-teal-600 rounded-lg text-center hover:bg-teal-500 transition-colors"
              >
                📲 Complete Mobile
              </Link>
            </div>
          </div>

          {/* Test Pages */}
          <div className="bg-gradient-to-br from-amber-900 to-orange-900 p-6 rounded-xl border border-amber-700">
            <h2 className="text-xl font-bold text-amber-400 mb-4">
              🧪 Test & Demo Pages
            </h2>
            <p className="text-gray-300 mb-4">
              Testing pages for various funktionaliteter.
            </p>
            <div className="space-y-2">
              <Link 
                to="/e2ee-test" 
                className="block w-full py-2 px-4 bg-amber-600 rounded-lg text-center hover:bg-amber-500 transition-colors"
              >
                🔐 E2EE Test
              </Link>
              <Link 
                to="/mcp-webrtc-test" 
                className="block w-full py-2 px-4 bg-orange-600 rounded-lg text-center hover:bg-orange-500 transition-colors"
              >
                🌐 MCP WebRTC Test
              </Link>
              <Link 
                to="/demo" 
                className="block w-full py-2 px-4 bg-yellow-600 rounded-lg text-center hover:bg-yellow-500 transition-colors"
              >
                🎭 Demo Mode
              </Link>
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-gradient-to-br from-pink-900 to-rose-900 p-6 rounded-xl border border-pink-700">
            <h2 className="text-xl font-bold text-pink-400 mb-4">
              🤖 AI Features
            </h2>
            <p className="text-gray-300 mb-4">
              AI-powered chat with MCP memory system.
            </p>
            <div className="space-y-2">
              <Link 
                to="/ai-chat" 
                className="block w-full py-2 px-4 bg-pink-600 rounded-lg text-center hover:bg-pink-500 transition-colors"
              >
                🧠 AI Chat
              </Link>
              <Link 
                to="/mcp-dashboard" 
                className="block w-full py-2 px-4 bg-rose-600 rounded-lg text-center hover:bg-rose-500 transition-colors"
              >
                🎯 MCP Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="mt-12 p-6 bg-slate-800 rounded-xl border border-slate-600">
          <h2 className="text-2xl font-bold text-cybergold-400 mb-4">
            📊 Current Design Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-white mb-2">✅ Implemented</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• CloudMCP Liquid Glass CSS System</li>
                <li>• ProfilePageCloudMCP.jsx</li>
                <li>• ChatPageCloudMCP.jsx</li>
                <li>• Responsive Mobile Design</li>
                <li>• Multiple Test Pages</li>
                <li>• Performance Monitoring</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-orange-400 mb-2">⚠️ Needs Attention</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Database Schema Issues (chat_rooms relation)</li>
                <li>• Default routing to CloudMCP pages</li>
                <li>• Mobile menu optimization</li>
                <li>• Performance testing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <Link 
              to="/cloudmcp-chat" 
              className="inline-block py-3 px-6 bg-gradient-to-r from-cybergold-600 to-cybergold-500 
                        rounded-lg font-semibold hover:from-cybergold-500 hover:to-cybergold-400 transition-all"
            >
              🚀 Go to CloudMCP Chat (Primary)
            </Link>
            <Link 
              to="/info" 
              className="inline-block py-3 px-6 bg-slate-600 rounded-lg font-semibold hover:bg-slate-500 transition-colors"
            >
              ℹ️ Info Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignOverviewPage;
