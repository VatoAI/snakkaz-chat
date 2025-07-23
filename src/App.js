import React, { useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthProvider.js';
import AuthForm from './auth/AuthForm.js';
import ChatSystem from './chat/ChatSystem.js';
import InviteManager from './invite/InviteManager.js';

const AppContent = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'invites', 'profile'

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('chat');
  };

  if (loading) {
    return React.createElement('div', { 
      className: 'min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center' 
    },
      React.createElement('div', { 
        className: 'text-white text-2xl' 
      }, 'Loading SnakkaZ...')
    );
  }

  // Show auth form if not logged in
  if (!user) {
    return React.createElement('div', { 
      className: 'min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4' 
    },
      React.createElement(AuthForm)
    );
  }

  // Main app navigation
  const NavButton = ({ view, icon, label, isActive, onClick }) => {
    return React.createElement('button', {
      onClick,
      className: `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600/50 text-white border border-blue-400/50' 
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`
    },
      React.createElement('span', {}, icon),
      React.createElement('span', {}, label)
    );
  };

  return React.createElement('div', { 
    className: 'min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
  },
    // Top Navigation
    React.createElement('nav', { 
      className: 'bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4' 
    },
      React.createElement('div', { 
        className: 'flex justify-between items-center' 
      },
        React.createElement('div', { 
          className: 'flex items-center space-x-6' 
        },
          React.createElement('div', { 
            className: 'text-2xl font-bold text-white' 
          }, '💬 SnakkaZ Beta'),
          
          React.createElement('div', { 
            className: 'flex space-x-1' 
          },
            React.createElement(NavButton, {
              view: 'chat',
              icon: '💬',
              label: 'Chat',
              isActive: currentView === 'chat',
              onClick: () => setCurrentView('chat')
            }),
            React.createElement(NavButton, {
              view: 'invites',
              icon: '🎟️',
              label: 'Invites',
              isActive: currentView === 'invites',
              onClick: () => setCurrentView('invites')
            }),
            React.createElement(NavButton, {
              view: 'profile',
              icon: '👤',
              label: 'Profile',
              isActive: currentView === 'profile',
              onClick: () => setCurrentView('profile')
            })
          )
        ),
        
        React.createElement('div', { 
          className: 'flex items-center space-x-4' 
        },
          React.createElement('div', { 
            className: 'text-right' 
          },
            React.createElement('div', { 
              className: 'text-white font-medium' 
            }, profile?.display_name || profile?.username || user.email),
            React.createElement('div', { 
              className: 'text-white/60 text-sm' 
            }, `@${profile?.username || 'user'}`)
          ),
          
          React.createElement('div', { 
            className: 'w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center' 
          },
            React.createElement('span', { 
              className: 'text-white font-bold' 
            }, (profile?.username || user.email)?.[0]?.toUpperCase())
          ),
          
          React.createElement('button', {
            onClick: handleSignOut,
            className: 'px-4 py-2 text-white/70 hover:text-white hover:bg-red-600/20 rounded-lg border border-red-600/30 transition-all'
          }, 'Sign Out')
        )
      )
    ),

    // Main Content Area
    React.createElement('main', { 
      className: 'h-[calc(100vh-80px)]' 
    },
      currentView === 'chat' && React.createElement(ChatSystem),
      currentView === 'invites' && React.createElement(InviteManager),
      currentView === 'profile' && React.createElement(ProfileView)
    )
  );
};

// Profile View Component
const ProfileView = () => {
  const { user, profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    username: profile?.username || '',
    status: profile?.status || 'online'
  });

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  return React.createElement('div', { 
    className: 'max-w-2xl mx-auto p-6' 
  },
    React.createElement('div', { 
      className: 'bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20' 
    },
      React.createElement('h1', { 
        className: 'text-2xl font-bold text-white mb-6' 
      }, '👤 Profile Settings'),
      
      editing ? React.createElement('form', { 
        onSubmit: handleSave,
        className: 'space-y-4' 
      },
        React.createElement('div', {},
          React.createElement('label', { 
            className: 'block text-white/70 text-sm mb-2' 
          }, 'Display Name'),
          React.createElement('input', {
            type: 'text',
            value: formData.display_name,
            onChange: (e) => setFormData({...formData, display_name: e.target.value}),
            className: 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500'
          })
        ),
        
        React.createElement('div', {},
          React.createElement('label', { 
            className: 'block text-white/70 text-sm mb-2' 
          }, 'Username'),
          React.createElement('input', {
            type: 'text',
            value: formData.username,
            onChange: (e) => setFormData({...formData, username: e.target.value}),
            className: 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500'
          })
        ),
        
        React.createElement('div', {},
          React.createElement('label', { 
            className: 'block text-white/70 text-sm mb-2' 
          }, 'Status'),
          React.createElement('select', {
            value: formData.status,
            onChange: (e) => setFormData({...formData, status: e.target.value}),
            className: 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500'
          },
            React.createElement('option', { value: 'online' }, '🟢 Online'),
            React.createElement('option', { value: 'away' }, '🟡 Away'),
            React.createElement('option', { value: 'busy' }, '🔴 Busy'),
            React.createElement('option', { value: 'offline' }, '⚫ Offline')
          )
        ),
        
        React.createElement('div', { 
          className: 'flex space-x-4' 
        },
          React.createElement('button', {
            type: 'submit',
            className: 'px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
          }, 'Save Changes'),
          React.createElement('button', {
            type: 'button',
            onClick: () => setEditing(false),
            className: 'px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors'
          }, 'Cancel')
        )
      ) : React.createElement('div', { 
        className: 'space-y-4' 
      },
        React.createElement('div', { 
          className: 'flex items-center justify-between' 
        },
          React.createElement('div', {},
            React.createElement('div', { 
              className: 'text-white text-lg font-medium' 
            }, profile?.display_name || 'No display name'),
            React.createElement('div', { 
              className: 'text-white/60' 
            }, `@${profile?.username || 'no-username'}`)
          ),
          React.createElement('button', {
            onClick: () => setEditing(true),
            className: 'px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg border border-blue-600/30 transition-colors'
          }, 'Edit Profile')
        ),
        
        React.createElement('div', { 
          className: 'grid grid-cols-2 gap-4 mt-6' 
        },
          React.createElement('div', { 
            className: 'bg-white/5 rounded-lg p-4' 
          },
            React.createElement('div', { 
              className: 'text-white/70 text-sm' 
            }, 'Email'),
            React.createElement('div', { 
              className: 'text-white' 
            }, user?.email)
          ),
          React.createElement('div', { 
            className: 'bg-white/5 rounded-lg p-4' 
          },
            React.createElement('div', { 
              className: 'text-white/70 text-sm' 
            }, 'Status'),
            React.createElement('div', { 
              className: 'text-white' 
            }, 
              profile?.status === 'online' ? '🟢 Online' :
              profile?.status === 'away' ? '🟡 Away' :
              profile?.status === 'busy' ? '🔴 Busy' : '⚫ Offline'
            )
          )
        )
      )
    )
  );
};

// Main App Component
const App = () => {
  return React.createElement(AuthProvider, {},
    React.createElement(AppContent)
  );
};

export default App;
