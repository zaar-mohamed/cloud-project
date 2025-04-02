const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const reportRoutes = require("./routes/reportRoutes");

const app = express();
app.use("/api/reports", reportRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connecté pour Report Service"))
    .catch(err => console.error(err));

app.listen(5002, () => console.log("Service Rapports sur le port 5002"));
