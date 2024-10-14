import React, { useState, useEffect, useContext } from 'react';
import Modal from './Modal';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Chat.css';

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8081');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established');

      socket.send(
        JSON.stringify({
          type: 'join-room',
          room: roomId,
          userId: user._id,
        })
      );
    };

    socket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const messageData = JSON.parse(reader.result);
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: messageData.text, sender: messageData.sender },
            ]);
          } catch (error) {
            console.error('Error parsing Blob message as JSON:', error);
          }
        };
        reader.readAsText(event.data);
      } else {
        try {
          const messageData = JSON.parse(event.data);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: messageData.text, sender: messageData.sender },
          ]);
        } catch (error) {
          console.error('Error parsing text message as JSON:', error);
        }
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
      console.log('Disconnected client');
    };
  }, [user._id]);

  const sendMessage = () => {
    if (ws && input) {
      const messageData = JSON.stringify({
        type: 'chat-message',
        text: input,
        room: roomId,
        sender: user._id,
      });
      ws.send(messageData);
      setInput('');
    }
  };

  return (
    <div>
      <button className="open-chat" onClick={() => setIsModalOpen(true)}>
        Open Chat
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="chat-container">
          <div className="chat-header">
            <h2>Chat Room </h2>
          </div>
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-bubble ${
                  message.sender === user._id
                    ? 'message-sent'
                    : 'message-received'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
            />
            <button onClick={sendMessage} className="send-button">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
