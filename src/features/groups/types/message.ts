
export interface GroupMessage {
  id: string;
  content: string;
  text?: string; // For backward compatibility
  groupId: string;
  group_id?: string; // For backward compatibility
  senderId: string;
  sender_id?: string; // For backward compatibility
  createdAt: string;
  created_at?: string | Date; // For backward compatibility
  updatedAt: string;
  updated_at?: string; // For backward compatibility
  isEdited: boolean;
  is_edited?: boolean; // For backward compatibility
  isDeleted: boolean;
  is_deleted?: boolean; // For backward compatibility
  isPinned: boolean;
  is_pinned?: boolean; // For backward compatibility
  mediaUrl?: string;
  media_url?: string; // For backward compatibility
  mediaType?: string;
  media_type?: string; // For backward compatibility
  ttl?: number;
  readBy?: string[];
  read_by?: string[]; // For backward compatibility
  replyToId?: string;
  reply_to_id?: string; // For backward compatibility
  isEncrypted?: boolean;
  is_encrypted?: boolean; // For backward compatibility
}
