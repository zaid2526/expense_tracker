// const  crypto=require('crypto')
// const secretKey=crypto.randomBytes(64).toString('hex');

const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')


const SignUp=require('../models/register')

exports.postSignUp=(req,res,next)=>{
    // console.log("req user",req.userDetails)
    // console.log(req.body);
    // let isSucces;
    // console.log("req,user",req.user);
    const {name,email,phone,password}=req.body
    // console.log(name,email,phone,password);
    // bcrypt.hash(password,10).then(data=>{
    //     console.log("hash",data);
    // })
    

    SignUp.findOne({where:{email:email}})
        .then(data=>{
            if(data){
               res.json({
                email:data.email,
                isSucces:false
            }); 
            }
            else{
                return bcrypt.hash(password, 10)
                
            }
        })
        .then(encryptedPassword=>{
            // console.log("jsddgs",encryptedPassword);
            const token=jwt.sign({email:email},process.env.SECRET_KEY);
            // console.log("token created",token);
            res.cookie('jwt',token,{
                // expires: new Date(Date.now() + 30000),
                httpOnly:true,
                secure:true
            })
            // console.log("cookie",cookie);
            return SignUp.create({
                name:name,
                email:email,
                phone:phone,
                password:encryptedPassword,
                token:token,    
            })
           
        })
        .then(data=>{
            console.log(data);
            res.json({
                user:data,
                isSucces:true
            })
        })
        .catch(err=>{console.log(err);})


    
}

exports.postLogIn=(req,res,next)=>{
    const { email, password}=req.body
    let name;
    let token;
    let id;
    // console.log("postLogIn",req.body);
    SignUp.findOne({where:{email:email }})
        .then(data=>{
            if(!data){
                res.json({email:email,auth:false})
            }else{

                name=data.name;
                id=data.id;
                
                return bcrypt.compare(password,data.password)
            }
            
        })
        .then(validPassword=>{
            

            if(validPassword===true){
                // console.log("valid",validPassword);
                token=jwt.sign({id:id,email:email},process.env.SECRET_KEY)
               
                // console.log("token Created",token);
                res.cookie('jwt',token,{
                    // expires: new Date(Date.now() + 30000),
                    httpOnly:true,
                    secure:true
                })

                res.json({
                    name:name,
                    email:email,
                    auth:true,
                    secretToken:token
                })
            }
            if(validPassword===false){
                res.json({
                    name:name,
                    email:email,
                    auth:false,
                })
            }
        })
        .catch(err=>{console.log(err);})
}

exports.getLogOut=(req,res,next)=>{
    res.clearCookie('jwt');
    res.json({jwt:false})
}

exports.getexpenses=(req,res,next)=>{
    const {id}=req.userDetails;
    req.userDetails.getExpenses().then(expense=>{
        console.log();
        res.json(id)
    })
        .catch(err=>{console.log(err);})
    
}
exports.postExpense=(req,res,next)=>{
    const user=req.userDetails;
    console.log("addExpense",user);
    const {expense,description,category}=req.body;
    console.log(expense,description,category);
    req.userDetails
        .createExpense({expense,description,category,registerId:req.userDetails.id})
        .then(expense=>{
            // console.log("addexpense",user);
            res.json({isSucces:true})
        })
        .catch(err=>{console.log(err);})


}