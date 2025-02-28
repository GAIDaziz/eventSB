const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel"); // Assuming this is the correct path
const db = require("../db");

// Registration
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis!" });
  }

  try {
    const [userExistsByName] = await db.query("SELECT * FROM users WHERE name = ?", [name]);

    if (userExistsByName.length > 0) {
      return res.status(400).json({ error: "Ce nom existe déjà!" });
    }

    const [userExistsByEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (userExistsByEmail.length > 0) {
      return res.status(400).json({ error: "Cet email existe déjà!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query("INSERT INTO users (name, email, password) VALUES(?, ?, ?)", [name, email, hashedPassword]);

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ error: "Erreur lors de l'enregistrement de l'utilisateur" });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(400).json({ error: "Email incorrect" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },//on a rajouter userrole pour la generation de tokken
      process.env.JWT_SECRET || "secretkey", // Use a strong random secret here
      { expiresIn: "1h" }
    );

    res.json({ message: "Connexion réussie", token });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};