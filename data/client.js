class Client {
	constructor(ws, nickname) {
		this.ws = ws;
		this.nickname = nickname;
		this.isReady = false;
		this.sessionId = null;
		this.isLoaded = false;
	}
}

module.exports = Client;
