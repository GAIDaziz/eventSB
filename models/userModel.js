const db = require("../db");
const bcrypt = require("bcryptjs");

const User = {
  async getUserByName(name) {
    const [rows] = await db.query("SELECT * FROM users WHERE name = ?", [name]);
    return rows;
  },

  async getUserByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows;
  },

  async createUser(name, email, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
  },
};

module.exports = User;
