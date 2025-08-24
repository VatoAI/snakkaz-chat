import React, { useState } from 'react';
import { User, Mail, Settings, Camera, Edit3, Save } from 'lucide-react';
import SnakkaZNavigationFixed from '../components/navigation/SnakkaZNavigationFixed';

const EnhancedProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Erik Nordmann',
        username: '@erik_n',
        email: 'erik@snakkaz.com',
        bio: 'SnakkaZ Premium-bruker. Krypterte samtaler og norsk eleganse. 🇳🇴',
        location: 'Oslo, Norge',
        joinedDate: '2024',
        avatar: '/api/placeholder/120/120'
    });

    const handleSave = () => {
        setIsEditing(false);
        // Save logic here
    };

    return (
        <div className="snakkaz-page min-h-screen flex">
            {/* Navigation */}
            <SnakkaZNavigationFixed />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Min Profil
                        </h1>
                        <p className="text-white/60">
                            Administrer profilinnstillinger og personlig informasjon
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="snakkaz-glass-card p-8 mb-6">
                        <div className="flex items-start gap-8">
                            {/* Avatar Section */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="Profilbilde" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-white" />
                                    )}
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="snakkaz-input text-2xl font-bold"
                                            placeholder="Navn"
                                        />
                                        <input
                                            type="text"
                                            value={profile.username}
                                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                            className="snakkaz-input text-white/60"
                                            placeholder="Brukernavn"
                                        />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="snakkaz-input text-white/60"
                                            placeholder="E-post"
                                        />
                                        <textarea
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            className="snakkaz-input h-20 resize-none"
                                            placeholder="Bio"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                                        <p className="text-white/60">{profile.username}</p>
                                        <p className="text-white/60 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {profile.email}
                                        </p>
                                        <p className="text-white/80 mt-4">{profile.bio}</p>
                                        <p className="text-white/40 text-sm">
                                            Medlem siden {profile.joinedDate}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="snakkaz-button-primary flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                Lagre endringer
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="snakkaz-button-secondary"
                                            >
                                                Avbryt
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="snakkaz-button-primary flex items-center gap-2"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Rediger profil
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="snakkaz-glass-card p-6 text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-2">2,483</div>
                            <div className="text-white/60">Meldinger sendt</div>
                        </div>
                        <div className="snakkaz-glass-card p-6 text-center">
                            <div className="text-3xl font-bold text-green-400 mb-2">15</div>
                            <div className="text-white/60">Aktive samtaler</div>
                        </div>
                        <div className="snakkaz-glass-card p-6 text-center">
                            <div className="text-3xl font-bold text-purple-400 mb-2">89%</div>
                            <div className="text-white/60">Sikkerhetsscore</div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="snakkaz-glass-card p-6">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Kontoinnstillinger
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <div className="text-white font-medium">To-faktor autentisering</div>
                                    <div className="text-white/60 text-sm">Ekstra sikkerhet for kontoen din</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <div className="text-white font-medium">Forsvinnende meldinger</div>
                                    <div className="text-white/60 text-sm">Meldinger slettes automatisk</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <div className="text-white font-medium">End-to-end kryptering</div>
                                    <div className="text-white/60 text-sm">Alle meldinger krypteres automatisk</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                                    <div className="w-11 h-6 bg-green-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EnhancedProfilePage;
