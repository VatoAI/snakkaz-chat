/**
 * Preview Branch Switcher Component
 * 
 * This component provides a UI for switching between different Supabase preview branches.
 * It's useful for developers testing different PR branches without having to change URLs.
 */

import React, { useState } from 'react';
import { 
  getPreviewInfo, 
  loadPreviewBranch, 
  resetPreviewStatus 
} from '@/utils/supabase/preview-fix';

interface PreviewSwitcherProps {
  onSwitchComplete?: (success: boolean) => void;
  className?: string;
}

/**
 * A component that allows switching between different preview branches
 */
export const PreviewSwitcher: React.FC<PreviewSwitcherProps> = ({ 
  onSwitchComplete, 
  className = '' 
}) => {
  const [branchName, setBranchName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const currentPreview = getPreviewInfo();
  
  // Handle branch switch
  const handleSwitchBranch = async () => {
    if (!branchName) {
      setError('Please enter a branch name');
      return;
    }
    
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      const result = await loadPreviewBranch(branchName);
      
      if (result.success) {
        setSuccess(`Successfully switched to branch: ${branchName}`);
        onSwitchComplete?.(true);
        
        // Reload the page to apply changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(result.error || 'Failed to switch branch');
        onSwitchComplete?.(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onSwitchComplete?.(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset to the main branch
  const handleResetBranch = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      // Clear the stored branch
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('SUPABASE_PREVIEW_BRANCH');
      }
      
      // Reset preview status
      resetPreviewStatus();
      
      setSuccess('Switching to main branch');
      onSwitchComplete?.(true);
      
      // Reload the page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onSwitchComplete?.(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`p-4 bg-gray-900 rounded-lg ${className}`}>
      <h2 className="text-lg font-medium mb-3 text-yellow-400">
        Supabase Preview Branch Switcher
      </h2>
      
      {currentPreview.enabled && (
        <div className="mb-4 bg-gray-800 p-2 rounded">
          <div className="text-sm">Current preview branch:</div>
          <div className="text-yellow-300 font-medium">{currentPreview.branch}</div>
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm mb-1" htmlFor="branchInput">
          Enter branch name (e.g., pr-123):
        </label>
        <input
          id="branchInput"
          type="text"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="pr-123"
          disabled={isLoading}
        />
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleSwitchBranch}
          disabled={isLoading || !branchName}
          className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded disabled:opacity-50"
        >
          {isLoading ? 'Switching...' : 'Switch Branch'}
        </button>
        
        <button
          onClick={handleResetBranch}
          disabled={isLoading}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          Reset to Main
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-2 bg-red-900/50 text-red-300 rounded text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-2 bg-green-900/50 text-green-300 rounded text-sm">
          {success}
        </div>
      )}
    </div>
  );
};

export default PreviewSwitcher;
