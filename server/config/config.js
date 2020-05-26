//==============================
//Puerto
//==============================

process.env.PORT = process.env.PORT || 3000;

//=============================
//Entorno
//=============================
//process.env.NODE_ENV esta variable se define si el codigo esta en heroku de lo contrario entonces seteamos dev
process.env.NODE_ENV=process.env.NODE_ENV||'dev';

//=============================
//Base de datos
//=============================

let urlDB;
//Se ocultara la url de produccion
//utilizando seteo de variables de entorno en heroku
//si se quisiera ver el valor de la variable
//colocar en la terminal heroku config->solo servira para el usuario que tenga acceso al heroku
 if(process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/cafe';
}else{
    urlDB=process.env.MONGO_URI;
}

process.env.URLDB=urlDB

//=============================
//Vencimiento del Token
//=============================
//60 segungos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN=60*60*60*30;

//=============================
//SEED de autenticacion
//=============================
//En heroku se debe declarar este seed con un seteo de var. de config.
//heroku config:set SEED="cualquier valor"
process.env.SEED=process.env.SEED||'este-es-el-seed-desarrollo';