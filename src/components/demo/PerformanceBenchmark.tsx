import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/**
 * Performance Benchmark Component
 * 
 * This component demonstrates the performance improvements from our optimizations
 */
export const PerformanceBenchmark: React.FC = () => {
  const [benchmarkResults, setBenchmarkResults] = useState<{
    original: number[];
    optimized: number[];
    cacheStats: {
      hits: number;
      misses: number;
    };
    improvements: {
      average: number;
      max: number;
    } | null;
  }>({
    original: [],
    optimized: [],
    cacheStats: {
      hits: 0,
      misses: 0
    },
    improvements: null
  });

  const [activeTab, setActiveTab] = useState<string>("benchmark");
  const [runCount, setRunCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Run a performance test comparing original vs optimized data fetching
  const runBenchmark = async () => {
    setIsRunning(true);
    setRunCount(prevCount => prevCount + 1);
    
    // Clear previous results if this is the first run
    if (runCount === 0) {
      setBenchmarkResults({
        original: [],
        optimized: [],
        cacheStats: {
          hits: 0,
          misses: 0
        },
        improvements: null
      });
    }

    try {
      // Simulate original implementation (without caching)
      const startOriginal = performance.now();
      await simulateOriginalFetch();
      const endOriginal = performance.now();
      const originalTime = endOriginal - startOriginal;

      // Simulate optimized implementation (with caching)
      const startOptimized = performance.now();
      const cacheResult = await simulateOptimizedFetch(runCount > 0);
      const endOptimized = performance.now();
      const optimizedTime = endOptimized - startOptimized;

      // Update results
      setBenchmarkResults(prev => {
        const originalResults = [...prev.original, originalTime];
        const optimizedResults = [...prev.optimized, optimizedTime];
        
        // Calculate improvements
        const originalAvg = originalResults.reduce((sum, val) => sum + val, 0) / originalResults.length;
        const optimizedAvg = optimizedResults.reduce((sum, val) => sum + val, 0) / optimizedResults.length;
        const improvements = {
          average: (originalAvg - optimizedAvg) / originalAvg * 100,
          max: Math.max(...originalResults.map((orig, i) => 
            (orig - optimizedResults[i]) / orig * 100
          ))
        };

        return {
          original: originalResults,
          optimized: optimizedResults,
          cacheStats: {
            hits: prev.cacheStats.hits + (cacheResult.hit ? 1 : 0),
            misses: prev.cacheStats.misses + (cacheResult.hit ? 0 : 1)
          },
          improvements
        };
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Simulate original data fetching (without caching)
  const simulateOriginalFetch = async (): Promise<void> => {
    // Simulate network latency and processing time
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
    return;
  };

  // Simulate optimized data fetching (with caching)
  const simulateOptimizedFetch = async (useCache: boolean): Promise<{ hit: boolean }> => {
    if (useCache) {
      // 80% chance of cache hit after first run
      const isCacheHit = Math.random() < 0.8;
      
      if (isCacheHit) {
        // Cache hit is very fast
        await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
        return { hit: true };
      }
    }
    
    // Cache miss - similar to original but slightly faster due to optimized code
    await new Promise(resolve => setTimeout(resolve, 250 + Math.random() * 150));
    return { hit: false };
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Ytelsesoptimaliseringer</h2>
          <Badge variant="outline" className={isRunning ? "bg-yellow-100" : "bg-green-100"}>
            {isRunning ? "Benchmark kjører..." : "Klar"}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Denne komponenten demonstrerer ytelsesoptimaliseringene vi har implementert
        </p>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
            <TabsTrigger value="results">Resultater</TabsTrigger>
          </TabsList>
          
          <TabsContent value="benchmark" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Original implementasjon</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Ingen caching av API-kall</li>
                    <li>Enkeltforespørsler for hver ressurs</li>
                    <li>Ingen deling av data mellom komponenter</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Optimalisert implementasjon</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>API-caching med LRU-strategi</li>
                    <li>Grupperte forespørsler</li>
                    <li>Stale-while-revalidate mønster</li>
                  </ul>
                </div>
              </div>
              
              <Button 
                onClick={runBenchmark} 
                disabled={isRunning}
                className="w-full"
              >
                {runCount === 0 ? "Start benchmark" : "Kjør ny test"}
              </Button>
              
              {benchmarkResults.original.length > 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Test #{runCount} fullført. Gå til "Resultater" for å se detaljene.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {benchmarkResults.original.length === 0 ? (
              <div className="text-center py-8">
                <p>Ingen resultater enda. Kjør benchmark-testen først.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <h3 className="font-medium">Original</h3>
                    <p className="text-2xl font-bold">
                      {(benchmarkResults.original.reduce((sum, val) => sum + val, 0) / 
                        benchmarkResults.original.length).toFixed(1)} ms
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Gjennomsnittlig responstid
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Optimalisert</h3>
                    <p className="text-2xl font-bold">
                      {(benchmarkResults.optimized.reduce((sum, val) => sum + val, 0) / 
                        benchmarkResults.optimized.length).toFixed(1)} ms
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Gjennomsnittlig responstid
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Forbedringer</h3>
                  
                  {benchmarkResults.improvements && (
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xl font-bold text-green-600">
                          {benchmarkResults.improvements.average.toFixed(1)}%
                        </p>
                        <p className="text-xs">Gjennomsnittlig hastighetsøkning</p>
                      </div>
                      
                      <div>
                        <p className="text-xl font-bold text-green-600">
                          {benchmarkResults.improvements.max.toFixed(1)}%
                        </p>
                        <p className="text-xs">Maksimal hastighetsøkning</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Cache-statistikk</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold">
                        {benchmarkResults.cacheStats.hits}
                      </p>
                      <p className="text-xs">Cache treff</p>
                    </div>
                    
                    <div>
                      <p className="text-xl font-bold">
                        {benchmarkResults.cacheStats.misses}
                      </p>
                      <p className="text-xs">Cache miss</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${benchmarkResults.cacheStats.hits / 
                            (benchmarkResults.cacheStats.hits + benchmarkResults.cacheStats.misses) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-center mt-1">
                      {(benchmarkResults.cacheStats.hits / 
                        (benchmarkResults.cacheStats.hits + benchmarkResults.cacheStats.misses) * 100).toFixed(1)}% 
                      cache effektivitet
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="font-medium mb-2">Individuelle testrunder</h3>
                  <div className="max-h-48 overflow-y-auto space-y-2 p-2">
                    {benchmarkResults.original.map((original, index) => (
                      <div key={index} className="grid grid-cols-3 text-sm">
                        <div>Test #{index + 1}</div>
                        <div>{original.toFixed(1)} ms</div>
                        <div className="flex items-center">
                          <span>{benchmarkResults.optimized[index].toFixed(1)} ms</span>
                          <span className="ml-2 text-xs text-green-600">
                            (-{((original - benchmarkResults.optimized[index]) / original * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
        <p>
          Merk: Denne benchmarken bruker simulerte data for å illustrere forbedringene. 
          Faktiske resultater vil variere basert på nettverksforhold og server-responstid.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PerformanceBenchmark;
