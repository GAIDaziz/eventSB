const Event = require("../models/eventModel");

const createEvent = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageData = req.file.buffer;

  const { title, date, description, location } = req.body;
  if (!title || !date || !description || !location) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const eventId = await Event.createEvent(title, date, description, location, imageData, req.user.id);
    res.status(201).json({ message: "Événement créé avec succès", eventId });
  } catch (error) {
    console.error("Erreur lors de l'insertion de l'événement:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const getEvents = async (req, res) => {
  const { date } = req.query;

  try {
    const events = await Event.getEvents(date);
    res.json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.getEventById(id);

    if (!event) {
      return res.status(404).json({ error: "Événement non trouvé" });
    }

    res.json(event);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const getImage = async (req, res) => {
  try {
    const image = await Event.getImage(req.params.id);

    if (!image) {
      return res.status(404).send("Image non trouvée");
    }

    res.setHeader("Content-Type", "image/jpeg");
    res.send(image);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'image:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getImage,
};