const bcrypt=require('bcrypt');

const signUp=require('../models/sign-up')

exports.postSignUp=(req,res,next)=>{
    // console.log(req.body);
    const {name,email,phone,password}=req.body
    console.log(name,email,phone,password);
    // bcrypt.hash(password,10).then(data=>{
    //     console.log("hash",data);
    // })
    

    signUp.findOne({where:{email:email}})
        .then(data=>{
            if(data){
               res.json(data.email); 
            }
            else{
                return bcrypt.hash(password, 10)
                
            }
        })
        .then(encryptedPassword=>{
            // console.log("jsddgs",encryptedPassword);
            return signUp.create({
                name:name,
                email:email,
                phone:phone,
                password:encryptedPassword,
            })
           
        })
        .then(data=>{
            console.log(data);
            // res.json(data)
        })
        .catch(err=>{console.log(err);})


    
}