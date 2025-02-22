const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const clients = new Map();

const initializeWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws, req) => {
    try {
      const token = req.url.split('=')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      clients.set(decoded.userId, ws);

      ws.on('close', () => {
        clients.delete(decoded.userId);
      });
    } catch (error) {
      ws.terminate();
    }
  });

  return {
    sendMessage: (userId, message) => {
      const client = clients.get(userId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    }
  };
};

module.exports = { initializeWebSocket };