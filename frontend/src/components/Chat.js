import React, { useState, useEffect, useContext } from 'react';
import Modal from './Modal';
import { AuthContext } from '../contexts/AuthContext';

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

      // Send a message to join a room when WebSocket is open
      socket.send(
        JSON.stringify({
          type: 'join-room',
          room: roomId,
          userId: user._id, // Sending unique user ID
        })
      );
    };

    socket.onmessage = (event) => {
      // Check if the data is a Blob (binary data)
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
        // Handle text-based WebSocket messages
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
        room: roomId, // Send message to the correct room
        sender: user._id,
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
