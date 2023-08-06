const express = require("express");
const salonSchema = require("../models/salon");
const horarioSchema = require("../models/horario");
const router = express.Router();


router.get("/salones", (req, res) => {
  salonSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});


router.get("/horarios", (req, res) => {
  horarioSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
