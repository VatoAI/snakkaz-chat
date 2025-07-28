import React, { useEffect, useState } from 'react';
import { getTopEmojis, getEmojiUsageOverTime, EmojiUsageStats, EmojiTimeAnalytics } from '@/utils/emojiAnalyticsUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Chart component (you may want to use a library like recharts or visx)
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';

interface EmojiAnalyticsProps {
  className?: string;
}

const EmojiAnalytics: React.FC<EmojiAnalyticsProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // Default to 30 days
  const [activeTab, setActiveTab] = useState<string>('top');
  const [topEmojis, setTopEmojis] = useState<EmojiUsageStats[]>([]);
  const [timeData, setTimeData] = useState<{ emoji: string; data: EmojiTimeAnalytics[] }[]>([]);
  const [selectedEmojiId, setSelectedEmojiId] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadTopEmojis();
  }, [timeRange]);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'top') {
      loadTopEmojis();
    } else if (activeTab === 'trends' && selectedEmojiId) {
      loadEmojiTrends(selectedEmojiId);
    }
  }, [activeTab, selectedEmojiId]);

  // Load top emojis
  const loadTopEmojis = async () => {
    setLoading(true);
    try {
      const days = parseInt(timeRange);
      const data = await getTopEmojis(10, days);
      setTopEmojis(data);
      
      // Set first emoji as selected if we don't have one yet
      if (!selectedEmojiId && data.length > 0) {
        setSelectedEmojiId(data[0].emojiId);
      }
    } catch (error) {
      console.error('Failed to load top emojis:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load emoji trends over time
  const loadEmojiTrends = async (emojiId: string) => {
    setLoading(true);
    try {
      const days = parseInt(timeRange);
      const data = await getEmojiUsageOverTime(emojiId, days);
      
      // Find emoji shortcode
      const emoji = topEmojis.find(e => e.emojiId === emojiId);
      const shortcode = emoji ? emoji.shortcode : emojiId;
      
      setTimeData([{ emoji: shortcode, data }]);
    } catch (error) {
      console.error('Failed to load emoji trends:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format data for bar chart
  const getBarChartData = () => {
    return topEmojis.map(emoji => ({
      emoji: emoji.shortcode,
      total: emoji.totalUses,
      reactions: emoji.reactionsCount,
      inMessages: emoji.inMessagesCount,
    }));
  };

  // Format data for line chart
  const getLineChartData = () => {
    return timeData.map(item => ({
      id: item.emoji,
      data: item.data.map(point => ({
        x: point.date,
        y: point.count,
      })),
    }));
  };

  return (
    <Card className={`${className || ''} overflow-hidden`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Emoji Analytics</CardTitle>
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tidsperiode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dager</SelectItem>
              <SelectItem value="30">30 dager</SelectItem>
              <SelectItem value="90">3 måneder</SelectItem>
              <SelectItem value="0">All tid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          Statistikk og trender for bruk av emojier
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="top">
              <BarChart className="mr-2 h-4 w-4" />
              Topp Emojis
            </TabsTrigger>
            <TabsTrigger value="trends">
              <LineChart className="mr-2 h-4 w-4" />
              Trender
            </TabsTrigger>
          </TabsList>
          
          {/* Top Emojis Tab */}
          <TabsContent value="top">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[30%]" />
                      <Skeleton className="h-3 w-[60%]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : topEmojis.length > 0 ? (
              <>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {topEmojis.map((emoji, index) => (
                      <div 
                        key={emoji.emojiId} 
                        className={`flex items-center p-2 rounded-md ${selectedEmojiId === emoji.emojiId ? 'bg-cyberdark-900' : ''}`}
                        onClick={() => setSelectedEmojiId(emoji.emojiId)}
                        role="button"
                      >
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          <img 
                            src={`/custom-emojis/${emoji.shortcode}.png`} 
                            alt={`:${emoji.shortcode}:`} 
                            className="max-w-[32px] max-h-[32px]"
                            onError={(e) => {
                              e.currentTarget.src = `/assets/emoji-placeholder.png`;
                            }}
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">:{emoji.shortcode}:</h4>
                            <Badge variant="outline" className="ml-1">
                              #{index + 1}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            <span>{emoji.totalUses} totalt</span>
                            <span className="mx-2">•</span>
                            <span>{emoji.uniqueUsers} brukere</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-semibold text-cybergold-400">{emoji.totalUses}</div>
                          <div className="text-xs text-gray-500">ganger brukt</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="mt-6 h-[200px]">
                  <ResponsiveBar
                    data={getBarChartData()}
                    keys={['reactions', 'inMessages']}
                    indexBy="emoji"
                    margin={{ top: 10, right: 10, bottom: 50, left: 60 }}
                    padding={0.3}
                    groupMode="grouped"
                    valueScale={{ type: 'linear' }}
                    colors={['#4f46e5', '#06b6d4']}
                    borderRadius={4}
                    axisLeft={{
                      legend: 'Count',
                      legendPosition: 'middle',
                      legendOffset: -40,
                    }}
                    axisBottom={{
                      legend: 'Emojis',
                      legendPosition: 'middle',
                      legendOffset: 32,
                    }}
                    legends={[
                      {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                      }
                    ]}
                    theme={{
                      text: { fill: '#a0aec0' },
                      axis: { ticks: { text: { fill: '#a0aec0' } } },
                      grid: { line: { stroke: '#2d3748', strokeWidth: 0.5 } },
                      legends: { text: { fill: '#a0aec0' } },
                    }}
                    role="application"
                    tooltip={({ id, value, color }) => (
                      <div
                        style={{
                          padding: 12,
                          color: '#ffffff',
                          background: '#1a202c',
                          borderRadius: 4,
                          border: '1px solid #2d3748',
                        }}
                      >
                        <div style={{ color, fontWeight: 'bold' }}>
                          {id === 'reactions' ? 'Reaksjoner' : 'I meldinger'}: {value}
                        </div>
                      </div>
                    )}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Ingen emoji-data funnet for valgt periode
              </div>
            )}
          </TabsContent>
          
          {/* Trends Tab */}
          <TabsContent value="trends">
            {loading ? (
              <div className="h-[350px]">
                <Skeleton className="w-full h-full rounded-md" />
              </div>
            ) : timeData.length > 0 ? (
              <div className="mt-4 h-[350px]">
                <ResponsiveLine
                  data={getLineChartData()}
                  margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: false,
                  }}
                  curve="natural"
                  axisLeft={{
                    legend: 'Antall',
                    legendOffset: -45,
                  }}
                  axisBottom={{
                    legend: 'Dato',
                    legendOffset: 36,
                    legendPosition: 'middle',
                  }}
                  colors={['#4f46e5']}
                  pointSize={10}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  enableGridX={false}
                  enableSlices="x"
                  legends={[
                    {
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: 'circle',
                      symbolBorderColor: 'rgba(0, 0, 0, .5)',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                          }
                        }
                      ]
                    }
                  ]}
                  theme={{
                    text: { fill: '#a0aec0' },
                    axis: { ticks: { text: { fill: '#a0aec0' } } },
                    grid: { line: { stroke: '#2d3748', strokeWidth: 0.5 } },
                    legends: { text: { fill: '#a0aec0' } },
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                {selectedEmojiId ? 
                  'Ingen trenddata funnet for valgt emoji' : 
                  'Velg en emoji for å se trender'}
              </div>
            )}
            
            {/* Emoji selector */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                Velg emoji for å se trend
              </h4>
              <div className="flex flex-wrap gap-2">
                {topEmojis.map(emoji => (
                  <button
                    key={emoji.emojiId}
                    className={`p-2 rounded-md transition-colors ${selectedEmojiId === emoji.emojiId ? 
                      'bg-cyberblue-900 border border-cyberblue-700' : 
                      'bg-cyberdark-900 hover:bg-cyberdark-800'}`}
                    onClick={() => {
                      setSelectedEmojiId(emoji.emojiId);
                      loadEmojiTrends(emoji.emojiId);
                    }}
                  >
                    <img 
                      src={`/custom-emojis/${emoji.shortcode}.png`} 
                      alt={`:${emoji.shortcode}:`} 
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.src = `/assets/emoji-placeholder.png`;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmojiAnalytics;
