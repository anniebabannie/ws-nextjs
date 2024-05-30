"use client"
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const webSocket = new WebSocket('ws://localhost:3001/');

const Index = () => {
  
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Listen for incoming messages
    // socket.on('chat message', (message) => {
    //   setMessages((prevMessages) => [...prevMessages, message]);
    // });
    webSocket.onmessage = (event) => {
      console.log(event)
      setMessages((prevMessages) => [...prevMessages, event.data]);
      // document.getElementById('messages').innerHTML += 
      //   'Message from server: ' + event.data + "<br />";
    };
  }, []);

  const sendMessage = () => {
    webSocket.send(newMessage);
    // socket.emit('chat message', newMessage);
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