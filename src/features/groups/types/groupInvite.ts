
export interface GroupInvite {
  id: string;
  groupId: string;
  group_id?: string; // For backward compatibility 
  invitedById: string;
  invited_by?: string; // For backward compatibility
  invitedUserId: string;
  invited_user_id?: string; // For backward compatibility
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  created_at?: string; // For backward compatibility
  expiresAt?: string;
  expires_at?: string; // For backward compatibility
  // Computed properties for display
  group_name?: string;
  sender_username?: string;
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  code: string;
  email?: string;
  expires_at: string;
  created_by: string;
  createdAt: string;
}
