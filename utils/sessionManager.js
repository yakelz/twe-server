const Session = require('../data/session');
const Client = require('../data/client');
const WebSocket = require('ws');
const { broadcastMessage } = require('./broadcastMessage');
const { v4: uuidv4 } = require('uuid');

class SessionManager {
	constructor() {
		this.sessions = new Map();
		this.clients = new Map();
	}

	createSession(ws, nickname) {
		if (this.clients.has(ws)) {
			// Ошибка, Клиент уже в какой-то сессии
			return;
		}
		const sessionId = uuidv4();
		const client = new Client(ws, nickname);
		const newSession = new Session(sessionId);
		newSession.host = client;
		client.nickname = nickname;
		client.sessionId = sessionId;
		client.isReady = false;

		this.sessions.set(sessionId, newSession);
		this.clients.set(ws, client);
		console.log('session_created: ' + sessionId);

		ws.send(JSON.stringify({ type: 'session_created', session: newSession }));
	}

	joinSession(ws, nickname, sessionId) {
		if (this.clients.has(ws)) {
			// Ошибка, Клиент уже в какой-то сессии
			return;
		}
		console.log(sessionId);
		if (!this.sessions.has(sessionId)) {
			ws.send(JSON.stringify({ type: 'error', message: 'Session not found' }));
			return;
		}

		const client = new Client(ws, nickname);
		const session = this.sessions.get(sessionId);
		session.secondPlayer = client;

		client.sessionId = sessionId;
		client.isReady = false;

		this.clients.set(ws, client);

		console.log(nickname + ' joined to ' + sessionId);

		ws.send(JSON.stringify({ type: 'session_joined', session: session }));
		broadcastMessage(sessionId, JSON.stringify({ type: 'player_joined', session: session }), ws);
	}

	startGame(ws) {
		const client = this.clients.get(ws);

		if (!client) {
			return;
		}

		const session = this.sessions.get(client.sessionId);

		if (client == session.host) {
			session.gameStarted = true;
			this.onSessionChange(client.sessionId, ws);
		}
		console.log(client.nickname + ' started the game');
	}

	changeSide(ws) {
		const client = this.clients.get(ws);

		if (!client) {
			return;
		}
		const session = this.sessions.get(client.sessionId);

		if (client == session.host) {
			console.log('inside');
			session.side = !session.side;
			this.onSessionChange(client.sessionId, ws);
		}
	}

	onSessionChange(sessionId, ws) {
		const session = this.sessions.get(sessionId);
		if (session) {
			const sessionData = JSON.stringify({ type: 'session_update', session: session });

			console.log(session);
			if (session.host && session.host.ws.readyState === WebSocket.OPEN) {
				session.host.ws.send(sessionData);
			}
			if (session.secondPlayer && session.secondPlayer.ws.readyState === WebSocket.OPEN) {
				session.secondPlayer.ws.send(sessionData);
			}
		}
	}

	setReady(ws) {
		const client = this.clients.get(ws);
		if (client) {
			client.isReady = !client.isReady;
			this.onSessionChange(client.sessionId, ws);
		}
	}

	getSessions(ws) {
		ws.send(
			JSON.stringify({
				type: 'session_list',
				sessions: Array.from(this.sessions.values()).map((session) => ({
					id: session.id,
					hostName: session.host ? session.host.nickname : null,
				})),
			})
		);
	}

	leaveSession(ws) {
		const client = this.clients.get(ws);
		if (!client) return;

		const sessionId = client.sessionId;
		const session = this.sessions.get(sessionId);

		if (!session) {
			this.clients.delete(ws);
			return;
		}
		if (session) {
			broadcastMessage(session, JSON.stringify({ type: 'player_left' }), ws);

			// Если в сессии не осталось клиентов, удаляем её
			if (client == session.host || session.gameStarted) {
				this.sessions.delete(sessionId);
				return;
			}

			this.sessions.secondPlayer = null;
			this.onSessionChange(sessionId, ws);
		}

		this.clients.delete(ws);
	}

	sendMessage(ws, messageIn) {
		const client = this.clients.get(ws);
		if (!client || !client.sessionId) return;

		const session = this.sessions.get(client.sessionId);
		if (!session) return;

		const messageData = JSON.stringify({ type: 'message', message: messageIn });
		console.log('message from ' + client.nickname);
		console.log(messageIn);
		broadcastMessage(session, messageData, ws);
	}
}

module.exports = SessionManager;
