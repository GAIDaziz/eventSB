

const jwt = require("jsonwebtoken");
const admin = require("../models/adminModel");

// Middleware de vérification du rôle ADMIN
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Accès refusé, rôle non autorisé" });
  }
};

// Fonction de validation des emails
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Fonction de validation des rôles
const isValidRole = (role) => ["admin", "user"].includes(role);

// 📌 Obtenir tous les utilisateurs avec pagination
const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  console.log("j'envoie les try");
  try {
    
    const users = await admin.getAllUsers(limit, offset);
    res.json({ page, limit, users });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📌 Mettre à jour un utilisateur avec validations
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  if (role && !isValidRole(role)) {
    return res.status(400).json({ error: "Rôle invalide" });
  }

  try {
    const updatedUser = await admin.updateUser(id, name, email, role);
    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur mis à jour avec succès", user: updatedUser });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📌 Supprimer un utilisateur définitivement
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const success = await  admin.deleteUser(id);
    if (!success) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📌 Obtenir les statistiques du tableau de bord
const getDashboardStats = async (req, res) => {
  try {
    const stats = await admin.getDashboardStats();
    res.json({ message: "Statistiques du tableau de bord", stats });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Exportation des fonctions
module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getDashboardStats,
  isAdmin,
};
