const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../model/MessageModel');
const axios = require('axios');
require("dotenv").config({ path: "../.env" });

// Map pour stocker les connexions utilisateur
const userConnections = new Map();

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Middleware d'authentification pour Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    
      jwt.verify(token, process.env.jwtSecret,(error,user)=>{
        if(error){
          return next(new Error('Authentication error: Invalid token'));
        }
        socket.user = user;
        next()
      });
    });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    // Ajouter l'utilisateur à la liste des connexions
    userConnections.set(socket.user.id, socket.id);

    // Rejoindre les salles de projet sans vérifier l'accès
    socket.on('join-project', (projectId) => {
      console.log(`User ${socket.user.id} joined project room ${projectId}`);
      socket.join(`project-${projectId}`);
    });

    // Quitter la salle d'un projet
    socket.on('leave-project', (projectId) => {
      console.log(`User ${socket.user.id} left project room ${projectId}`);
      socket.leave(`project-${projectId}`);
    });

    // Envoyer un message
    socket.on('send-message', async (data) => {
      try {
        // Créer et sauvegarder le message
        const message = new Message({
          content: data.content,
          projectId: data.projectId,
          sender: socket.user.id
        });

        await message.save();

        // Récupérer les détails de l'utilisateur
        const senderDetails = await getUserDetails(socket.user.id);

        // Envoyer le message à tous les membres du projet
        io.to(`project-${data.projectId}`).emit('new-message', {
          ...message.toObject(),
          sender: senderDetails
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
      }
    });

    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
      userConnections.delete(socket.user.id);
    });
  });

  return io;
};

// Récupérer les détails de l'utilisateur
const getUserDetails = async (userId) => {
  try {
    // Appel au service d'authentification pour récupérer les détails de l'utilisateur
    const response = await axios.get(`${process.env.authServiceUrl}/api/auth/users/${userId}`);

    return response.data.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return { id: userId, username: 'Unknown User' };
  }
};

module.exports = {
  initializeSocket
};