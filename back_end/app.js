require('dotenv').config()

const path=require('path')

const express = require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser')

const sequelize = require('./util/database');
const authRouter=require('./routes/auth.router')
const purchaseRouter=require('./routes/purchase.router')
const resetPasswordRouter=require('./routes/resetPassword.router')

const User=require('./models/register');
const Expense=require('./models/expense')
const Order=require('./models/order')

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
app.use('/purchase',purchaseRouter)
app.use('/password',resetPasswordRouter)

Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Expense)

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    // .sync({alter:true})
    // .sync({force:true})
    .sync()
    .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log("server running on poort 8000");
        });
    })
    .catch(err=>{console.log(err);})