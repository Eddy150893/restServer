require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json({ extended: false }));
//Configuracion global de rutas
app.use(require('./routes/index'));
//"mongodb://localhost:27017/cafe"
mongoose.connect(process.env.URLDB, 
                {useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true},
                  (err, res) => {
  if (err) throw err;
  console.log("Base de datos online");
});
app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto: ", process.env.PORT);
});
