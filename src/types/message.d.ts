
export interface DecryptedMessage {
  id: string;
  content?: string;
  sender?: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  sender_id?: string;
  receiver_id?: string | null;
  group_id?: string | null;
  created_at: string;
  updated_at?: string;
  is_encrypted?: boolean;
  is_deleted?: boolean;
  deleted_at?: string | null;
  read_at?: string | null;
  encryption_key?: string;
  iv?: string;
  isPending?: boolean;
  hasError?: boolean;
}
