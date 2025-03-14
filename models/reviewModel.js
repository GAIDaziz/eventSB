const db = require("../db");

const Review = {
  async getAllReviews() {
    const sql = "SELECT * FROM reviews";
    const [rows] = await db.execute(sql);
    return rows;
  },

  async createReview(event_id, user_id, rating, comment) {
    const sql = "INSERT INTO reviews (event_id, user_id, rating, comment, date) VALUES (?, ?, ?, ?, ?)";
    const values = [event_id, user_id, rating, comment || "", new Date().toISOString()];
    const [result] = await db.execute(sql, values);

    return {
      id: result.insertId,
      event_id,
      user_id,
      rating,
      comment: comment || "",
      date: new Date().toISOString(),
    };
  },

  async getReviewById(id) {
    const sql = "SELECT * FROM reviews WHERE id = ?";
    const [rows] = await db.execute(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  async updateReview(id, rating, comment) {
    const existingReview = await this.getReviewById(id);
    if (!existingReview) return null;

    const sql = "UPDATE reviews SET rating = ?, comment = ?, date = ? WHERE id = ?";
    const updatedValues = [rating || existingReview.rating, comment || existingReview.comment, new Date().toISOString(), id];
    await db.execute(sql, updatedValues);

    return { ...existingReview, rating: rating || existingReview.rating, comment: comment || existingReview.comment, date: new Date().toISOString() };
  },

  async deleteReview(id) {
    const existingReview = await this.getReviewById(id);
    if (!existingReview) return null;

    const sql = "DELETE FROM reviews WHERE id = ?";
    await db.execute(sql, [id]);

    return existingReview;
  },
};

module.exports = Review;
