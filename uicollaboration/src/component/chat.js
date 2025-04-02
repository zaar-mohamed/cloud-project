import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Remplacez par votre URL de serveur

const Chat = ({ projectId }) => {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        console.log('Connecting to socket...');
        socket.on('connect', () => {
            console.log('Socket connected');
        });
    
        socket.on('new-message', (message) => {
            console.log('New message received:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    
        socket.emit('join-project', projectId);
    
        return () => {
            socket.off('new-message');
            socket.emit('leave-project', projectId);
        };
    }, [projectId]);

    const handleSendMessage = () => {
        if (content) {
            const messageData = { content, projectId };
            console.log('Sending message:', messageData);
            socket.emit('send-message', messageData);
            setContent('');
        }
    };

    return (
        <div>
            <h2>Chat pour le Projet {projectId}</h2>
            <div style={{ border: '1px solid black', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender.username}: </strong>
                        {msg.content}
                    </div>
                ))}
            </div>
            <input type="text" style={{outline:"2px yellow",padding:"10px",margin:"5px",border:"2px solid lightblue",borderRadius:"5px"}} value={content} onChange={(e) => setContent(e.target.value)}placeholder="Écrivez votre message..." />
            <button onClick={handleSendMessage} style={{backgroundColor:'greenyellow',padding:"10px",borderRadius:"5px",border:"none",cursor:"pointer"}}>Envoyer</button>
        </div>
    );
};

export default Chat;
