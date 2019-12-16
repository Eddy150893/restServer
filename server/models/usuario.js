const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"]
  },
  emai: {
    type: String,
    unique: true,
    require: [true, "El correo es necesarios"]
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"]
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: "USER_ROLE"
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});
usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });
module.exports = mongoose.model("Usuario", usuarioSchema);
