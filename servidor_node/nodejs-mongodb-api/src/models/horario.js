const mongoose = require("mongoose");

const horarioSchema = mongoose.Schema({

  curso: {
    type: String
  },
  docente: {
    type: String
  },
  aula: {
    type: Number
  },
  pabellon: {
    type: String
  },
  fecha: {
    dia: {
      type: String
    },
    horaInicio: {
      type: String
    },
    horaFin: {
      type: String
    }
  },
});

module.exports = mongoose.model('horarios', horarioSchema);
