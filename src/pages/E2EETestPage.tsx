import React, { useEffect, useState } from 'react';
import { runAllE2EETests } from '../tests/e2ee-test';

interface TestResult {
  name: string;
  success: boolean;
  details?: any;
}

/**
 * SnakkaZ E2EE Test Page
 * 
 * Denne siden kjører ende-til-ende-krypteringstester for SnakkaZ chat
 */
const E2EETestPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [allPassed, setAllPassed] = useState<boolean | null>(null);
  const [log, setLog] = useState<string[]>([]);
  
  // Override console.log for test output
  useEffect(() => {
    const originalConsoleLog = console.log;
    
    console.log = (...args) => {
      originalConsoleLog(...args);
      
      // Add to our log
      if (typeof args[0] === 'string') {
        setLog(prev => [...prev, args[0].toString()]);
      } else if (args[0] && typeof args[0] === 'object') {
        try {
          setLog(prev => [...prev, JSON.stringify(args[0], null, 2)]);
        } catch (e) {
          setLog(prev => [...prev, 'Complex object logged']);
        }
      }
    };
    
    // Restore on cleanup
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);
  
  const runTests = async () => {
    setRunning(true);
    setResults([]);
    setLog([]);
    setAllPassed(null);
    
    try {
      // Add a collector for test results
      const testResults: TestResult[] = [];
      
      const originalLogTestResult = (window as any).logTestResult;
      
      // Override the test logger to collect results
      (window as any).logTestResult = (name: string, success: boolean, details: any) => {
        testResults.push({ name, success, details });
        setResults(prev => [...prev, { name, success, details }]);
      };
      
      // Run the tests
      const success = await runAllE2EETests();
      setAllPassed(success);
      
      // Restore original logger
      (window as any).logTestResult = originalLogTestResult;
    } catch (error) {
      console.error("Error running tests:", error);
      setAllPassed(false);
    } finally {
      setRunning(false);
    }
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SnakkaZ E2EE Krypteringstester</h1>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={running}
          className={`px-4 py-2 rounded text-white ${running ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {running ? 'Kjører tester...' : 'Kjør E2EE-tester'}
        </button>
      </div>
      
      {allPassed !== null && (
        <div className={`p-3 mb-4 rounded ${allPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <strong>{allPassed ? 'ALLE TESTER BESTÅTT!' : 'TESTER FEILET!'}</strong>
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Testresultater</h2>
        
        {results.length === 0 && !running ? (
          <p className="text-gray-500">Ingen tester kjørt ennå</p>
        ) : (
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li 
                key={index}
                className={`p-3 rounded ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.name}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {result.success ? 'BESTÅTT' : 'FEILET'}
                  </span>
                </div>
                
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 cursor-pointer">Detaljer</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Testlogg</h2>
        <div className="bg-gray-900 text-green-400 p-3 rounded h-60 overflow-auto font-mono text-xs">
          {log.length === 0 ? (
            <p className="text-gray-500">Ingen loggdata tilgjengelig</p>
          ) : (
            log.map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default E2EETestPage;
