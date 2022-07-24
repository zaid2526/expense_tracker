const  crypto=require('crypto')

const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')


const SignUp=require('../models/sign-up')

const secretKey=crypto.randomBytes(64).toString('hex');

exports.postSignUp=(req,res,next)=>{
    // console.log(req.body);
    // let isSucces;
    const {name,email,phone,password}=req.body
    console.log(name,email,phone,password);
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
            return SignUp.create({
                name:name,
                email:email,
                phone:phone,
                password:encryptedPassword,
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
    let id;
    let token;
    console.log("postLogIn",req.body);
    SignUp.findOne({where:{email:email }})
        .then(data=>{
            if(!data){
                res.json({email:email,auth:false})
            }else{
                id=data.id
               name=data.name;
                
                return bcrypt.compare(password,data.password)
            }
            
        })
        .then(validPassword=>{
            console.log("valid",validPassword);
            token=jwt.sign({id:id},secretKey)
                // .then(token=>{
                //     console.log("token Created",token);
                // })
                // .catch(err=>{console.log(err);})
                console.log("token Created",token);
            if(validPassword===true){
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
                    auth:true,
                    wrongPassword:true})
            }
        })
        .catch(err=>{console.log(err);})
}

