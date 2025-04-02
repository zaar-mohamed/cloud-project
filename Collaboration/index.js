const express = require('express');
const http = require("http");
const socketIo = require('socket.io');
const mongoose = require('mongoose');
require("dotenv").config();
const { initializeSocket } = require('./socket/socket'); 
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server);

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/chatDB')
    .then(() => console.log('MongoDB connected To chatDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Initialiser Socket.IO
initializeSocket(server);

// Démarrer le serveur

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
