const jwt = require("jsonwebtoken");

const protect = (role = null) => {
  return (req, res, next) => {
    console.log(req.header("Authorization"));
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Accès refusé, aucun jeton fourni" });
    }

    try {
      const verified = jwt.verify(token, "secretkey"); // 🔒 Pense à sécuriser cette clé dans .env
      
      req.user = verified; // Ajoute l'utilisateur à la requête
      console.log("Utilisateur authentifié :", req.user);
      // Vérifier le rôle si nécessaire
      console.log(req.user.role);
      if (role && !role.includes(req.user.role)) {
        return res.status(403).json({ error: "Accès refusé, rôle insuffisant" });
      }

      next(); // Passe à la prochaine étape
    } catch (err) {
      res.status(400).json({ error: "Jeton invalide" });
    }
  };
};

module.exports = { protect };
