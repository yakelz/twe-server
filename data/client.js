class Client {
	constructor(ws, nickname) {
		this.ws = ws;
		this.nickname = nickname;
		this.isReady = false;
		this.sessionId = null;
	}
}

module.exports = Client;
