const express = require ('express') ;
const db =require ("./db")
const app = express();
const PORT = process.env.PORT || 3008;
const userRoute =require("./routes/userRoute");
const eventRoute = require("./routes/eventRoute");
const adminRoute = require("./routes/adminRoute");
const reviewRoutes = require("./routes/reviewRoutes");

app.use((req, res, next) => {
    // Autoriser uniquement le frontend sur localhost:5173
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    
    // Autoriser les méthodes HTTP que ton API accepte
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    // Autoriser certains en-têtes (notamment pour les requêtes avec JSON ou JWT)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Autoriser les cookies et l'authentification avec credentials
    res.header("Access-Control-Allow-Credentials", "true");

    // Gérer les requêtes "OPTIONS" (préflight request)
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);
app.use("/api/admin",adminRoute);
app.use("/api/reviews", reviewRoutes);






app.get('/' , (req, res) => {
    res.send ('hello aziz!') ;
});

app.listen(PORT,() => {
    console.log(`Serveur en ecoute sure le port ${PORT}`);
});



