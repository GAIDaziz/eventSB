const db = require("../db");
const jwt = require("jsonwebtoken");

const admin = {
  async getAllUsers(limit, offset) {
    const sql = "SELECT * FROM users LIMIT ? OFFSET ?";
    const [users] = await db.query(sql, [limit, offset]);
    return users;
  },

  async getUserById(id) {
    const sql = "SELECT * FROM users WHERE id = ?";
    const [users] = await db.query(sql, [id]);
    return users.length > 0 ? users[0] : null;
  },

  async updateUser(id, name, email, role) {
    const existingUser = await this.getUserById(id);
    if (!existingUser) return null;

    const updatedName = name || existingUser.name;
    const updatedEmail = email || existingUser.email;
    const updatedRole = role || existingUser.role;

    const sql = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
    await db.query(sql, [updatedName, updatedEmail, updatedRole, id]);

    return { id, name: updatedName, email: updatedEmail, role: updatedRole };
  },

  async deleteUser(id) {
    const sql = "DELETE FROM users WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  },

  async getDashboardStats() {
    const [userCount] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [eventCount] = await db.query("SELECT COUNT(*) AS totalEvents FROM events");

    return {
      totalUsers: userCount[0].totalUsers,
      totalEvents: eventCount[0].totalEvents,
    };
  },
};

module.exports = admin;
