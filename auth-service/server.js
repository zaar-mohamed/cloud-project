require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");

const app = express();


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Démarrer le serveur
app.listen(process.env.PORT || 3000, () => console.log(`Server running`));
