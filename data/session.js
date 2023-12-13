class Session {
	constructor(id) {
		this.id = id;
		this.gameStarted = false;
		this.side = true;
		this.host = null;
		this.secondPlayer = null;
	}
}

module.exports = Session;
