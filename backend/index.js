const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db");
const mainRoutes = require("./routes/index");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectDB();

app.use("/api/v1", mainRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the server.");
});








