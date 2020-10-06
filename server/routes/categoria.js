const express =require('express');

let {verificaToken,verificaAdmin_Role}=require('../middlewares/autenticacion');

let app=express();

let Categoria = require('../models/categoria');
//=============================
// Mostrar todas las categorias
//=============================
app.get('/categoria',verificaToken,(req,res)=>{
//Parametros opcionales /usuario?desde=10&limite=5
let desde=req.query.desde||0;
desde=Number(desde);
let limite=req.query.limite||5
limite=Number(limite)
Categoria.find({})
       .sort('descripcion')
       .populate('usuario','nombre email')//Si quiero toda la info no pongo el segundo argumento
       .skip(desde)
       .limit(limite)
       .exec((err,categorias)=>{
            if (err) {
                return res.status(400).json({
                ok: false,
                err
                });
            }
        //Este conteo no es del todo cierto pues cuenta todos mas no los que regresa arriba.
            Categoria.countDocuments((err,conteo)=>{
                res.json({
                ok: true,
                categorias,
                cuantos:conteo
                });
            })
       })
});
//=============================
// Mostrar una categoria por ID
//=============================
app.get('/categoria/:id',verificaToken,(req,res)=>{
    let id=req.params.id;
    Categoria.findById(id,(err,categoria)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    categoria
                });
             });
});
//=============================
// Crear nueva categoria
//=============================
app.post('/categoria',verificaToken,(req,res)=>{
    let body=req.body;
    let categoria=new Categoria({
        descripcion:body.descripcion,
        usuario:req.usuario._id
    });
    categoria.save((err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        });
    });
});

//=============================
// Actualizar categorias
//=============================
app.put('/categoria/:id',verificaToken,(req,res)=>{
    let id=req.params.id;
    let body=req.body;
    let descCategoria={
        descripcion:body.descripcion
    }
    Categoria.findByIdAndUpdate(id,descCategoria,{new:true,runValidators:true},(err,categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"Ha ocurrido un error"
                }
            });
        }
        res.json({ok:true,categoria:categoriaDB});
    });
});

//=============================
// Borrar categoria
//=============================

app.delete('/categoria/:id',[verificaToken,verificaAdmin_Role],(req,res)=>{
    let id=req.params.id;
    Categoria.findByIdAndRemove(id,(err,categoriaBorrada)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaBorrada){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"Categoria no encontrada"
                }
            });
        }
        res.json({
            ok:true,
            message:"Categoria Borrada",
            categoria:categoriaBorrada
        });
    });
});

module.exports=app;