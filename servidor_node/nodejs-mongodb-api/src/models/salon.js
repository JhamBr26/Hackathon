const mongoose = require("mongoose");

const salonesSchema = mongoose.Schema({

  pabellon: {
    type: String,
  },
  piso: {
    type: Number,
  },
  tipo: {
    type: String
  },
  numero: {
    type: Number
  }
});

module.exports = mongoose.model('salones', salonesSchema);
