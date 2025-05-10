
export const COMMANDS = {
  'create_group': {
    description: 'Opprette en gruppe',
    confirm: true,
  },
  'invite_user': {
    description: 'Invitere en bruker',
    confirm: true,
  },
  'delete_messages': {
    description: 'Slette meldinger',
    confirm: true,
  },
  'block_user': {
    description: 'Blokkere en bruker',
    confirm: true,
  },
  'activate_e2ee': {
    description: 'Aktivere ende-til-ende-kryptering',
    confirm: true,
  },
  'set_message_ttl': {
    description: 'Sette meldingsutløpstid',
    confirm: false,
  },
};

export interface CommandDefinition {
  description: string;
  confirm: boolean;
}

export interface Command {
  action: string;
  payload: any;
}
