/**
 * Developer Tools Panel for Supabase Preview Testing
 * 
 * This component provides developer tools for working with Supabase
 * preview branches in development environments.
 */

import React, { useState } from 'react';
import PreviewSwitcher from './PreviewSwitcher';
import { PreviewIndicator } from './PreviewIndicator';
import { getPreviewInfo } from '@/utils/supabase/preview-fix';

interface DevToolsPanelProps {
  isVisible?: boolean;
  onClose?: () => void;
}

/**
 * A panel with developer tools for preview testing
 */
export const DevToolsPanel: React.FC<DevToolsPanelProps> = ({ 
  isVisible = false,
  onClose
}) => {
  if (!isVisible) {
    return null;
  }
  
  const previewInfo = getPreviewInfo();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg font-medium text-white flex items-center">
            <PreviewIndicator className="mr-2" showLabel={false} />
            Developer Tools
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              Preview Environment Status
            </h3>
            <div className="bg-gray-800 p-3 rounded">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Status:</div>
                <div className={previewInfo.enabled ? 'text-green-400' : 'text-gray-300'}>
                  {previewInfo.enabled ? 'Enabled' : 'Disabled'}
                </div>
                
                <div className="text-gray-400">Branch:</div>
                <div className="text-yellow-300">
                  {previewInfo.branch || 'Main (No Preview)'}
                </div>
                
                <div className="text-gray-400">Connection:</div>
                <div className={
                  previewInfo.connectionStatus === 'connected' 
                    ? 'text-green-400'
                    : previewInfo.connectionStatus === 'error'
                    ? 'text-red-400'
                    : 'text-gray-300'
                }>
                  {previewInfo.connectionStatus}
                </div>
                
                {previewInfo.error && (
                  <>
                    <div className="text-gray-400">Error:</div>
                    <div className="text-red-400">{previewInfo.error}</div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <PreviewSwitcher />
          
          <div className="mt-6 text-xs text-gray-500">
            <p>
              Note: Preview branches are created automatically for pull requests.
              Use this tool to test different preview environments during development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * A small floating button to open developer tools
 */
export const DevToolsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-12 right-4 bg-gray-800 hover:bg-gray-700 p-2 rounded-full shadow-lg"
      title="Developer Tools"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-yellow-400"
      >
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
    </button>
  );
};

/**
 * Container component that manages the dev tools state
 */
export const DeveloperTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <>
      <DevToolsButton onClick={() => setIsOpen(true)} />
      <DevToolsPanel 
        isVisible={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};

export default DeveloperTools;
