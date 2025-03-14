const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis!" });
  }

  try {
    const userExistsByName = await User.getUserByName(name);
    if (userExistsByName.length > 0) {
      return res.status(400).json({ error: "Ce nom existe déjà!" });
    }

    const userExistsByEmail = await User.getUserByEmail(email);
    if (userExistsByEmail.length > 0) {
      return res.status(400).json({ error: "Cet email existe déjà!" });
    }

    await User.createUser(name, email, password);

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'enregistrement de l'utilisateur" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const users = await User.getUserByEmail(email);

    if (users.length === 0) {
      return res.status(400).json({ error: "Email incorrect" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, username: user.name },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({ message: "Connexion réussie", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

module.exports = { registerUser, loginUser };
