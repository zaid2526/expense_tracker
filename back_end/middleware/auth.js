const jwt=require('jsonwebtoken');

const SignUp=require('../models/sign-up');


exports.auth=(req,res,next)=>{
    try{
        let user;
        const token=req.cookies.jwt
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY)
        // console.log("verifyUser",verifyUser);
        SignUp.findAll({where:{email:verifyUser.email}})
            .then(user=>{
                user=user;
                // console.log("user",user);
            })
            .catch(err=>{console.log(err);})

        req.userDetails=user;
        next();
    }catch(err){
        res.status(401).send(err)
    }
    
}