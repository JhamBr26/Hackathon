const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();
const allRoute = require("./routes/all");

// settings
const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
// middlewares
app.use(express.json());
app.use("/api", allRoute);

// routes
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

// mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

// server listening
app.listen(port, () => console.log("Server listening to", port));
