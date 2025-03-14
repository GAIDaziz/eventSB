const Review = require("../models/reviewModel");

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.getAllReviews();
    res.json(reviews);
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const createReview = async (req, res) => {
  const { event_id, user_id, rating, comment } = req.body;

  if (!event_id || !user_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Données invalides pour l'avis" });
  }

  try {
    const newReview = await Review.createReview(event_id, user_id, rating, comment);
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Erreur lors de la création de l'avis:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: "La note doit être comprise entre 1 et 5" });
  }

  try {
    const updatedReview = await Review.updateReview(id, rating, comment);
    if (!updatedReview) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }
    res.json(updatedReview);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avis:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.deleteReview(id);
    if (!deletedReview) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }
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
  deleteReview,
};
