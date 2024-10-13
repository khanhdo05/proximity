import React, { useState, useEffect, useContext } from 'react';
import Modal from './Modal';
import { AuthContext } from '../contexts/AuthContext';

const Chat = () => {
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
    };

    socket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const messageData = JSON.parse(reader.result);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: messageData.text, sender: messageData.sender },
          ]);
        };
        reader.readAsText(event.data);
      } else {
        const messageData = JSON.parse(event.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: messageData.data, sender: messageData.sender },
        ]);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
      console.log('Disconnect client');
    };
  }, []);

  const sendMessage = () => {
    if (ws && input) {
      const messageData = JSON.stringify({
        text: input,
        sender: user._id, // or any unique user identifier
      });
      ws.send(messageData);
      setInput('');
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Chat</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="chat-container">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
                {message.sender === user._id ? ' (You)' : ''}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
