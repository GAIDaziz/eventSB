const multer = require("multer");//a regarder en raport avec l'image
const fs = require("fs");//meme chose en raport avec l'image
const express = require("express");
const { protect } = require("../middleware/auth");

const {createEvent,  getEvents, getImage, getEventById } = require("../controllers/eventController");

const router = express.Router();
const storage = multer.memoryStorage(); // Store in memory as Buffer
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), protect("admin.|.user"), createEvent);         // Création
router.get("/", getEvents);                    // Liste
router.get("/getImage/:id", getImage);
router.get("/:id", getEventById);

module.exports = router;