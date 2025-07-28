import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider.js';

const InviteManager = () => {
  const { user, profile, supabase } = useAuth();
  const [invites, setInvites] = useState([]);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalInvites: 0,
    usedInvites: 0,
    pendingInvites: 0
  });

  useEffect(() => {
    if (user) {
      loadInvites();
      loadStats();
    }
  }, [user]);

  const loadInvites = async () => {
    try {
      const { data, error } = await supabase
        .from('beta_invites')
        .select(`
          *,
          inviter:invited_by(username, display_name),
          invitee:used_by(username, display_name)
        `)
        .eq('invited_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvites(data || []);
    } catch (error) {
      console.error('Error loading invites:', error);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('beta_invites')
        .select('is_used, expires_at')
        .eq('invited_by', user.id);

      if (error) throw error;

      const now = new Date();
      const total = data.length;
      const used = data.filter(invite => invite.is_used).length;
      const pending = data.filter(invite => 
        !invite.is_used && new Date(invite.expires_at) > now
      ).length;

      setStats({
        totalInvites: total,
        usedInvites: used,
        pendingInvites: pending
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const generateInvite = async (email = null) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('generate_beta_invite', {
        invited_email: email
      });

      if (error) throw error;

      await loadInvites();
      await loadStats();
      setNewInviteEmail('');

      return data; // The invite code
    } catch (error) {
      console.error('Error generating invite:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    
    try {
      const inviteCode = await generateInvite(newInviteEmail || null);
      
      if (newInviteEmail) {
        // In a real app, you would send an email here
        alert(`Invite sent to ${newInviteEmail}!\nInvite code: ${inviteCode}`);
      } else {
        // Copy to clipboard
        navigator.clipboard.writeText(inviteCode).then(() => {
          alert(`Invite code generated and copied to clipboard: ${inviteCode}`);
        });
      }
    } catch (error) {
      alert('Error generating invite: ' + error.message);
    }
  };

  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Invite code copied to clipboard!');
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getInviteStatus = (invite) => {
    if (invite.is_used) {
      return { text: 'Used', color: 'text-green-400', bgColor: 'bg-green-400/20' };
    }
    
    const isExpired = new Date(invite.expires_at) < new Date();
    if (isExpired) {
      return { text: 'Expired', color: 'text-red-400', bgColor: 'bg-red-400/20' };
    }
    
    return { text: 'Pending', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' };
  };

  const getInviteLink = (code) => {
    return `${window.location.origin}/join?invite=${code}`;
  };

  return React.createElement('div', { 
    className: 'max-w-4xl mx-auto p-6' 
  },
    // Header
    React.createElement('div', { 
      className: 'mb-8' 
    },
      React.createElement('h1', { 
        className: 'text-3xl font-bold text-white mb-2' 
      }, '🎟️ Beta Invite Manager'),
      React.createElement('p', { 
        className: 'text-white/70' 
      }, 'Manage your SnakkaZ beta invitations and grow the community')
    ),

    // Stats Cards
    React.createElement('div', { 
      className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8' 
    },
      React.createElement('div', { 
        className: 'bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20' 
      },
        React.createElement('div', { 
          className: 'text-2xl font-bold text-white mb-1' 
        }, stats.totalInvites),
        React.createElement('div', { 
          className: 'text-white/70' 
        }, 'Total Invites')
      ),
      
      React.createElement('div', { 
        className: 'bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20' 
      },
        React.createElement('div', { 
          className: 'text-2xl font-bold text-green-400 mb-1' 
        }, stats.usedInvites),
        React.createElement('div', { 
          className: 'text-white/70' 
        }, 'Used Invites')
      ),
      
      React.createElement('div', { 
        className: 'bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20' 
      },
        React.createElement('div', { 
          className: 'text-2xl font-bold text-yellow-400 mb-1' 
        }, stats.pendingInvites),
        React.createElement('div', { 
          className: 'text-white/70' 
        }, 'Pending Invites')
      )
    ),

    // Generate New Invite
    React.createElement('div', { 
      className: 'bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8' 
    },
      React.createElement('h2', { 
        className: 'text-xl font-semibold text-white mb-4' 
      }, '✨ Generate New Invite'),
      
      React.createElement('form', { 
        onSubmit: handleGenerateInvite,
        className: 'flex flex-col sm:flex-row gap-4' 
      },
        React.createElement('input', {
          type: 'email',
          value: newInviteEmail,
          onChange: (e) => setNewInviteEmail(e.target.value),
          placeholder: 'Email address (optional)',
          className: 'flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500',
          disabled: loading
        }),
        
        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          className: 'px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50'
        }, loading ? 'Generating...' : 'Generate Invite')
      ),
      
      React.createElement('p', { 
        className: 'text-white/60 text-sm mt-2' 
      }, 'Leave email empty to generate a shareable invite code')
    ),

    // Invite History
    React.createElement('div', { 
      className: 'bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20' 
    },
      React.createElement('h2', { 
        className: 'text-xl font-semibold text-white mb-6' 
      }, '📋 Invite History'),
      
      invites.length === 0 ? React.createElement('div', { 
        className: 'text-center py-8' 
      },
        React.createElement('div', { 
          className: 'text-white/60 mb-2' 
        }, 'No invites generated yet'),
        React.createElement('div', { 
          className: 'text-white/40 text-sm' 
        }, 'Generate your first invite to get started')
      ) : React.createElement('div', { 
        className: 'space-y-4' 
      },
        invites.map(invite => {
          const status = getInviteStatus(invite);
          
          return React.createElement('div', {
            key: invite.id,
            className: 'bg-white/5 rounded-lg p-4 border border-white/10'
          },
            React.createElement('div', { 
              className: 'flex justify-between items-start mb-3' 
            },
              React.createElement('div', { 
                className: 'flex-1' 
              },
                React.createElement('div', { 
                  className: 'font-mono text-white text-lg mb-1' 
                }, invite.invite_code),
                
                invite.email && React.createElement('div', { 
                  className: 'text-white/70 text-sm' 
                }, `Sent to: ${invite.email}`)
              ),
              
              React.createElement('span', { 
                className: `px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bgColor}` 
              }, status.text)
            ),
            
            React.createElement('div', { 
              className: 'flex justify-between items-center text-sm' 
            },
              React.createElement('div', { 
                className: 'text-white/60' 
              },
                React.createElement('div', {}, `Created: ${formatDate(invite.created_at)}`),
                React.createElement('div', {}, `Expires: ${formatDate(invite.expires_at)}`),
                invite.is_used && invite.used_at && React.createElement('div', {}, 
                  `Used: ${formatDate(invite.used_at)} by ${invite.invitee?.display_name || invite.invitee?.username || 'Unknown'}`
                )
              ),
              
              !invite.is_used && new Date(invite.expires_at) > new Date() && React.createElement('div', { 
                className: 'flex space-x-2' 
              },
                React.createElement('button', {
                  onClick: () => copyInviteCode(invite.invite_code),
                  className: 'px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded border border-blue-600/30 transition-colors'
                }, 'Copy Code'),
                
                React.createElement('button', {
                  onClick: () => copyInviteCode(getInviteLink(invite.invite_code)),
                  className: 'px-3 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded border border-green-600/30 transition-colors'
                }, 'Copy Link')
              )
            )
          );
        })
      )
    ),

    // Info Section
    React.createElement('div', { 
      className: 'mt-8 bg-blue-900/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/20' 
    },
      React.createElement('h3', { 
        className: 'text-lg font-semibold text-blue-300 mb-3' 
      }, 'ℹ️ How Beta Invites Work'),
      
      React.createElement('ul', { 
        className: 'space-y-2 text-white/70' 
      },
        React.createElement('li', {}, '• Each invite code is valid for 7 days'),
        React.createElement('li', {}, '• Invite codes can only be used once'),
        React.createElement('li', {}, '• You can send invites directly to email or share the code'),
        React.createElement('li', {}, '• Users need a valid invite code to register for SnakkaZ Beta'),
        React.createElement('li', {}, '• Track your invite usage and help grow the community!')
      )
    )
  );
};

export default InviteManager;
