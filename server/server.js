require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const path=require('path');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ extended: false }));
//Habiliar la carpeta publica
app.use(express.static(path.resolve(__dirname,'../public')));

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
