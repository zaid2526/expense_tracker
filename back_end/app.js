require('dotenv').config()

const path=require('path')
const fs=require('fs')

const express = require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser')
const helmet=require('helmet');
const morgan=require('morgan');
const compression=require('compression')

const sequelize = require('./util/database');
const authRouter=require('./routes/auth.router')
const purchaseRouter=require('./routes/purchase.router')
const resetPasswordRouter=require('./routes/resetPassword.router')

const User=require('./models/register');
const Expense=require('./models/expense')
const Order=require('./models/order')
const Forgotpassword=require('./models/forgotPassword')

const staticPath=path.join(__dirname,'..','fornt_end', 'views');
console.log(staticPath);
const app=express();

// //creating secret key...
// const  crypto=require('crypto')
// console.log("secret", crypto.randomBytes(64).toString('hex'))

const accessLogStream=fs.createWriteStream(
        path.join(__dirname,'access.log'),
        {
            flag:'a'
        }
    );

app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.static(staticPath))

// app.use(compression()) // provided by the hostign provider
app.use(helmet());
// app.use(morgan('combined'));// this will logging all the access on the console

// app.use(morgan('combined',{
//     stream:accessLogStream
// }))

// it will be logged error only
app.use(morgan('combined', {
    stream:accessLogStream,
    skip: function (req, res) { return res.statusCode < 400 },
    
  }))
app.use(authRouter)
app.use('/purchase',purchaseRouter)
app.use('/password',resetPasswordRouter)

Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Expense)

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);




sequelize
    // .sync({alter:true})
    // .sync({force:true})
    .sync()
    .then(()=>{
        app.listen(process.env.PORT || 8000,()=>{
            console.log("server running on poort 8000");
        });
    })
    .catch(err=>{console.log(err);})