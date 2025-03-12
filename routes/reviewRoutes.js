const express = require("express");
const { getAllReviews, createReview, updateReview, deleteReview  } = require("../controllers/reviewController");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Routes pour les avis
router.get("/", getAllReviews );     // Obtenir tous les avis
router.post("/", createReview , protect);     // Ajouter un nouvel avis
router.put("/:id", updateReview);     // Mettre à jour un avis
router.delete("/:id", deleteReview);  // Supprimer un avis

module.exports = router;