import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import {
    IconUser, IconCamera, IconEdit, IconLogout, IconSettings,
    IconMoon, IconSun, IconBell, IconShield, IconX, IconCheck
} from '@tabler/icons-react';

interface UserProfileProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
    const { user, signOut } = useAuth();
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState({
        displayName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
        bio: user?.user_metadata?.bio || 'Hei! Jeg bruker SnakkaZ Chat 🚀',
        status: user?.user_metadata?.status || 'online',
        avatar: user?.user_metadata?.avatar_url || '',
        theme: 'light',
        notifications: true,
        privacy: 'friends'
    });

    const handleSave = async () => {
        // TODO: Save to Supabase user metadata
        console.log('Saving profile:', profile);
        setEditing(false);
    };

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // TODO: Upload to Supabase storage
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Min Profil</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                        >
                            <IconX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center overflow-hidden">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <IconUser className="w-10 h-10" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-1 cursor-pointer transition-colors">
                                <IconCamera className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="text-center mt-3">
                            <h3 className="text-lg font-semibold">{profile.displayName}</h3>
                            <p className="text-blue-100 text-sm">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-6 space-y-6">
                    {/* Display Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visningsnavn
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={profile.displayName}
                                onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                                disabled={!editing}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                            />
                            <button
                                onClick={() => setEditing(!editing)}
                                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                <IconEdit className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            disabled={!editing}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                            placeholder="Fortell litt om deg selv..."
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={profile.status}
                            onChange={(e) => setProfile(prev => ({ ...prev, status: e.target.value }))}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        >
                            <option value="online">🟢 Online</option>
                            <option value="away">🟡 Borte</option>
                            <option value="busy">🔴 Opptatt</option>
                            <option value="invisible">⚫ Usynlig</option>
                        </select>
                    </div>

                    {/* Settings */}
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <IconSettings className="w-4 h-4 mr-2" />
                            Innstillinger
                        </h4>

                        {/* Theme */}
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600 flex items-center">
                                {profile.theme === 'light' ? <IconSun className="w-4 h-4 mr-2" /> : <IconMoon className="w-4 h-4 mr-2" />}
                                Mørkt tema
                            </span>
                            <button
                                onClick={() => setProfile(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${profile.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600 flex items-center">
                                <IconBell className="w-4 h-4 mr-2" />
                                Notifikasjoner
                            </span>
                            <button
                                onClick={() => setProfile(prev => ({ ...prev, notifications: !prev.notifications }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.notifications ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${profile.notifications ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Privacy */}
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600 flex items-center">
                                <IconShield className="w-4 h-4 mr-2" />
                                Personvern
                            </span>
                            <select
                                value={profile.privacy}
                                onChange={(e) => setProfile(prev => ({ ...prev, privacy: e.target.value }))}
                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="public">Offentlig</option>
                                <option value="friends">Venner</option>
                                <option value="private">Privat</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        {editing && (
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <IconCheck className="w-4 h-4 mr-2" />
                                Lagre
                            </button>
                        )}

                        <button
                            onClick={() => {
                                signOut();
                                onClose();
                            }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <IconLogout className="w-4 h-4 mr-2" />
                            Logg ut
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
