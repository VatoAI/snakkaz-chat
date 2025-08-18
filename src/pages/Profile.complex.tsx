import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Edit3,
  Save,
  Camera,
  MapPin,
  Globe
} from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth';
import './Profile.css';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.user_metadata?.username || '',
    fullName: user?.user_metadata?.full_name || '',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    website: user?.user_metadata?.website || '',
    phone: user?.user_metadata?.phone || ''
  });

  const handleSave = () => {
    // TODO: Implement profile update logic
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload
    console.log('Upload avatar');
  };

  return (
    <div className="profile-page min-h-screen bg-cyberdark-950 p-6">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cyberdark-800/50 border border-cyberdark-700 rounded-xl p-6 mb-8"
      >
        <div className="flex items-center space-x-6">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-cybergold-400 to-cybergold-600 rounded-full flex items-center justify-center">
              <User size={40} className="text-cyberdark-900" />
            </div>
            <button
              onClick={handleAvatarUpload}
              className="absolute bottom-0 right-0 w-8 h-8 bg-cybergold-500 hover:bg-cybergold-400 rounded-full flex items-center justify-center transition-colors"
            >
              <Camera size={16} className="text-cyberdark-900" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-white">
                {profileData.fullName || profileData.username || 'Unnamed User'}
              </h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-cybergold-600 hover:bg-cybergold-500 text-cyberdark-900 rounded-lg font-medium transition-colors"
              >
                {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                <span>{isEditing ? 'Lagre' : 'Rediger'}</span>
              </button>
            </div>
            <p className="text-cyberdark-300 mb-2">@{profileData.username}</p>
            <div className="flex items-center space-x-4 text-sm text-cyberdark-400">
              <div className="flex items-center space-x-1">
                <Mail size={14} />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>Ble med i mars 2024</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-cyberdark-800/50 border border-cyberdark-700 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Profilinformasjon</h2>
        
        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-cybergold-400 mb-2">
              Brukernavn
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                className="w-full px-4 py-3 bg-cyberdark-700 border border-cyberdark-600 rounded-lg text-white focus:border-cybergold-500 focus:ring-1 focus:ring-cybergold-500 transition-colors"
              />
            ) : (
              <p className="text-white">{profileData.username || 'Ikke angitt'}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-cybergold-400 mb-2">
              Fullt navn
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-cyberdark-700 border border-cyberdark-600 rounded-lg text-white focus:border-cybergold-500 focus:ring-1 focus:ring-cybergold-500 transition-colors"
              />
            ) : (
              <p className="text-white">{profileData.fullName || 'Ikke angitt'}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-cybergold-400 mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-cyberdark-700 border border-cyberdark-600 rounded-lg text-white focus:border-cybergold-500 focus:ring-1 focus:ring-cybergold-500 transition-colors resize-none"
                placeholder="Fortell litt om deg selv..."
              />
            ) : (
              <p className="text-white">{profileData.bio || 'Ingen bio lagt til'}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-cybergold-400 mb-2">
              <MapPin size={16} className="inline mr-1" />
              Lokasjon
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="w-full px-4 py-3 bg-cyberdark-700 border border-cyberdark-600 rounded-lg text-white focus:border-cybergold-500 focus:ring-1 focus:ring-cybergold-500 transition-colors"
                placeholder="Oslo, Norge"
              />
            ) : (
              <p className="text-white">{profileData.location || 'Ikke angitt'}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-cybergold-400 mb-2">
              <Globe size={16} className="inline mr-1" />
              Nettside
            </label>
            {isEditing ? (
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                className="w-full px-4 py-3 bg-cyberdark-700 border border-cyberdark-600 rounded-lg text-white focus:border-cybergold-500 focus:ring-1 focus:ring-cybergold-500 transition-colors"
                placeholder="https://example.com"
              />
            ) : (
              <p className="text-white">
                {profileData.website ? (
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-cybergold-400 hover:text-cybergold-300">
                    {profileData.website}
                  </a>
                ) : (
                  'Ikke angitt'
                )}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-cybergold-600 hover:bg-cybergold-500 text-cyberdark-900 py-3 rounded-lg font-medium transition-colors"
              >
                Lagre endringer
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-cyberdark-700 hover:bg-cyberdark-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Avbryt
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
