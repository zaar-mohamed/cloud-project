const express = require('express');
const mongoose = require('mongoose');
const Project = require('./models/Project'); 
const PORT = process.env.PORT || 3000;


app.use(express.json());

mongoose.connect('mongodb://localhost:27017/projectDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.log('Erreur de connexion à MongoDB:', err));

require('./routes/projectRoutes')(app); 

app.listen(PORT, () => {
  console.log(`Project-Service tourne sur le port ${PORT}`);
});
