const express = require('express');
const mongoose = require('mongoose');

const PORT = 3001 || 3000;
app=express();


app.use(express.json());
app.use("/projets",require("./routes/projectRoutes"))

mongoose.connect('mongodb://localhost:27017/projectDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.log('Erreur de connexion à MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Project-Service tourne sur le port ${PORT}`);
});
