const WebSocket = require('ws');
const SessionManager = require('./utils/sessionManager');
const { handleMessage } = require('./utils/messageHandlers');

const wss = new WebSocket.Server({ port: 3040 });
const sessionManager = new SessionManager();

wss.on('connection', (ws) => {
	console.log('Client connected');

	ws.on('message', (data) => {
		handleMessage(ws, data, sessionManager);
	});

	ws.on('close', () => {
		const client = sessionManager.clients.get(ws);
		if (!client) {
			console.log('Unknown client disconnected');
			return;
		}
		sessionManager.leaveSession(ws);
		console.log(`Client ${client.nickname} disconnected`);
	});
});

console.log('WebSocket server started');
