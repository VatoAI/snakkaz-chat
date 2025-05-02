
export interface MessageSender {
  id: string;
  username: string | null;
  full_name: string | null;
}

export interface DecryptedMessage {
  id: string;
  content: string;
  sender: MessageSender;
  sender_id?: string;
  receiver_id?: string;
  group_id?: string;
  created_at: string;
  updated_at: string;
  encryption_key?: string;
  iv?: string;
  is_encrypted?: boolean;
  is_deleted?: boolean;
  deleted_at?: string | null;
  ttl?: number;
  expires_at?: string;
  media?: {
    url: string;
    type: 'image' | 'video' | 'audio';
    thumbnail?: string;
  };
  readBy?: string[];
  replyTo?: string;
  replyToMessage?: {
    content: string;
    sender_id: string;
  };
}
