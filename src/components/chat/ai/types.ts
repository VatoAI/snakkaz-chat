export type ActionType = 'workflow' | 'help' | 'command';

export interface AIAction {
  type: ActionType;
  payload: any;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  action?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
}

export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  details: string[];
}

export interface Command {
  id: string;
  title: string;
  description: string;
  action: string;
  requiresConfirmation?: boolean;
}

// Predefinerte workflows
export const WORKFLOWS: Record<string, Workflow> = {
  chat: {
    id: 'chat',
    title: 'Start en chat',
    description: 'Guide for å starte en ny chat',
    steps: [
      {
        id: 'step1',
        title: 'Velg kontakt',
        description: 'Åpne vennelisten og velg personen du vil chatte med',
        action: 'openFriendsList'
      },
      {
        id: 'step2',
        title: 'Start chat',
        description: 'Klikk på chat-ikonet ved siden av kontakten',
        action: 'startChat'
      },
      {
        id: 'step3',
        title: 'Skriv melding',
        description: 'Skriv din melding i tekstfeltet nederst',
        action: 'focusMessageInput'
      },
      {
        id: 'step4',
        title: 'Send',
        description: 'Trykk Enter eller klikk på send-knappen',
        action: 'sendMessage'
      }
    ]
  },
  venner: {
    id: 'venner',
    title: 'Legg til venner',
    description: 'Guide for å finne og legge til venner',
    steps: [
      {
        id: 'step1',
        title: 'Finn bruker',
        description: 'Søk etter brukernavn i søkefeltet',
        action: 'openFriendSearch'
      },
      {
        id: 'step2',
        title: 'Send forespørsel',
        description: 'Klikk på "Legg til venn" knappen',
        action: 'sendFriendRequest'
      },
      {
        id: 'step3',
        title: 'Vent på svar',
        description: 'Vennforespørselen er sendt, vent på godkjenning'
      }
    ]
  }
};

// Predefinerte hjelpeemner
export const HELP_TOPICS: Record<string, HelpTopic> = {
  sikkerhet: {
    id: 'sikkerhet',
    title: 'Sikkerhet og personvern',
    description: 'Informasjon om sikkerhetsfunksjoner',
    details: [
      'Ende-til-ende kryptering for alle meldinger',
      'Mulighet for selvdestruerende meldinger',
      'Privat modus for usynlig status',
      'To-faktor autentisering for ekstra sikkerhet'
    ]
  },
  meldinger: {
    id: 'meldinger',
    title: 'Meldingsfunksjoner',
    description: 'Oversikt over meldingsfunksjoner',
    details: [
      'Send tekst, bilder og filer',
      'Rediger og slett meldinger',
      'Sett tidsbegrensning på meldinger',
      'Emoji og reaksjoner'
    ]
  }
};

// Predefinerte kommandoer
export const COMMANDS: Record<string, Command> = {
  status: {
    id: 'status',
    title: 'Endre status',
    description: 'Endre din online status',
    action: 'changeStatus'
  },
  tema: {
    id: 'tema',
    title: 'Endre tema',
    description: 'Bytt mellom lyst og mørkt tema',
    action: 'toggleTheme'
  },
  varsling: {
    id: 'varsling',
    title: 'Varslinger',
    description: 'Administrer varslingsinnstillinger',
    action: 'openNotifications'
  },
  loggut: {
    id: 'loggut',
    title: 'Logg ut',
    description: 'Logg ut av appen',
    action: 'logout',
    requiresConfirmation: true
  }
};