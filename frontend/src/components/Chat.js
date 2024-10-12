import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8081');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
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
      ws.send(input);
      setInput('');
    }
  };

  // TODO: no button to open
  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Chat</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div>
          <div>
            {messages.map((message, index) => (
              <div key={index}>{message}</div>
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
