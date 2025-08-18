import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

const ProfilePageCloudMCP = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  // Use first letter of email or username for avatar
  const getInitials = () => {
    if (!user) return 'U';
    if (profile?.display_name) return profile.display_name.charAt(0);
    if (profile?.username) return profile.username.charAt(0);
    return user.email?.charAt(0).toUpperCase() || 'U';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('no-NO', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="glass-container p-8">
          <div className="animate-pulse">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="user-profile max-w-2xl w-full animate-fadeIn">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>
          <h1 className="profile-name">
            {profile?.display_name || profile?.username || user?.email?.split('@')[0]}
          </h1>
          <div className="profile-email">{user?.email}</div>
          <div className="profile-status">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Online</span>
          </div>
        </div>
        
        <div className="profile-section">
          <h2 className="profile-section-title">Profil</h2>
          <div className="profile-field">
            <div className="profile-field-name">Brukernavn</div>
            <div className="profile-field-value">@{profile?.username || 'brukernavn'}</div>
          </div>
          <div className="profile-field">
            <div className="profile-field-name">Bio</div>
            <div className="profile-field-value">{profile?.bio || 'Ingen biografi enda'}</div>
          </div>
        </div>
        
        <div className="profile-section">
          <h2 className="profile-section-title">Kontoinformasjon</h2>
          <div className="profile-field">
            <div className="profile-field-name">E-post</div>
            <div className="profile-field-value">{user?.email}</div>
          </div>
          <div className="profile-field">
            <div className="profile-field-name">Medlem siden</div>
            <div className="profile-field-value">{formatDate(profile?.created_at)}</div>
          </div>
          <div className="profile-field">
            <div className="profile-field-name">Abonnement</div>
            <div className="profile-field-value">Standard</div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8 gap-4">
          <button className="btn btn-primary">Rediger profil</button>
          <button className="btn btn-secondary">Innstillinger</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageCloudMCP;
