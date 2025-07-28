import React from 'react';

export const SupabaseError: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Supabase Connection Error</h2>
        <p className="text-gray-600 text-center mb-6">
          Could not connect to Supabase due to missing or invalid credentials.
        </p>
        
        <div className="space-y-4 bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-800">How to fix this:</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Open your <code className="bg-gray-200 px-1 rounded">.env</code> file</li>
            <li>Replace the placeholder values with your actual Supabase credentials:
              <pre className="bg-gray-200 p-2 rounded mt-2 text-xs overflow-x-auto">
                VITE_SUPABASE_URL=your_actual_url{'\n'}
                VITE_SUPABASE_ANON_KEY=your_actual_key
              </pre>
            </li>
            <li>You can find these values in your Supabase Dashboard under:
              <div className="text-blue-600 font-medium mt-1">Project Settings &rarr; API</div>
            </li>
            <li>Restart your development server after making these changes</li>
          </ol>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            For more assistance, refer to the{' '}
            <a 
              href="https://supabase.com/docs" 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800"
            >
              Supabase documentation
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseError;