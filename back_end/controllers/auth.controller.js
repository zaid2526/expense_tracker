// const  crypto=require('crypto')
// const secretKey=crypto.randomBytes(64).toString('hex');
const fs=require('fs')

const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')
const AWS=require('aws-sdk')


const SignUp=require('../models/register');

exports.postSignUp=(req,res,next)=>{
    // console.log("req user",req.user)
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
    const {id}=req.user;
    let page=1;
    let limit=5;
    // let page= +req.body.page;
    let offset=0 +(page-1)*limit;
    req.user.getExpenses({ 
        offset:offset,
        limit:limit
      }).then(expense=>{
        console.log();
        res.json(expense)
    })
        .catch(err=>{console.log(err);})
    
}

exports.getExpensesPaginating=(req,res,next)=>{


    let page=1;
    let limit=+req.body.rows;
    let offset=0 +(page-1)*limit;
    req.user.getExpenses({ 
        offset:offset,
        limit:limit
      }).then(expense=>{
        console.log();
        res.json(expense)
    })
        .catch(err=>{console.log(err);})
    
}

exports.postExpense=(req,res,next)=>{
    const user=req.user;
    console.log("addExpense",user);
    const {expense,description,category}=req.body;
    console.log(expense,description,category);
    req.user
        .createExpense({expense,description,category,registerId:req.user.id})
        .then(expense=>{
            // console.log("addexpense",user);
            res.json({isSucces:true})
        })
        .catch(err=>{console.log(err);})


}


function uploadToS3(data,fileName){
    const BUCKET_NAME='expensestrackingapp';
    const IAM_USER_KEY='^%$^$^&^';
    const IAM_USER_SECRET='&%&*%^&*%';
    //these are will be in the .env file
    let s3Bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKeyId:IAM_USER_SECRET
    })
    // s3Bucket.createBucket(()=>{
        // because we already created the bucket so we don't need to call
        // s3bucket.createBucket.......
        var params={
            Bucket:BUCKET_NAME,//process.env.BUCKET_NAME
            Key:fileName,
            Body:data,
            ACL:'fublic-read' // to make publically doenload with its url

        } 
        return new Promise((resolve,reject)=>{
            s3Bucket.upload(params,(err,s3Response)=>{ // it is a async call 
                if(err){
                    console.log("something went wrong",err);
                    reject(err)
                }else{
                    console.log("success",s3Response);
                    // return s3Response.Location;// return the url of the file
                    resolve(s3Response.Location)
                }
            })
        })
        
    // })
}

exports.getDownloadExpenses=async(req,res)=>{
    try{
        const expenses=await req.user.getExpenses();
    // console.log(expenses);
    // console.log(req.user.name)
    const stringifiedExpenses=JSON.stringify(expenses);
    const fileName=`expenses${req.user.id}/${new Date()}.txt`;

    const fileURL= await uploadToS3(stringifiedExpenses,fileName) // in this, s3Bucket.upload
        // is a async function so we need to handle this with the promise...
    res.status(200).json({fileURL,isSucces:true})



    // fs.writeFile(fileName, stringifiedExpenses, (err, data) => {
    //     if (err)
    //         console.log(err);
    //     else {
    //         // console.log("File written successfully\n"); 
    //     }
    // });

    }catch(err){
        console.log(err);
        res.status(500).json({fileURL:'',isSucces:true,err:err})
    }
    


    
}