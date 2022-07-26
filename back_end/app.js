require('dotenv').config()

const path=require('path')

const express = require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser')

const sequelize = require('./util/database');
const authRouter=require('./routes/auth.router')

const staticPath=path.join(__dirname,'..','fornt_end', 'views');
console.log(staticPath);
const app=express();

// //creating secret key...
// const  crypto=require('crypto')
// console.log("secret", crypto.randomBytes(64).toString('hex'))



app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.static(staticPath))

app.use(authRouter)



sequelize
    // .sync({alter:true})
    // .sync({forec:true})
    .sync()
    .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log("server running on poort 8000");
        });
    })
    .catch(err=>{console.log(err);})