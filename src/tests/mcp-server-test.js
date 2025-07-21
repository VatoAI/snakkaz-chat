/**
 * MCP Signalerings-server for testing
 * 
 * Dette er en enkel WebSocket-server som implementerer MCP-protokollen
 * for signalering og fallback-meldinger for WebRTC-tilkoblinger.
 * 
 * Brukes kun for testformål - i produksjon vil dette kjøre på en dedikert server.
 */

import { WebSocketServer } from 'ws';
import http from 'http';

// Serverinnstillinger
const PORT = process.env.PORT || 3033;
const PING_INTERVAL = 30000; // 30 sekunder
const PING_TIMEOUT = 5000; // 5 sekunder
const CONNECTION_TIMEOUT = 60000; // 60 sekunder

// Brukertilkoblinger
const users = new Map();

// Opprett HTTP-server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('MCP Signalering Server kjører');
});

// Opprett WebSocket-server
const wss = new WebSocketServer({ server });

// Logging
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Brukerhåndtering
function registerUser(userId, ws) {
  if (users.has(userId)) {
    const existingConnection = users.get(userId);
    log(`Erstatter eksisterende tilkobling for bruker ${userId}`);
    existingConnection.close(1000, 'Erstattet av ny tilkobling');
  }

  const userConnection = {
    userId,
    ws,
    lastSeen: Date.now(),
    isAlive: true,
    pingTimeout: null,
    registeredSignaling: false,
    pendingMessages: [],
  };

  users.set(userId, userConnection);
  log(`Bruker ${userId} registrert`);

  return userConnection;
}

function removeUser(userId) {
  if (users.has(userId)) {
    const userConnection = users.get(userId);
    if (userConnection.pingTimeout) {
      clearTimeout(userConnection.pingTimeout);
    }
    users.delete(userId);
    log(`Bruker ${userId} fjernet`);

    // Informer andre brukere om at brukeren er frakoblet
    broadcast({
      type: 'user_offline',
      userId
    }, userId);
  }
}

function getUserConnection(userId) {
  return users.get(userId);
}

// Meldingshåndtering
function handleMessage(message, ws) {
  try {
    const data = JSON.parse(message);

    // Legg til timestamp for behandling
    data.serverTimestamp = Date.now();

    switch (data.type) {
      case 'auth':
        handleAuth(data, ws);
        break;
      case 'register_signaling':
        handleRegisterSignaling(data, ws);
        break;
      case 'webrtc_signal':
        handleWebRTCSignal(data);
        break;
      case 'message':
        handleDirectMessage(data);
        break;
      case 'ping':
        handlePing(data, ws);
        break;
      case 'get_users':
        handleGetUsers(data, ws);
        break;
      default:
        log(`Ukjent meldingstype: ${data.type}`);
        ws.send(JSON.stringify({
          type: 'error',
          error: 'unknown_message_type',
          originalType: data.type
        }));
    }
  } catch (err) {
    log(`Feil ved behandling av melding: ${err.message}`);
    ws.send(JSON.stringify({
      type: 'error',
      error: 'invalid_message',
      details: err.message
    }));
  }
}

// Håndter autentisering
function handleAuth(data, ws) {
  const { userId, token } = data;

  if (!userId) {
    ws.send(JSON.stringify({
      type: 'auth_error',
      error: 'missing_user_id'
    }));
    return;
  }

  // For testformål godtar vi alle autentiseringer
  // I produksjon vil vi validere token mot en database

  const userConnection = registerUser(userId, ws);

  ws.send(JSON.stringify({
    type: 'auth_success',
    userId,
    serverTime: Date.now()
  }));

  // Informer alle om at brukeren er tilkoblet
  broadcast({
    type: 'user_online',
    userId
  }, userId);

  // Send ventende meldinger
  if (userConnection.pendingMessages.length > 0) {
    log(`Sender ${userConnection.pendingMessages.length} ventende meldinger til ${userId}`);

    for (const message of userConnection.pendingMessages) {
      ws.send(JSON.stringify(message));
    }

    userConnection.pendingMessages = [];
  }
}

// Håndter registrering for signalering
function handleRegisterSignaling(data, ws) {
  const { userId } = data;
  const userConnection = getUserConnection(userId);

  if (!userConnection) {
    ws.send(JSON.stringify({
      type: 'error',
      error: 'not_authenticated'
    }));
    return;
  }

  userConnection.registeredSignaling = true;

  ws.send(JSON.stringify({
    type: 'signaling_registered',
    userId
  }));

  log(`Bruker ${userId} registrert for signalering`);
}

// Håndter WebRTC-signal
function handleWebRTCSignal(data) {
  const { payload } = data;

  if (!payload || !payload.fromUserId || !payload.toUserId || !payload.signal) {
    log('Ugyldig WebRTC-signal mottatt');
    return;
  }

  const { fromUserId, toUserId, signal } = payload;
  const targetUserConnection = getUserConnection(toUserId);

  if (!targetUserConnection) {
    log(`Mottaker ${toUserId} ikke funnet for signalering`);

    // Lagre meldingen som ventende
    const pendingMessage = {
      type: 'webrtc_signal',
      payload: {
        fromUserId,
        signal
      },
      timestamp: Date.now()
    };

    if (!users.has(toUserId)) {
      users.set(toUserId, {
        userId: toUserId,
        ws: null,
        lastSeen: 0,
        isAlive: false,
        pingTimeout: null,
        registeredSignaling: false,
        pendingMessages: [pendingMessage]
      });

      log(`Opprettet midlertidig bruker ${toUserId} med ventende melding`);
    } else {
      users.get(toUserId).pendingMessages.push(pendingMessage);
    }

    return;
  }

  if (!targetUserConnection.registeredSignaling) {
    log(`Mottaker ${toUserId} ikke registrert for signalering`);
    return;
  }

  // Send signalet til mottakeren
  targetUserConnection.ws.send(JSON.stringify({
    type: 'webrtc_signal',
    payload: {
      fromUserId,
      signal
    },
    timestamp: Date.now()
  }));

  log(`Signal sendt fra ${fromUserId} til ${toUserId}`);
}

// Håndter direktemelding
function handleDirectMessage(data) {
  const { fromUserId, toUserId, content } = data;

  if (!fromUserId || !toUserId || !content) {
    log('Ugyldig direktemelding mottatt');
    return;
  }

  const targetUserConnection = getUserConnection(toUserId);

  if (!targetUserConnection) {
    log(`Mottaker ${toUserId} ikke funnet for direktemelding`);

    // Lagre meldingen som ventende
    const pendingMessage = {
      type: 'message',
      fromUserId,
      content,
      timestamp: Date.now()
    };

    if (!users.has(toUserId)) {
      users.set(toUserId, {
        userId: toUserId,
        ws: null,
        lastSeen: 0,
        isAlive: false,
        pingTimeout: null,
        registeredSignaling: false,
        pendingMessages: [pendingMessage]
      });

      log(`Opprettet midlertidig bruker ${toUserId} med ventende melding`);
    } else {
      users.get(toUserId).pendingMessages.push(pendingMessage);
    }

    return;
  }

  // Send meldingen til mottakeren
  targetUserConnection.ws.send(JSON.stringify({
    type: 'message',
    fromUserId,
    content,
    timestamp: Date.now()
  }));

  log(`Melding sendt fra ${fromUserId} til ${toUserId}`);
}

// Håndter ping
function handlePing(data, ws) {
  const { userId } = data;
  const userConnection = getUserConnection(userId);

  if (!userConnection) {
    ws.send(JSON.stringify({
      type: 'error',
      error: 'not_authenticated'
    }));
    return;
  }

  userConnection.lastSeen = Date.now();
  userConnection.isAlive = true;

  ws.send(JSON.stringify({
    type: 'pong',
    timestamp: Date.now()
  }));
}

// Håndter brukerforespørsel
function handleGetUsers(data, ws) {
  const { userId } = data;
  const userConnection = getUserConnection(userId);

  if (!userConnection) {
    ws.send(JSON.stringify({
      type: 'error',
      error: 'not_authenticated'
    }));
    return;
  }

  const activeUsers = Array.from(users.keys())
    .filter(id => id !== userId && users.get(id).isAlive)
    .map(id => ({
      userId: id,
      lastSeen: users.get(id).lastSeen
    }));

  ws.send(JSON.stringify({
    type: 'users_list',
    users: activeUsers,
    timestamp: Date.now()
  }));
}

// Send en melding til alle tilkoblede brukere (bortsett fra avsender)
function broadcast(message, excludeUserId = null) {
  users.forEach((userConnection, userId) => {
    if (userId !== excludeUserId && userConnection.ws && userConnection.isAlive) {
      userConnection.ws.send(JSON.stringify({
        ...message,
        broadcast: true,
        timestamp: Date.now()
      }));
    }
  });
}

// Forbindelses-timeout håndtering
function heartbeat(userId) {
  const userConnection = getUserConnection(userId);

  if (!userConnection) return;

  userConnection.isAlive = false;

  userConnection.ws.ping();

  userConnection.pingTimeout = setTimeout(() => {
    if (!userConnection.isAlive) {
      log(`Bruker ${userId} svarte ikke på ping, lukker tilkobling`);
      userConnection.ws.terminate();
      removeUser(userId);
    }
  }, PING_TIMEOUT);
}

// Sett opp hendelseslyttere for serveren
wss.on('connection', (ws) => {
  log('Ny tilkobling etablert');
  let userId = null;

  // Sett opp hendelseslyttere for tilkoblingen
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // Oppdater bruker-ID hvis det er en auth-melding
      if (data.type === 'auth' && data.userId) {
        userId = data.userId;
      }

      handleMessage(message, ws);
    } catch (err) {
      log(`Feil ved behandling av melding: ${err.message}`);
      ws.send(JSON.stringify({
        type: 'error',
        error: 'invalid_message',
        details: err.message
      }));
    }
  });

  ws.on('close', () => {
    log('Tilkobling lukket');

    if (userId) {
      removeUser(userId);
    }
  });

  ws.on('error', (error) => {
    log(`WebSocket-feil: ${error.message}`);

    if (userId) {
      removeUser(userId);
    }
  });

  ws.on('pong', () => {
    if (userId) {
      const userConnection = getUserConnection(userId);
      if (userConnection) {
        userConnection.isAlive = true;
      }
    }
  });

  // Sett tilkoblingstimeout
  setTimeout(() => {
    if (!userId) {
      log('Tilkobling lukket på grunn av manglende autentisering');
      ws.close(1000, 'Authentication timeout');
    }
  }, CONNECTION_TIMEOUT);
});

// Start hjerteslag for alle tilkoblinger
setInterval(() => {
  users.forEach((userConnection, userId) => {
    heartbeat(userId);
  });
}, PING_INTERVAL);

// Start serveren
server.listen(PORT, () => {
  log(`MCP Signalering Server kjører på port ${PORT}`);
});
