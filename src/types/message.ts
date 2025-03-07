
export interface DecryptedMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url?: string | null;
  };
  receiver_id?: string | null;
  created_at: string;
  encryption_key: string;
  iv: string;
  is_encrypted?: boolean;
  ephemeral_ttl?: number;
  media_url?: string;
  media_type?: string;
  is_edited?: boolean;
  edited_at?: string | null;
  is_deleted?: boolean;
  deleted_at?: string | null;
  group_id?: boolean | null;
  // Adding the new properties for read receipts
  read_at?: string | null;
  is_delivered?: boolean;
}
