const express =require('express');

let {verificaToken,verificaAdmin_Role}=require('../middlewares/autenticacion');

let app=express();

let Producto = require('../models/producto');
//=============================
// Mostrar todas las productos
//=============================
app.get('/producto',verificaToken,(req,res)=>{
//Parametros opcionales /usuario?desde=10&limite=5
let desde=req.query.desde||0;
desde=Number(desde);
let limite=req.query.limite||10
limite=Number(limite)
Producto.find({disponible:true})
       .populate('usuario','nombre email')
       .populate('categoria', 'descripcion')
       .sort('nombre')
       .skip(desde)
       .limit(limite)
       .exec((err,productos)=>{
            if (err) {
                return res.status(400).json({
                ok: false,
                err
                });
            }
        //Este conteo no es del todo cierto pues cuenta todos mas no los que regresa arriba.
            Producto.countDocuments((err,conteo)=>{
                res.json({
                ok: true,
                productos,
                cuantos:conteo
                });
            })
       })
});
//=============================
// Mostrar una producto por ID
//=============================
app.get('/producto/:id',verificaToken,(req,res)=>{
    let id=req.params.id;
    Producto.findById(id)
            .populate('usuario','nombre email')
            .populate('categoria', 'descripcion')
            .exec((err,producto)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    producto
                });
             });
});

//=============================
// Buscar productos
//=============================
app.get('/producto/buscar/:termino',verificaToken,(req,res)=>{
    let termino=req.params.termino;
    let regex=new RegExp(termino,'i');
    Producto.find({nombre:regex})
            .populate('usuario','nombre email')
            .populate('categoria', 'descripcion')
            .exec((err,productos)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    productos
                });
             });
});
//=============================
// Crear nueva producto
//=============================
app.post('/producto',verificaToken,(req,res)=>{
    let body=req.body;
    let producto=new Producto({
        nombre:body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        disponible:body.disponible,
        categoria:body.categoria,
        usuario:req.usuario._id
    });
    producto.save((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.status(201).json({
            ok:true,
            producto:productoDB
        });
    });
});

//=============================
// Actualizar productos
//=============================
app.put('/producto/:id',verificaToken,(req,res)=>{
    let id=req.params.id;
    let body=req.body;
    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"El id no existe"
                }
            });
        }

        productoDB.nombre=body.nombre||productoDB.nombre;
        productoDB.precioUni=body.precioUni||productoDB.precioUni;
        productoDB.categoria=body.categoria||productoDB.categoria;
        productoDB.descripcion=body.descripcion||productoDB.descripcion;
        productoDB.disponible=body.disponible||productoDB.disponible;

        productoDB.save((err,productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                producto:productoGuardado
            });
        });
    });
});

//=============================
// Borrar producto
//=============================

app.delete('/producto/:id',[verificaToken,verificaAdmin_Role],(req,res)=>{
    let id=req.params.id;
    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"ID no existe"
                }
            })
        }
        productoDB.disponible=false;
        productoDB.save((err,productoBorrado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                productoBorrado,
                message:"Producto Borrado"
            })   
        })
    });
});

module.exports=app;