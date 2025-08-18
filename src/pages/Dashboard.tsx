import React from 'react';

const Dashboard: React.FC = () => {
  const quickActions = [
    { icon: '💬', label: 'Start Chat', description: 'Begynn en ny samtale' },
    { icon: '👥', label: 'Finn Venner', description: 'Koble til nye personer' },
    { icon: '🤖', label: 'AI Assistent', description: 'Snakk med AI-assistenten' },
    { icon: '🔍', label: 'Utforsk', description: 'Søk i samtaler og grupper' }
  ];

  const stats = [
    { label: 'Samtaler', value: '24', icon: '💬' },
    { label: 'Venner', value: '12', icon: '❤️' },
    { label: 'Grupper', value: '5', icon: '👥' },
    { label: 'Meldinger', value: '1.2k', icon: '📈' }
  ];

  const recentActivity = [
    { icon: '💬', title: 'Ny melding i Teknologi-gruppen', time: '5 min siden' },
    { icon: '❤️', title: 'Du har en ny venneforespørsel', time: '10 min siden' },
    { icon: '🤖', title: 'AI-assistent svarte på spørsmålet ditt', time: '1 time siden' }
  ];

  return (
    <div className="min-h-screen bg-cyberdark-950 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cybergold-500/20 to-cybergold-600/20 border border-cybergold-500/30 rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-cybergold-400 mb-2">
          Velkommen tilbake, Bruker! 👋
        </h1>
        <p className="text-cyberdark-300">
          Din sikre kommunikasjonsplattform er klar for bruk
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={stat.label} className="bg-cyberdark-800/50 border border-cyberdark-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyberdark-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Hurtighandlinger</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={action.label}
              className="bg-gradient-to-br from-cyberblue-500/20 to-cyberblue-600/20 border border-cyberblue-500/30 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className="font-semibold mb-1 text-cyberblue-400">{action.label}</h3>
              <p className="text-cyberdark-300 text-sm">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Nylig aktivitet</h2>
        <div className="bg-cyberdark-800/50 border border-cyberdark-700 rounded-xl divide-y divide-cyberdark-700">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4 hover:bg-cyberdark-800/70 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-cyberdark-700 rounded-lg">
                  <span className="text-xl">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-cyberdark-400 text-sm">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;