const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoute");

router.use("/user", userRoutes);

module.exports = router;



