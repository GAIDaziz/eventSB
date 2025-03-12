const pool = require("../db.js");  // Connexion à la base de données MySQL
const user = require("../models/userModel.js");
const event = require("../models/eventModel.js");

// Obtenir tous les avis
const getAllReviews = async (req, res) => {
  const sql = "SELECT * FROM reviews";
  try {
    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
  
};

// Créer un nouvel avis
const createReview = async (req, res) => {
  const { event_id, user_id, rating, comment } = req.body;

  if (!event_id || !user_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Données invalides pour l'avis" });
  }

  const sql = "INSERT INTO reviews (event_id, user_id, rating, comment, date) VALUES (?, ?, ?, ?, ?)";
  const values = [event_id, user_id, rating, comment || "", new Date().toISOString()];

  try {
    const [result] = await pool.execute(sql, values);
    const newReview = {
      id: result.insertId,
      event_id,
      user_id,
      rating,
      comment: comment || "",
      date: new Date().toISOString(),
    };
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Erreur lors de la création de l'avis:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Mettre à jour un avis
const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const sql = "SELECT * FROM reviews WHERE id = ?";
  try {
    const [rows] = await pool.execute(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "La note doit être comprise entre 1 et 5" });
    }

    const updateSql = "UPDATE reviews SET rating = ?, comment = ?, date = ? WHERE id = ?";
    const updateValues = [rating || rows[0].rating, comment || rows[0].comment, new Date().toISOString(), id];

    await pool.execute(updateSql, updateValues);

    const updatedReview = { ...rows[0], rating: rating || rows[0].rating, comment: comment || rows[0].comment, date: new Date().toISOString() };
    res.json(updatedReview);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avis:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Supprimer un avis
const deleteReview = async (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM reviews WHERE id = ?";
  try {
    const [rows] = await pool.execute(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }

    const deleteSql = "DELETE FROM reviews WHERE id = ?";
    await pool.execute(deleteSql, [id]);

    res.json({ message: "Avis supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'avis:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

module.exports = {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview
};
