const jwt=require('jsonwebtoken');

const SignUp=require('../models/register');


exports.auth=(req,res,next)=>{
    try{
        const token=req.cookies.jwt
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY)
        // console.log("verifyUser",verifyUser);
        SignUp.findOne({where:{email:verifyUser.email}})
            .then(user=>{
                
                // console.log("user",user);
                req.user=user;
                next();
            })
            .catch(err=>{console.log(err);})

        
    }catch(err){
        res.status(401).send(err)
    }
    
}