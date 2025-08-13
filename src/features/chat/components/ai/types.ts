
// Friend-focused workflows for connecting with people
export const WORKFLOWS = {
  'finn_venner': {
    id: 'finn_venner',
    title: 'Finn nye venner',
    description: 'Lær hvordan du kan finne og koble deg til nye venner på Snakkaz',
    steps: [
      { description: 'Gå til vennelisten i hovedmenyen' },
      { description: 'Bruk søkefunksjonen for å finne brukere' },
      { description: 'Send venneforespørsel til interessante profiler' },
      { description: 'Vent på godkjenning og start å chatte!' }
    ]
  },
  'inviter_venner': {
    id: 'inviter_venner', 
    title: 'Inviter venner',
    description: 'Inviter dine eksisterende venner til Snakkaz for sikker kommunikasjon',
    steps: [
      { description: 'Åpne innstillinger og velg "Inviter venner"' },
      { description: 'Del invitasjonslenken via SMS, e-post eller sosiale medier' },
      { description: 'Hjelp vennene dine med å registrere seg' },
      { description: 'Begynn å chatte sikkert sammen!' }
    ]
  },
  'sikker_chat': {
    id: 'sikker_chat',
    title: 'Sett opp sikker chat',
    description: 'Lær hvordan du setter opp ende-til-ende kryptert kommunikasjon',
    steps: [
      { description: 'Velg en venn fra vennelisten' },
      { description: 'Start en ny samtale' },
      { description: 'Aktiver ende-til-ende kryptering i samtaleinnstillingene' },
      { description: 'Chat trygt med full personvernsbeskyttelse!' }
    ]
  },
  'lag_grupper': {
    id: 'lag_grupper',
    title: 'Lag vennegrupper',
    description: 'Opprett gruppesamtaler med dine venner',
    steps: [
      { description: 'Gå til gruppeseksjonen i menyen' },
      { description: 'Trykk "Lag ny gruppe" og gi den et navn' },
      { description: 'Inviter venner fra vennelisten din' },
      { description: 'Konfigurer gruppeinnstillinger og start chattingen!' }
    ]
  }
};

// Friend-focused help topics
export const HELP_TOPICS = {
  'vennesystem': {
    id: 'vennesystem',
    title: 'Vennesystemet',
    description: 'Lær hvordan du bruker Snakkaz sitt vennesystem for å koble deg til andre',
    details: 'Vennesystemet lar deg finne, legge til og administrere forbindelser med andre brukere. Du kan sende venneforespørsler, akseptere innkommende forespørsler, og organisere dine kontakter for enkel tilgang.'
  },
  'personvern': {
    id: 'personvern',
    title: 'Personvern og sikkerhet',
    description: 'Forstå hvordan Snakkaz beskytter ditt personvern i vennskap',
    details: 'Alle samtaler er beskyttet med ende-til-ende kryptering. Dine vennedata lagres sikkert, og du har full kontroll over hvem som kan se profilen din og sende deg meldinger.'
  },
  'gruppechat': {
    id: 'gruppechat', 
    title: 'Gruppechat med venner',
    description: 'Lær hvordan du oppretter og administrerer gruppesamtaler',
    details: 'Opprett private eller offentlige grupper, inviter venner, sett administratortillatelser, og konfigurer sikkerhetsnivåer for gruppecommunikasjon.'
  },
  'invitasjoner': {
    id: 'invitasjoner',
    title: 'Invitere venner til Snakkaz',
    description: 'Hvordan invitere eksisterende venner til plattformen',
    details: 'Bruk invitasjonssystemet for å dele Snakkaz med venner. Send sikre invitasjonslenker som lar dem komme i gang raskt og enkelt.'
  }
};

export const COMMANDS = {
  'create_group': {
    description: 'Opprette en vennegruppe',
    confirm: true,
  },
  'invite_user': {
    description: 'Invitere en venn',
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
  'find_friends': {
    description: 'Søke etter nye venner',
    confirm: false,
  },
  'send_friend_request': {
    description: 'Sende venneforespørsel',
    confirm: true,
  },
};

export interface CommandDefinition {
  description: string;
  confirm: boolean;
}

export interface Command {
  action: string;
  payload: Record<string, unknown>;
}

export interface AIAction {
  type: 'workflow' | 'help' | 'command';
  payload: Record<string, unknown>;
}
