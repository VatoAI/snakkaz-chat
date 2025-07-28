import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Users, Activity, Settings, Zap, Database, Mail } from 'lucide-react';

export default function AdminDashboard() {
    const [refreshCount, setRefreshCount] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshCount(count => count + 1);
            setCurrentTime(new Date());
        }, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const formatUptime = () => {
        return '99.99%';
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Aurora background effect */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 animate-pulse opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent"></div>
            </div>

            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/beta"
                                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl inline-flex items-center transition-colors duration-200"
                                title="Tilbake til chat"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Tilbake til Chat
                            </Link>
                            <div>
                                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text">
                                    🌊 SnakkaZ Admin Dashboard
                                </h1>
                                <p className="text-cyan-200/80 mt-2">Live MCP Chat System Monitoring</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-lg">
                            <span className="font-medium">System Online</span>
                        </div>
                        <span className="text-slate-400 text-sm">
                            Auto-refresh: {refreshCount} | {currentTime.toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-400 text-sm font-medium">Totale Brukere</h3>
                            <Users className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="text-3xl font-bold text-white">{formatNumber(2847)}</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-400 text-sm font-medium">Totale Meldinger</h3>
                            <Activity className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-white">{formatNumber(45632)}</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-400 text-sm font-medium">Kryptering</h3>
                            <Zap className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="text-3xl font-bold text-white">98.7%</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-400 text-sm font-medium">Oppetid</h3>
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold text-white">{formatUptime()}</div>
                    </div>
                </div>

                {/* System Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <Database className="w-6 h-6 mr-2 text-cyan-400" />
                            Server Load
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-400">CPU Usage</span>
                                    <span className="text-cyan-300 font-medium">25%</span>
                                </div>
                                <div className="bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: '25%' }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-400">Memory</span>
                                    <span className="text-green-300 font-medium">68%</span>
                                </div>
                                <div className="bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: '68%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <Mail className="w-6 h-6 mr-2 text-purple-400" />
                            System Services
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-xl">
                                <span className="text-slate-200">MCP Chat Service</span>
                                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">✅ Aktiv</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-xl">
                                <span className="text-slate-200">Database</span>
                                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">✅ Tilkoblet</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-xl">
                                <span className="text-slate-200">WebSocket</span>
                                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">✅ Operativ</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Activity className="w-6 h-6 mr-2 text-orange-400" />
                        Siste Aktivitet
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-slate-200">Ny bruker registrert</span>
                            </div>
                            <span className="text-slate-400 text-sm">2 min siden</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-slate-200">System backup fullført</span>
                            </div>
                            <span className="text-slate-400 text-sm">15 min siden</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                <span className="text-slate-200">MCP service restarted</span>
                            </div>
                            <span className="text-slate-400 text-sm">1 time siden</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
