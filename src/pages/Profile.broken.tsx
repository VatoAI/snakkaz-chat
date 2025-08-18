import React from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  return (
    <div className="profile">
      {/* Profile Header */}
      <section className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <img src="/logos/snakkaz-icon-192.png" alt="Profil" />
            <button className="avatar-edit-btn">📷</button>
          </div>
          <div className="profile-info">
            <h2>John Doe</h2>
            <p>@johndoe</p>
            <span className="profile-status online">Online</span>
          </div>
        </div>
        <button className="edit-profile-btn">Rediger profil</button>
      </section>

      {/* Profile Stats */}
      <section className="profile-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">127</span>
            <span className="stat-label">Samtaler</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3.2k</span>
            <span className="stat-label">Meldinger</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">45</span>
            <span className="stat-label">Kontakter</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">12</span>
            <span className="stat-label">Grupper</span>
          </div>
        </div>
      </section>

      {/* Profile Actions */}
      <section className="profile-actions">
        <h3>Kontoinformasjon</h3>
        <div className="action-list">
          <button className="action-item">
            <div className="action-icon">👤</div>
            <div className="action-content">
              <div className="action-title">Personlig informasjon</div>
              <div className="action-subtitle">Navn, telefon, e-post</div>
            </div>
            <div className="action-arrow">›</div>
          </button>

          <button className="action-item">
            <div className="action-icon">🔒</div>
            <div className="action-content">
              <div className="action-title">Personvern og sikkerhet</div>
              <div className="action-subtitle">Passord, to-faktor autentisering</div>
            </div>
            <div className="action-arrow">›</div>
          </button>

          <button className="action-item">
            <div className="action-icon">🔔</div>
            <div className="action-content">
              <div className="action-title">Varsler</div>
              <div className="action-subtitle">Push-varsler, lyd, vibrasjon</div>
            </div>
            <div className="action-arrow">›</div>
          </button>

          <button className="action-item">
            <div className="action-icon">🎨</div>
            <div className="action-content">
              <div className="action-title">Utseende</div>
              <div className="action-subtitle">Tema, farger, skriftstørrelse</div>
            </div>
            <div className="action-arrow">›</div>
          </button>
        </div>
      </section>

      {/* Activity Summary */}
      <section className="activity-summary">
        <h3>Aktivitetssammendrag</h3>
        <div className="activity-cards">
          <div className="activity-card">
            <div className="activity-header">
              <span className="activity-icon">📈</span>
              <span className="activity-period">Denne uken</span>
            </div>
            <div className="activity-metric">
              <span className="activity-value">89</span>
              <span className="activity-label">Meldinger sendt</span>
            </div>
            <div className="activity-change positive">+23% fra forrige uke</div>
          </div>

          <div className="activity-card">
            <div className="activity-header">
              <span className="activity-icon">⏱️</span>
              <span className="activity-period">I dag</span>
            </div>
            <div className="activity-metric">
              <span className="activity-value">2t 34m</span>
              <span className="activity-label">Tid i app</span>
            </div>
            <div className="activity-change neutral">Samme som i går</div>
          </div>
        </div>
      </section>

      {/* Recent Conversations */}
      <section className="recent-conversations">
        <h3>Nylige samtaler</h3>
        <div className="conversation-list">
          <div className="conversation-item">
            <div className="conversation-avatar">🤖</div>
            <div className="conversation-content">
              <div className="conversation-name">SnakkaZ AI</div>
              <div className="conversation-last-message">Kan jeg hjelpe deg med noe mer?</div>
            </div>
            <div className="conversation-time">14:23</div>
          </div>

          <div className="conversation-item">
            <div className="conversation-avatar">👨‍💼</div>
            <div className="conversation-content">
              <div className="conversation-name">Support Team</div>
              <div className="conversation-last-message">Takk for henvendelsen! Vi vil komme tilbake...</div>
            </div>
            <div className="conversation-time">12:45</div>
          </div>

          <div className="conversation-item">
            <div className="conversation-avatar">👥</div>
            <div className="conversation-content">
              <div className="conversation-name">Team SnakkaZ</div>
              <div className="conversation-last-message">Velkommen til gruppen!</div>
            </div>
            <div className="conversation-time">10:12</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
avatarUrl: '',
  status: 'online',
    publicProfile: true
  });

const [isEditing, setIsEditing] = useState(isFirstTime); // Auto-edit mode for first-time users
const [editedProfile, setEditedProfile] = useState({ ...profile });
const [activeTab, setActiveTab] = useState('profile');

// Show welcome message for first-time users
useEffect(() => {
  if (isFirstTime) {
    toast({
      title: "Velkommen til Snakkaz Chat! 🎉",
      description: "La oss sette opp profilen din for å komme i gang.",
    });
  }
}, [isFirstTime, toast]);

const handleEditToggle = () => {
  if (isEditing) {
    // Save changes
    setProfile(editedProfile);
    toast({
      title: "Profil oppdatert",
      description: "Profilendringene dine har blitt lagret.",
    });

    // If it's a first-time user, redirect to dashboard after saving
    if (isFirstTime) {
      setTimeout(() => {
        toast({
          title: "Profil fullført! ✅",
          description: "Du blir nå sendt til hovedsiden.",
        });
        navigate('/dashboard');
      }, 1500);
    }
  }
  setIsEditing(!isEditing);
};

const handleSkipProfile = () => {
  if (isFirstTime) {
    navigate('/dashboard');
  }
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setEditedProfile(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleSwitchChange = (checked: boolean) => {
  setEditedProfile(prev => ({
    ...prev,
    publicProfile: checked
  }));
};

const handleAvatarUpload = () => {
  // Mock implementation - would open a file picker in real app
  toast({
    title: "Bilde-opplasting",
    description: "Funksjon for å laste opp profilbilde er under utvikling.",
  });
};

return (
  <div className="min-h-screen bg-cyberdark-950 text-cybergold-300 pb-16 md:pb-0 md:pt-16">
    <UnifiedNavigation variant="horizontal" />

    <main className="container max-w-4xl py-8 px-4">
      {/* First-time user welcome section */}
      {isFirstTime && (
        <Card className="mb-6 bg-gradient-to-r from-cybergold-900/20 to-cyberdark-800 border-cybergold-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-cybergold-400 mb-2">
                  Velkommen til Snakkaz Chat! 🎉
                </h2>
                <p className="text-cybergold-300 mb-4">
                  La oss sette opp profilen din for å komme i gang med å chatte.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSkipProfile}
                className="border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20"
              >
                Hopp over <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cybergold-400">
          {isFirstTime ? 'Sett opp profilen din' : 'Min profil'}
        </h1>
        <div className="flex items-center gap-2">
          {isPremium && (
            <Badge className="bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-cyberdark-900 flex items-center gap-1">
              <Crown className="h-3 w-3" /> Premium
            </Badge>
          )}
          <Badge variant="outline" className="border-cybergold-600 text-cybergold-400">
            {user?.email}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 bg-cyberdark-800">
          <TabsTrigger value="profile" className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400">
            Profildetaljer
          </TabsTrigger>
          {isPremium && (
            <TabsTrigger value="email" className="data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400">
              Premium E-post
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile picture and basic info */}
            <Card className="bg-cyberdark-900 border-cyberdark-700 md:col-span-1">
              <CardHeader className="pb-0">
                <CardTitle className="text-cybergold-400">Profilbilde</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-6">
                <div className="relative mb-6">
                  <Avatar className="w-32 h-32 border-4 border-cybergold-600">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="bg-cyberdark-800 text-cybergold-500 text-4xl">
                      <User />
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 bg-cybergold-600 hover:bg-cybergold-500 text-black rounded-full h-10 w-10"
                      onClick={handleAvatarUpload}
                    >
                      <Camera className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                <div className="text-center w-full">
                  <h2 className="text-xl font-bold text-cybergold-400 mb-1">
                    {isEditing ? (
                      <Input
                        name="displayName"
                        value={editedProfile.displayName}
                        onChange={handleInputChange}
                        placeholder="Visningsnavn"
                        className="bg-cyberdark-800 border-cyberdark-700 text-center"
                      />
                    ) : (
                      profile.displayName || 'Legg til visningsnavn'
                    )}
                  </h2>

                  <p className="text-cybergold-600 mb-3">
                    @{isEditing ? (
                      <Input
                        name="username"
                        value={editedProfile.username}
                        onChange={handleInputChange}
                        placeholder="brukernavn"
                        className="bg-cyberdark-800 border-cyberdark-700 text-center mt-2"
                      />
                    ) : (
                      profile.username
                    )}
                  </p>

                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className={`h-2 w-2 rounded-full ${profile.status === 'online' ? 'bg-green-500' :
                        profile.status === 'away' ? 'bg-amber-500' :
                          'bg-red-500'
                      }`} />
                    <span className="text-sm text-cybergold-500 capitalize">
                      {profile.status}
                    </span>
                  </div>

                  <Button
                    variant={isEditing ? "default" : "outline"}
                    className={isEditing ?
                      "bg-cybergold-600 hover:bg-cybergold-500 text-black w-full" :
                      "bg-cyberdark-800 border-cyberdark-700 hover:bg-cyberdark-700 w-full"
                    }
                    onClick={handleEditToggle}
                  >
                    {isEditing ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {isFirstTime ? 'Fullfør oppsettet' : 'Lagre endringer'}
                      </>
                    ) : (
                      'Rediger profil'
                    )}
                  </Button>

                  {isEditing && (
                    <Button
                      variant="outline"
                      className="bg-red-900/20 border-red-900/50 hover:bg-red-900/30 text-red-400 mt-2 w-full"
                      onClick={() => {
                        setEditedProfile({ ...profile });
                        setIsEditing(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Avbryt
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profile details */}
            <Card className="bg-cyberdark-900 border-cyberdark-700 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-cybergold-400">Profildetaljer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bio section */}
                <div>
                  <Label htmlFor="bio" className="text-sm text-cybergold-500">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Skriv litt om deg selv..."
                      value={editedProfile.bio}
                      onChange={handleInputChange}
                      className="mt-2 bg-cyberdark-800 border-cyberdark-700 min-h-[120px]"
                    />
                  ) : (
                    <div className="mt-2 p-3 bg-cyberdark-800 rounded-md min-h-[80px]">
                      {profile.bio || <span className="text-cybergold-600 italic">Ingen biografi enda</span>}
                    </div>
                  )}
                </div>

                <Separator className="bg-cyberdark-700" />

                {/* Public profile setting */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-cybergold-400">Offentlig profil</h3>
                    <p className="text-xs text-cybergold-600">Tillat andre å se profilen din</p>
                  </div>
                  {isEditing ? (
                    <Switch
                      checked={editedProfile.publicProfile}
                      onCheckedChange={handleSwitchChange}
                      className="data-[state=checked]:bg-cybergold-500"
                    />
                  ) : (
                    <Badge
                      variant="outline"
                      className={
                        profile.publicProfile ?
                          "border-green-600 text-green-400" :
                          "border-red-600 text-red-400"
                      }
                    >
                      {profile.publicProfile ? "Synlig" : "Privat"}
                    </Badge>
                  )}
                </div>

                <Separator className="bg-cyberdark-700" />

                {/* Account info */}
                <div>
                  <h3 className="text-sm font-medium text-cybergold-400 mb-4">Kontoinformasjon</h3>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 items-center text-sm">
                      <span className="text-cybergold-600">E-post</span>
                      <span className="col-span-2 text-cybergold-300">{user?.email}</span>
                    </div>

                    <div className="grid grid-cols-3 items-center text-sm">
                      <span className="text-cybergold-600">Medlem siden</span>
                      <span className="col-span-2 text-cybergold-300">Mai 2025</span>
                    </div>

                    <div className="grid grid-cols-3 items-center text-sm">
                      <span className="text-cybergold-600">Abonnement</span>
                      <span className="col-span-2 text-cybergold-300">
                        {isPremium ? (
                          <Badge className="bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-cyberdark-900">
                            Premium
                          </Badge>
                        ) : (
                          'Standard'
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 items-center text-sm">
                      <span className="text-cybergold-600">ID</span>
                      <span className="col-span-2 text-cybergold-300 break-all">
                        {user?.id || 'Ikke tilgjengelig'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity stats */}
            <Card className="bg-cyberdark-900 border-cyberdark-700 md:col-span-3">
              <CardHeader>
                <CardTitle className="text-cybergold-400">Aktivitet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  <div className="bg-cyberdark-800 p-4 rounded-lg text-center">
                    <h3 className="text-cybergold-600 text-sm mb-1">Meldinger</h3>
                    <p className="text-2xl font-bold text-cybergold-400">0</p>
                  </div>
                  <div className="bg-cyberdark-800 p-4 rounded-lg text-center">
                    <h3 className="text-cybergold-600 text-sm mb-1">Grupper</h3>
                    <p className="text-2xl font-bold text-cybergold-400">0</p>
                  </div>
                  <div className="bg-cyberdark-800 p-4 rounded-lg text-center">
                    <h3 className="text-cybergold-600 text-sm mb-1">Kontakter</h3>
                    <p className="text-2xl font-bold text-cybergold-400">0</p>
                  </div>
                  <div className="bg-cyberdark-800 p-4 rounded-lg text-center">
                    <h3 className="text-cybergold-600 text-sm mb-1">Delte filer</h3>
                    <p className="text-2xl font-bold text-cybergold-400">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {isPremium && (
          <TabsContent value="email">
            <PremiumEmailManager />
          </TabsContent>
        )}
      </Tabs>
    </main>
  </div>
);
};

export default Profile;
