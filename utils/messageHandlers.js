function handleMessage(ws, data, sessionManager) {
	const message = JSON.parse(data);
	switch (message.type) {
		case 'create_session':
			const nickname = message.nickname;
			sessionManager.createSession(ws, nickname);
			break;

		case 'join_session':
			const joinNickname = message.nickname;
			const joinSessionId = message.sessionId;
			sessionManager.joinSession(ws, joinNickname, joinSessionId);
			break;

		case 'get_sessions':
			sessionManager.getSessions(ws);
			break;

		case 'set_ready':
			sessionManager.setReady(ws);
			break;

		case 'change_side':
			sessionManager.changeSide(ws);
			break;

		case 'start_game':
			sessionManager.startGame(ws);
			break;

		case 'leave_session':
			sessionManager.leaveSession(ws);
			break;

		case 'set_loaded':
			sessionManager.onClientLoad(ws);
			break;

		case 'client_in_game':
			sessionManager.isClientInGame(ws);
			break;

		case 'message':
			const messageData = message.message;
			sessionManager.sendMessage(ws, messageData);
			break;
	}
}

module.exports = {
	handleMessage,
};
