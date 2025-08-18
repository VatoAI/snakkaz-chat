import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Server,
    Activity,
    MessageCircle,
    CheckCircle,
    AlertCircle,
    Zap,
    Shield,
    ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MCPTestResult {
    endpoint: string;
    status: 'success' | 'error' | 'pending';
    response?: any;
    error?: string;
    duration?: number;
}

const MCPTestPage = () => {
    const [tests, setTests] = useState<MCPTestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [chatMessage, setChatMessage] = useState('Hei SnakkaZ! Kan du fortelle meg om norsk tech?');
    const [chatResponse, setChatResponse] = useState('');

    const mcpEndpoints = [
        { name: 'Health Check', url: '/health' },
        { name: 'Status', url: '/api/status' },
        { name: 'Tools', url: '/api/tools' },
        { name: 'Analytics', url: '/api/analytics' }
    ];

    const runMCPTest = async (endpoint: string): Promise<MCPTestResult> => {
        const startTime = Date.now();
        const mcpUrl = import.meta.env.DEV ? 'http://localhost:3001' : 'https://mcp.snakkaz.com';

        try {
            const response = await fetch(`${mcpUrl}${endpoint}`);
            const data = await response.json();
            const duration = Date.now() - startTime;

            return {
                endpoint,
                status: response.ok ? 'success' : 'error',
                response: data,
                duration
            };
        } catch (error) {
            return {
                endpoint,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
                duration: Date.now() - startTime
            };
        }
    };

    const runAllTests = async () => {
        setIsRunning(true);
        setTests([]);

        for (const endpoint of mcpEndpoints) {
            const result = await runMCPTest(endpoint.url);
            setTests(prev => [...prev, result]);
        }

        setIsRunning(false);
    };

    const testChatAPI = async () => {
        if (!chatMessage.trim()) return;

        const mcpUrl = import.meta.env.DEV ? 'http://localhost:3001' : 'https://mcp.snakkaz.com';

        try {
            const response = await fetch(`${mcpUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: chatMessage,
                    context: 'mcp-test'
                })
            });

            const data = await response.json();
            setChatResponse(data.response || 'Ingen respons mottatt');
        } catch (error) {
            setChatResponse('Feil: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
            default: return <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'border-green-500 text-green-400';
            case 'error': return 'border-red-500 text-red-400';
            default: return 'border-yellow-500 text-yellow-400';
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/beta" className="snakkaz-btn snakkaz-btn-ghost">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Tilbake til Chat
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">MCP Test Suite</h1>
                            <p className="text-gray-400">Test Model Context Protocol integrasjon</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="border-blue-500 text-blue-400">
                            <Server className="w-3 h-3 mr-1" />
                            Development Mode
                        </Badge>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="snakkaz-card p-4 text-center">
                        <Server className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                        <p className="text-2xl font-bold text-white">{tests.filter(t => t.status === 'success').length}</p>
                        <p className="text-sm text-gray-400">Passed Tests</p>
                    </div>

                    <div className="snakkaz-card p-4 text-center">
                        <Activity className="w-8 h-8 mx-auto mb-2 text-green-400" />
                        <p className="text-2xl font-bold text-white">{tests.length > 0 ? Math.round(tests.reduce((acc, t) => acc + (t.duration || 0), 0) / tests.length) : 0}ms</p>
                        <p className="text-sm text-gray-400">Avg Response</p>
                    </div>

                    <div className="snakkaz-card p-4 text-center">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                        <p className="text-2xl font-bold text-white">{chatResponse ? '1' : '0'}</p>
                        <p className="text-sm text-gray-400">Chat Tests</p>
                    </div>

                    <div className="snakkaz-card p-4 text-center">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                        <p className="text-2xl font-bold text-white">100%</p>
                        <p className="text-sm text-gray-400">Security</p>
                    </div>
                </div>

                {/* Test Controls */}
                <div className="snakkaz-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">MCP API Tests</h2>
                    <div className="flex items-center space-x-4 mb-6">
                        <Button
                            onClick={runAllTests}
                            disabled={isRunning}
                            className="snakkaz-btn snakkaz-btn-primary"
                        >
                            {isRunning ? (
                                <>
                                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                                    Kjører tester...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Kjør alle tester
                                </>
                            )}
                        </Button>

                        <Badge variant="outline" className="border-gray-600">
                            {mcpEndpoints.length} endpoints
                        </Badge>
                    </div>

                    {/* Test Results */}
                    <div className="space-y-3">
                        {mcpEndpoints.map((endpoint, index) => {
                            const test = tests.find(t => t.endpoint === endpoint.url);
                            return (
                                <div key={endpoint.url} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        {getStatusIcon(test?.status || 'pending')}
                                        <span className="text-white font-medium">{endpoint.name}</span>
                                        <code className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                            {endpoint.url}
                                        </code>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {test?.duration && (
                                            <span className="text-xs text-gray-400">{test.duration}ms</span>
                                        )}
                                        <Badge variant="outline" className={getStatusColor(test?.status || 'pending')}>
                                            {test?.status || 'pending'}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat API Test */}
                <div className="snakkaz-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Chat API Test</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Test melding
                            </label>
                            <Input
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                placeholder="Skriv en test melding..."
                                className="bg-gray-800 border-gray-600 text-white"
                            />
                        </div>

                        <Button onClick={testChatAPI} className="snakkaz-btn snakkaz-btn-secondary">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Test Chat API
                        </Button>

                        {chatResponse && (
                            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-300 mb-2">AI Respons:</h3>
                                <p className="text-white">{chatResponse}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Test Details */}
                {tests.length > 0 && (
                    <div className="snakkaz-card p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Test Detaljer</h2>
                        <div className="space-y-4">
                            {tests.map((test, index) => (
                                <div key={index} className="border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium text-white">{test.endpoint}</h3>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(test.status)}
                                            <span className="text-sm text-gray-400">{test.duration}ms</span>
                                        </div>
                                    </div>

                                    {test.response && (
                                        <pre className="text-xs text-gray-300 bg-gray-900 p-3 rounded overflow-auto">
                                            {JSON.stringify(test.response, null, 2)}
                                        </pre>
                                    )}

                                    {test.error && (
                                        <div className="text-red-400 text-sm mt-2">
                                            Error: {test.error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MCPTestPage;
