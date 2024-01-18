const WebSocket = require('ws');

class WebSocketClient {
	constructor(url) {
		this.ws = new WebSocket(url);

		this.ws.on('open', function open() {
			console.log('Connected to the server');
		});

		this.ws.on('message', function incoming(data) {
			try {
				console.log('Received:', JSON.parse(data.toString()));
			} catch (e) {
				console.log(e);
			}
		});

		this.ws.on('close', function close() {
			console.log('Disconnected from the server');
		});
	}

	sendMessage(type, data = {}) {
		const message = JSON.stringify({ type, ...data });
		this.ws.send(message);
	}

	createSession(nickname) {
		this.sendMessage('create_session', { nickname });
	}

	joinSession(nickname, sessionId) {
		this.sendMessage('join_session', { nickname, sessionId });
	}

	getSessions() {
		this.sendMessage('get_sessions');
	}

	setReady() {
		this.sendMessage('set_ready');
	}

	changeSide() {
		this.sendMessage('change_side');
	}

	startGame() {
		this.sendMessage('start_game');
	}

	leaveSession() {
		this.sendMessage('leave_session');
	}

	setLoaded() {
		this.sendMessage('set_loaded');
	}

	sendMessageToSession(message) {
		this.sendMessage('message', { message });
	}
}

module.exports = {
	WebSocketClient,
	c: new WebSocketClient('ws://localhost:3040'),
};
