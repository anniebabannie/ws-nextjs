"use client"
import React, { useState, useEffect } from 'react';

const webSocket = new WebSocket('ws://localhost:3001/');

const Index = () => {
  
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    webSocket.onmessage = (event) => {
      console.log(event)
      if (event.data === "connection established") return;
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
  }, []);

  const sendMessage = () => {
    webSocket.send(newMessage);
    setNewMessage('');
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Index;