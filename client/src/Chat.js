import React, { useEffect, useState } from 'react';
import ScroolToBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room }) {
	const [currentMessage, setCurrentMessage] = useState('');
	const [messageList, setMessageList] = useState([]);

	const sendMessage = async () => {
		if (currentMessage !== '') {
			const messageData = {
				room: room,
				author: username,
				message: currentMessage,
				time:
					new Date(Date.now()).getHours() +
					':' +
					new Date(Date.now()).getMinutes(),
			};

			await socket.emit('send_message', messageData);
			setMessageList((list) => [...list, messageData]);
			setCurrentMessage('');
		}
	};

	useEffect(() => {
		socket.on('receive_message', (data) => {
			setMessageList((list) => [...list, data]);
		});
	}, [socket]);

	return (
		<div className="chat-window">
			<div className="chat-header">
				<p>Live Chat</p>
			</div>
			<div className="chat-body">
				<ScroolToBottom className="message-container">
					{messageList.map((messageContent) => {
						return (
							<div
								className="message"
								id={username === messageContent.author ? 'other' : 'you'}
							>
								<div>
									<div className="message-content">
										<p>{messageContent.message}</p>
									</div>
									<div className="message-meta">
										<p id="time">{messageContent.time}</p>
										<p id="author">{messageContent.author}</p>
									</div>
								</div>
							</div>
						);
					})}
				</ScroolToBottom>
			</div>
			<div className="chat-footer">
				<input
					type="text"
					value={currentMessage}
					className="afadf"
					placeholder="Hey...."
					onChange={(e) => {
						setCurrentMessage(e.target.value);
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							sendMessage();
						}
					}}
				/>
				<button onClick={sendMessage}>&#9658;</button>
			</div>
		</div>
	);
}

export default Chat;
