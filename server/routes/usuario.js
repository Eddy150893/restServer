const express = require("express");
const app = express();
const Usuario = require("../models/usuario");
const bcrypt=require('bcrypt');
const _ = require('underscore');
const {verificaToken,verificaAdmin_Role}=require('../middlewares/autenticacion');

app.get("/usuario",verificaToken,(req, res)=>{

  //Parametros opcionales /usuario?desde=10&limite=5
  let desde=req.query.desde||0;
  desde=Number(desde);
  let limite=req.query.limite||5
  limite=Number(limite)
  //Metodo de mongose que trae los registros
  //por medio de su consulta find 
  //y ejecuta dicha consulta
  //como opcion se pueden poner el numero de registros que se quiere limit, desde donde comienza skip
  //y el limite con limit de igual manera si solo se requiere regresar ciertos campos se puede 
  //hacer pasando los nombres de los campos en el segundo argumento de find el primer argumento
  //es un objeto con los campos que seran utilizados como filtro en este caso estado
  Usuario.find({estado:true},'nombre email role estado google img')
         .skip(desde)
         .limit(limite)
         .exec((err,usuarios)=>{
          if (err) {
            return res.status(400).json({
              ok: false,
              err
            });
          }
          //Este conteo no es del todo cierto pues cuenta todos mas no los que regresa arriba.
          Usuario.countDocuments({estado:true},(err,conteo)=>{
            res.json({
              ok: true,
              usuarios,
              cuantos:conteo
            });
          })
         })
});

app.post("/usuario",[verificaToken,verificaAdmin_Role],function(req, res){
  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password:bcrypt.hashSync(body.password,10),
    role: body.role
  });
  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    
    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});

app.put("/usuario/:id",[verificaToken,verificaAdmin_Role], function(req, res) {
  let id = req.params.id;
  //la funcion pick del underscore indica que campos son validados para la actualizacion.
  let body=_.pick(req.body,['nombre','email','img','role','estado']);
//id: Encuentra el usuario por el id, 
//body: Actualiza el usuario con los datos del body
//{new:true,runValidators:true}(opciones): opcion que hace que devuelva el objeto actualizado y que respete las validaciones validator
//callback(): funcion que se procesa con la salida de la funcion padre findByIdAndUpdate
  Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioDB)=>{
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({ ok:true,usuario:usuarioDB });
  });
});

// app.delete("/usuario/:id", function(req, res) {
//   let id=req.params.id;
//   Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
//     if (err) {
//       return res.status(400).json({
//         ok: false,
//         err
//       });
//     }
//     if(!usuarioBorrado){
//       return res.status(400).json({
//         ok: false,
//         err:{
//           message:"Usuario no encontrado"
//         }
//       });
//     }
//     res.json({
//       ok:true,
//       usuario:usuarioBorrado
//     })
//   })
// });


app.delete("/usuario/:id",[verificaToken,verificaAdmin_Role], function(req, res) {
  let id=req.params.id;
  let cambiaEstado={estado:false}
   Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true},(err,usuarioDB)=>{
     if (err) {
       return res.status(400).json({
         ok: false,
         err
       });
     }
    if(!usuarioDB){
      return res.status(400).json({
        ok: false,
        err:{
          message:"Usuario no encontrado"
        }
      });
    }
     res.json({ ok:true,usuario:usuarioDB });
   });
});
module.exports = app;
