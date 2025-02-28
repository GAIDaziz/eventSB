// controllers/eventController.js

let pool = require ("../db.js");
const user = require("../models/userModel.js");

// Création d'un événement
const createEvent = async (req, res) => {
  if (!req.file) {
    
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageData = req.file.buffer;//buffer l'image ygasamha

  const { title, date , description,  location } = req.body;
  if (!title || !date || !description ||  !location  ) {

    return res.status(400).json({ error: "Tous les champs sont requis" });
  }else{
 /*   if(!categories.includes(Categories)){
      return res.status(400).json({ error: "La category n'existe pas" });
    }
*/
  }
  const event = {
    title,
    date,
    description,
    location,
    user_id:req.user.id,
  };
  console.log(event);
  // SQL Query: Match placeholders and values
  const sql = `
  INSERT INTO events (id, title, description, date, location, img, user_id) 
  VALUES (?, ?, ?, ?, ?, ?, ?)`;

  console.log(event.date);
  // Adjust the values array to match the placeholders
  const values = [
    null, // Auto-increment ID
    event.title,
    event.description,
    event.date,
    event.location,
    imageData,
    event.user_id
  ];

  console.log(values);

  try {
    const [result] = await pool.execute(sql, values);
    console.log(values);
    console.log("Data Inserted:", result);
    res.status(201).json({ message: "Event created successfully", eventId: result.insertId });
  } catch (error) {
    console.error("Error Inserting Data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Liste des événements
const getEvents = async (req, res) => {
    const { date } = req.query;
    const sql = "SELECT * FROM events";
    const values = [];
    
    if (date) {
      sql += " AND DATE(date) = ?";
      values.push(date);
    }
   /* if (req.user) { 
      sql += " WHERE user_id = ?";
      values.push(req.user.id);
    }
// Filtrer par date si nécessaire

      if (date) {
        sql += req.user ? " AND" : " WHERE"; // Ajuster WHERE/AND en fonction de la présence de user_id
        sql += " DATE(date) = ?";
        values.push(date);
    }
  }*/


    try {
      const [rows] = await pool.execute(sql, values);
      res.json(rows);
    } catch (error) {
      console.error("Error Fetching Events:", error);
      res.status(500).json({ error: "Internal Server Error" });
 }
};


const getImage = async (req, res) => {
  try {
      const [rows] = await pool.execute("SELECT img FROM events WHERE id = ?", [req.params.id]); // Paramétrisation de la requête
      if (rows.length === 0) {
          return res.status(404).send("Image not found"); // Gestion du cas où l'image n'existe pas
      }

      res.setHeader("Content-Type", "image/jpeg||png"); // Définir le type de contenu (à ajuster si nécessaire)
      res.send(rows[0].img);
  } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  createEvent,
  getEvents,
  getImage
};
