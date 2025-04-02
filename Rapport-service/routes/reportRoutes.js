const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const Project = require("../../projets-service/model/Project");
const Task = require("../../Tache-service/model/tachemodel");

const router = express.Router();

router.get("/generate-report", async (req, res) => {
    try {
        const projects = await Project.find();
        const tasks = await Task.find();

        const doc = new PDFDocument();
        const filePath = "project_report.pdf";
        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(20).text("Rapport des Projets", { align: "center" });
        doc.moveDown();

        projects.forEach((project, index) => {
            doc.fontSize(16).text(`Projet ${index + 1}: ${project.name}`, { underline: true });
            doc.text(`Description: ${project.description}`);
            doc.text(`Statut: ${project.status}`);
            doc.moveDown();
        });

        doc.end();
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/stats", async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const taskStats = await Task.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.json({ totalProjects, taskStats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
