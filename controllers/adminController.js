const jwt = require("jsonwebtoken");
const pool = require("../db")
// Middleware de vérification du rôle ADMIN
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Continue l'exécution
  } else {
    res.status(403).json({ error: "Accès refusé tu n'a pas le bon role" }); // 403 = Forbidden
  }
};

// Fonction de validation des emails
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fonction de validation des rôles
const isValidRole = (role) => {
  const validRoles = ["admin", "user"];
  return validRoles.includes(role);
};

// 📌 Obtenir tous les utilisateurs avec pagination
const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page actuelle (défaut = 1)
  const limit = parseInt(req.query.limit) || 10; // Nombre d'éléments par page (défaut = 10)
  const offset = (page - 1) * limit;

  try {
  // console.log('avec corection sql')//probleme aux niveaxu du code sql
    const [users] = await pool.query("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);
    res.json({ page, limit, users });
    
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📌 Mettre à jour un utilisateur avec validations et mise à jour partielle
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (user.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Si email fourni, vérifier s'il est valide
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: "Email invalide" });
    }

    // Si rôle fourni, vérifier s'il est valide
    if (role && !isValidRole(role)) {
      return res.status(400).json({ error: "Rôle invalide" });
    }

    // Garde les anciennes valeurs si aucune mise à jour n'est fournie
    const updatedName = name || user[0].name;
    const updatedEmail = email || user[0].email;
    const updatedRole = role || user[0].role;

    // Mise à jour de l'utilisateur
    await pool.query("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", 
      [updatedName, updatedEmail, updatedRole, id]);

    res.json({ message: "Utilisateur mis à jour avec succès" });

  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📌 Supprimer un utilisateur définitivement
const deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    console.log("test le sql");
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
      
    }
    console.log("test le sql");

    res.json({ message: "Utilisateur supprimé avec succès" });

  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📌 Obtenir les statistiques du tableau de bord
const getDashboardStats = async (req, res) => {
  try {
    const [userCount] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [eventCount] = await pool.query("SELECT COUNT(*) AS totalEvents FROM events");
   

    res.json({
      message: "Statistiques du tableau de bord",
      stats: {
        totalUsers: userCount[0].totalUsers,
        totalEvents: eventCount[0].totalEvents,
        
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Exportation des fonctions pour utilisation dans les routes
module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getDashboardStats,
  isAdmin, // Permet de l'utiliser dans d'autres parties de l'app
};
