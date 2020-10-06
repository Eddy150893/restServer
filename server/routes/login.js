const express = require("express");
const app = express();
const Usuario = require("../models/usuario");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login',(req,res)=>{
    let body=req.body;
    console.log(body);
    Usuario.findOne({ email:body.email},(err,usuarioDB)=>{
        if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
        }

        if(!usuarioDB){
                return res.status(400).json({
                  ok: false,
                  err:{
                      message:'(Usuario) o contraseña incorrectos'
                  }
                });
        }

        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
                return res.status(400).json({
                  ok: false,
                  err:{
                      message:'Usuario o (contraseña) incorrectos'
                  }
                });
            
        }

        let token=jwt.sign({
            usuario:usuarioDB
        },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});
        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        })
    });
});
//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
       nombre: payload.name,
       email:payload.email,
       img:payload.picture,
       google:true
    }
  }
  
app.post('/google',async(req,res)=>{
    let token=req.body.idtoken;
    let googleUser=await verify(token)
                            .catch(()=>res.status(403));
    if(googleUser.statusCode===403){
        return res.status(403).json({
            ok:false,
            err:{
                message:'Token invalido'
            }
        });
    }
        
    
    
    Usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{
        if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
        }
        //Si el usuario ya existe en la bbdd
        if(usuarioDB){
            //Si el usuario se autentico pero no con Google
                if(usuarioDB.google===false){
                    return res.status(400).json({
                        ok: false,
                        err:{
                            message:'Debe de usar su autenticacion normal'
                        }
                      });     
                }else{
            //Si el usuario se autentico con google se le renueva el token
                    let token=jwt.sign({
                        usuario:usuarioDB
                    },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});
                    res.json({
                        ok:true,
                        usuario:usuarioDB,
                        token
                    });
                }
        }else{
            //Si el usuario no existe en nuestra base de datos
            let usuario=new Usuario();
            usuario.nombre=googleUser.nombre;
            usuario.email=googleUser.email;
            usuario.img=googleUser.img;
            usuario.google=true;
            usuario.password=':)';
            usuario.save((err,usuarioDB)=>{
                if (err) {
                    return res.status(500).json({
                      ok: false,
                      err
                    });
                }
                let token=jwt.sign({
                    usuario:usuarioDB
                },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});
                res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                });

            })
        }
    })
    // res.json({
    //     usuario:googleUser
    // })

})
module.exports = app;