const db = require("../db");

const Event = {
  async createEvent(title, date, description, location, img, userId) {
    const sql = `
      INSERT INTO events (title, description, date, location, img, user_id) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [title, description, date, location, img, userId];
    const [result] = await db.execute(sql, values);
    return result.insertId;
  },

  async getEvents(date) {
    let sql = "SELECT * FROM events";
    const values = [];

    if (date) {
      sql += " WHERE DATE(date) = ?";
      values.push(date);
    }

    const [rows] = await db.execute(sql, values);
    return rows;
  },

  async getImage(eventId) {
    const sql = "SELECT img FROM events WHERE id = ?";
    const [rows] = await db.execute(sql, [eventId]);
    return rows.length > 0 ? rows[0].img : null;
  },
};

module.exports = Event;
