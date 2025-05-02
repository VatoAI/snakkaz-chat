
export interface DecryptedMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  created_at: string;
  updated_at?: string;
  encryption_key: string;
  iv: string;
  ephemeral_ttl?: number;
  ttl?: number;
  media_url?: string;
  media_type?: string;
  media?: {
    url: string;
    type: string;
  };
  is_edited?: boolean;
  edited_at?: string | null;
  is_deleted?: boolean;
  deleted_at?: string | null;
  receiver_id?: string | null;
  group_id?: string | null;
  read_at?: string | null;
  is_delivered?: boolean;
  is_encrypted?: boolean;
  replyTo?: string;
  replyToMessage?: {
    content: string;
    sender_id: string;
  };
  status?: string;
  readBy?: string[];
}
