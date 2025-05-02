
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
  encryption_key: string;
  iv: string;
  ephemeral_ttl?: number;
  ttl?: number;  // Adding ttl prop
  media_url?: string;
  media_type?: string;
  media?: {  // Adding media prop
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
}
