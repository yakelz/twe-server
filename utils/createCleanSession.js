function createCleanSession(session) {
	return {
		id: session.id,
		gameStarted: session.gameStarted,
		side: session.side,
		host: session.host
			? {
					nickname: session.host.nickname,
					isReady: session.host.isReady,
					isLoaded: session.host.isLoaded,
			  }
			: null,
		secondPlayer: session.secondPlayer
			? {
					nickname: session.secondPlayer.nickname,
					isReady: session.secondPlayer.isReady,
					isLoaded: session.secondPlayer.isLoaded,
			  }
			: null,
	};
}

module.exports = { createCleanSession };
