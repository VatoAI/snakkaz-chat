import React from 'react';
import { useNavigate } from 'react-router-dom';
import GroupManagement from '@/features/groups/components/GroupManagement';

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectGroup = (group: any) => {
    navigate(`/chat/group/${group.id}`);
  };

  return (
    <div className="min-h-screen bg-cyberdark-950 text-cybergold-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cybergold-400 to-cybergold-600 bg-clip-text text-transparent">
            Gruppe Management
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-cyberdark-800 hover:bg-cyberdark-700 rounded-lg border border-cyberdark-600 transition-colors"
          >
            Tilbake
          </button>
        </div>
        
        <GroupManagement onSelectGroup={handleSelectGroup} />
      </div>
    </div>
  );
};

export default GroupsPage;
