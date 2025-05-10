
import React from 'react';
import { Group } from '@/features/groups/types';

interface GroupListProps {
  groups: Group[];
  currentUserId: string;
  setSelectedGroup: (group: Group) => void;
  searchQuery?: string;
  userProfiles?: Record<string, { username: string | null; avatar_url: string | null }>;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups, 
  currentUserId, 
  setSelectedGroup, 
  searchQuery = "",
  userProfiles = {}
}) => {
  // Filter groups by search query
  const filteredGroups = searchQuery ? 
    groups.filter(group => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    groups;
    
  return (
    <div className="space-y-2">
      {filteredGroups.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-500">No groups found</p>
        </div>
      ) : (
        filteredGroups.map(group => (
          <div 
            key={group.id}
            className="p-3 border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSelectedGroup(group)}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                {group.avatarUrl ? (
                  <img 
                    src={group.avatarUrl || group.avatar_url} 
                    alt={group.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-blue-500 font-bold">{group.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{group.name}</h3>
                {group.description && (
                  <p className="text-sm text-gray-500 truncate">{group.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  {group.memberCount || group.members?.length || 0} members
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
