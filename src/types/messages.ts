/**
 * Re-export av message-typer (for bakoverkompatibilitet)
 * Dette løser problemet med feilaktig flertallsreferanse i importeringssetninger
 */

export * from './message';
export type { DecryptedMessage } from './message.d';
