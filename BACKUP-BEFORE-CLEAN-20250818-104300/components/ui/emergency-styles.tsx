import React from 'react';

export const EmergencyStyles: React.FC = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      /* Emergency SnakkaZ Beta Styles */
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #0A0A0A;
        color: white;
        min-height: 100vh;
      }
      
      #root {
        min-height: 100vh;
      }
      
      /* SnakkaZ Background */
      .snakkaz-background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #0A0A0A;
        z-index: -2;
        overflow: hidden;
      }
      
      .snakkaz-blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.4;
        animation: snakkazFloat 20s infinite ease-in-out;
      }
      
      .snakkaz-blob-1 {
        top: -20%;
        left: -20%;
        width: 60%;
        height: 60%;
        background: radial-gradient(circle, #FFD700 0%, transparent 70%);
        animation-delay: 0s;
      }
      
      .snakkaz-blob-2 {
        bottom: -20%;
        right: -20%;
        width: 50%;
        height: 50%;
        background: radial-gradient(circle, #4A90E2 0%, transparent 70%);
        animation-delay: 7s;
      }
      
      .snakkaz-blob-3 {
        top: 50%;
        left: 50%;
        width: 40%;
        height: 40%;
        background: radial-gradient(circle, #8B5CF6 0%, transparent 70%);
        animation-delay: 14s;
        transform: translate(-50%, -50%);
      }
      
      @keyframes snakkazFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-30px) rotate(120deg); }
        66% { transform: translateY(30px) rotate(240deg); }
      }
      
      /* Glass Cards */
      .snakkaz-card {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .snakkaz-card:hover {
        border-color: rgba(255, 255, 255, 0.25);
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
        transform: translateY(-4px);
      }
      
      .liquid-glass-moderate {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .liquid-glass-gold {
        background: rgba(255, 215, 0, 0.1);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 215, 0, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 0 30px rgba(255, 215, 0, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Buttons */
      .snakkaz-btn {
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        border: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      
      .snakkaz-btn-primary {
        background: rgba(255, 215, 0, 0.1);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 215, 0, 0.3);
        color: white;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
      }
      
      .snakkaz-btn-primary:hover {
        background: rgba(255, 215, 0, 0.15);
        box-shadow: 0 0 40px rgba(255, 215, 0, 0.5);
        transform: translateY(-2px);
      }
      
      .snakkaz-btn-secondary {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: white;
      }
      
      .snakkaz-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
      }
      
      .snakkaz-btn-ghost {
        background: transparent;
        border: 1px solid transparent;
        color: rgba(255, 255, 255, 0.7);
      }
      
      .snakkaz-btn-ghost:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.15);
        color: white;
      }
      
      /* Inputs */
      .snakkaz-input {
        width: 100%;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        color: white;
        font-size: 14px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .snakkaz-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      
      .snakkaz-input:focus {
        outline: none;
        border-color: #FFD700;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        background: rgba(255, 255, 255, 0.08);
      }
      
      /* Animations */
      .snakkaz-animate-in {
        animation: snakkazSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      @keyframes snakkazSlideIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Utility classes */
      .p-4 { padding: 1rem; }
      .p-6 { padding: 1.5rem; }
      .p-8 { padding: 2rem; }
      .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-4 { margin-bottom: 1rem; }
      .mb-6 { margin-bottom: 1.5rem; }
      .mb-8 { margin-bottom: 2rem; }
      .mt-2 { margin-top: 0.5rem; }
      .mt-6 { margin-top: 1.5rem; }
      .w-full { width: 100%; }
      .w-16 { width: 4rem; }
      .h-16 { height: 4rem; }
      .flex { display: flex; }
      .flex-col { flex-direction: column; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .justify-between { justify-content: space-between; }
      .text-center { text-align: center; }
      .text-white { color: white; }
      .text-gray-400 { color: #9CA3AF; }
      .text-sm { font-size: 0.875rem; }
      .text-xl { font-size: 1.25rem; }
      .text-3xl { font-size: 1.875rem; }
      .font-bold { font-weight: 700; }
      .rounded-full { border-radius: 9999px; }
      .space-y-3 > * + * { margin-top: 0.75rem; }
      .space-y-4 > * + * { margin-top: 1rem; }
      .space-y-6 > * + * { margin-top: 1.5rem; }
      .space-y-8 > * + * { margin-top: 2rem; }
      .min-h-screen { min-height: 100vh; }
      .max-w-md { max-width: 28rem; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .relative { position: relative; }
      .absolute { position: absolute; }
      .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
      .border-t { border-top-width: 1px; }
      .border-gray-600 { border-color: #4B5563; }
      .bg-transparent { background-color: transparent; }
      .block { display: block; }
      .bg-green-500\/20 { background-color: rgba(34, 197, 94, 0.2); }
      .bg-blue-500\/20 { background-color: rgba(59, 130, 246, 0.2); }
      .bg-purple-500\/20 { background-color: rgba(168, 85, 247, 0.2); }
      .text-green-400 { color: #4ADE80; }
      .text-green-300 { color: #86EFAC; }
      .text-blue-400 { color: #60A5FA; }
      .text-blue-300 { color: #93C5FD; }
      .text-purple-400 { color: #C084FC; }
      .text-purple-300 { color: #D8B4FE; }
      .text-xs { font-size: 0.75rem; }
      .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .rounded-full { border-radius: 9999px; }
      .font-medium { font-weight: 500; }
      .mr-2 { margin-right: 0.5rem; }
      .h-4 { height: 1rem; }
      .w-4 { width: 1rem; }
    `
  }} />
);