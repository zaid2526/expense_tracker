const path=require('path')

const express = require('express');
const bodyParser=require('body-parser');

const sequelize = require('./util/database');
const authRouter=require('./routes/auth.router')

const staticPath=path.join(__dirname,'..','fornt_end', 'views');
console.log(staticPath);
const app=express()

app.use(bodyParser.json());
app.use(express.static(staticPath))

app.use(authRouter)



sequelize
    // .sync({forec:true})
    .sync()
    .then(()=>{
        app.listen(8000,()=>{
            console.log("server running on poort 8000");
        });
    })
    .catch(err=>{console.log(err);})