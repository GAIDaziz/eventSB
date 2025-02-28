const express = require("express");
const { protect } = require("../middleware/auth");
const { getAllUsers, updateUser, deleteUser, getDashboardStats } = require("../controllers/adminController");

const router = express.Router();

// Toutes les routes admin doivent passer par protect("admin")
router.get("/getUser", protect("admin"), getAllUsers);
router.put("/updateUser/:id", protect("admin"), updateUser);
router.delete("/deleteUser/:id", protect("admin"), deleteUser);
router.get("/dashboard", protect("admin"), getDashboardStats);

module.exports = router;
