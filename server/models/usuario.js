const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;
let rolesValidos={
  values:['ADMIN_ROLE','USER_ROLE'],
  messager:'{VALUE} no es un rol valido'
};

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"]
  },
  email: {
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
    default: "USER_ROLE",
    enum:rolesValidos
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
//Esta es una modificacion a la funcion toJson del Schema
//para que cuando responda, responda sin el campo password
usuarioSchema.methods.toJSON=function(){
  let user=this;
  let userObject=user.toObject();
  delete userObject.password;
  return userObject;
}
usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });
module.exports = mongoose.model("Usuario", usuarioSchema);
