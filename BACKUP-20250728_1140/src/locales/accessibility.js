// Norwegian Accessibility Configuration for SnakkaZ
export const NORWEGIAN_ACCESSIBILITY = {
  // Screen reader labels in Norwegian
  screenReaderLabels: {
    chatInput: 'Skriv melding her',
    sendButton: 'Send melding',
    attachFile: 'Legg ved fil',
    voiceCall: 'Start talesamtale',
    videoCall: 'Start videosamtale',
    userList: 'Liste over brukere',
    messageList: 'Meldingsliste',
    searchInput: 'Søk i samtaler',
    settingsButton: 'Åpne innstillinger',
    profileButton: 'Åpne profil',
    notificationCenter: 'Varslingssenter',
    menuButton: 'Åpne meny'
  },
  
  // ARIA labels in Norwegian
  ariaLabels: {
    navigation: 'Hovednavigasjon',
    main: 'Hovedinnhold',
    sidebar: 'Sidenavigasjon',
    chatArea: 'Samtaleområde',
    userProfile: 'Brukerprofil',
    messageComposer: 'Meldingskomposer',
    fileUpload: 'Filopplasting',
    emotionPicker: 'Velg emoji'
  },
  
  // Norwegian keyboard shortcuts
  keyboardShortcuts: {
    'Ctrl+Enter': 'Send melding',
    'Ctrl+K': 'Søk i samtaler',
    'Ctrl+N': 'Ny samtale',
    'Ctrl+,': 'Åpne innstillinger',
    'Ctrl+/': 'Vis hurtigtaster',
    'Alt+1': 'Gå til første samtale',
    'Alt+2': 'Gå til andre samtale',
    'Escape': 'Lukk dialog',
    'F1': 'Åpne hjelp'
  },
  
  // Norwegian voice commands (for future implementation)
  voiceCommands: {
    'send melding': 'Send current message',
    'ny samtale': 'Start new chat',
    'ring kontakt': 'Call contact',
    'åpne innstillinger': 'Open settings',
    'søk meldinger': 'Search messages',
    'legg ved fil': 'Attach file'
  },
  
  // High contrast mode labels
  highContrastLabels: {
    enable: 'Aktiver høy kontrast',
    disable: 'Deaktiver høy kontrast',
    description: 'Forbedrer synlighet for personer med synshemninger'
  },
  
  // Font size labels
  fontSizeLabels: {
    small: 'Liten skrift',
    medium: 'Normal skrift',
    large: 'Stor skrift',
    extraLarge: 'Ekstra stor skrift'
  }
};

// Norwegian error messages for accessibility
export const ACCESSIBILITY_ERRORS = {
  screenReaderNotDetected: 'Skjermleser ikke oppdaget. SnakkaZ fungerer best med NVDA eller JAWS.',
  keyboardNavigationIssue: 'Tastaturnafigasjon problem oppdaget. Trykk F1 for hjelp.',
  highContrastNotSupported: 'Høy kontrast modus ikke støttet i denne nettleseren.',
  voiceInputNotAvailable: 'Stemmeinput ikke tilgjengelig. Sjekk nettlesertillatelser.'
};

export default {
  NORWEGIAN_ACCESSIBILITY,
  ACCESSIBILITY_ERRORS
};
