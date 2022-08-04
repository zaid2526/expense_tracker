const sgMail = require('@sendgrid/mail')
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/register');
const Forgotpassword = require('../models/forgotpassword');




exports.forgotPassword=(req,res,next)=>{
  try{
    console.log(req.body);
    const {email}=req.body
    let id;
    User.findOne({where:{email:email}})
      .then(user=>{
        if(user){
           id = uuid.v4();

          //  console.log("user",user)
          return user.createForgotpassword({ id , active: true })
        }else{
          throw new Error('User doesnt exist')
        }
      })
      .then((newPassword)=>{
        // console.log("newPassword",newPassword);
        sgMail.setApiKey(process.env.FORGOT_PASSWORD_API);
        const msg = {
          to: email, // Change to your recipient
          from: 'mzr16894@gmail.com', // Change to your verified sender
          subject: 'Sending with SendGrid is Fun',
          text: 'and easy to do anywhere, even with Node.js',
          html:`<a href='http://localhost:8000/password/resetpassword/${id}'>resetpassword</a>`
          // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  
          // `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
        }
        return sgMail
          .send(msg)
        

      }).then((response) => {
        console.log("mail send",response[0].statusCode)
        // console.log(response[0].headers)
        // res.json(response)
        return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true})
      })
  }catch(err){
    console.log(err);
        return res.json({ message: err, sucess: false });
  }
    
      
   
    
      
    
}

// const forgotpassword = async (req, res) => {
//   try {
//       const { email } =  req.body;
//       const user = await User.findOne({where : { email }});
//       if(user){
//           const id = uuid.v4();
//           user.createForgotpassword({ id , active: true })
//               .catch(err => {
//                   throw new Error(err)
//               })

//           sgMail.setApiKey(process.env.SENGRID_API_KEY)

//           const msg = {
//               to: email, // Change to your recipient
//               from: 'yj.rocks.2411@gmail.com', // Change to your verified sender
//               subject: 'Sending with SendGrid is Fun',
//               text: 'and easy to do anywhere, even with Node.js',
//               html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
//           }

//           sgMail
//           .send(msg)
//           .then((response) => {

//               // console.log(response[0].statusCode)
//               // console.log(response[0].headers)
//               return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

//           })
//           .catch((error) => {
//               throw new Error(error);
//           })

//           //send mail
//       }else {
//           throw new Error('User doesnt exist')
//       }
//   } catch(err){
//       console.error(err)
//       return res.json({ message: err, sucess: false });
//   }

// }

exports.resetPassword=(req,res,next)=>{
  const id =  req.params.id;
  Forgotpassword.findOne({ where : { id }})
    .then(forgotpasswordrequest => {
      if(forgotpasswordrequest){
          forgotpasswordrequest.update({ active: false});
          res.status(200).send(`<html>
                                  <script>
                                      function formsubmitted(e){
                                          e.preventDefault();
                                          console.log('called')
                                      }
                                  </script>
                                  <form action="/password/updatepassword/${id}" method="get">
                                      <label for="newpassword">Enter New password</label>
                                      <input name="newpassword" type="password" required></input>
                                      <button>reset password</button>
                                  </form>
                              </html>`
                              )
          res.end()

      }
  })
  
}

exports.updatePassword=(req,res,next)=>{
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    console.log("new",newpassword);
    
    Forgotpassword.findAll({
       where : { id: resetpasswordid },
       include:[{
        model:User,
        attributes:['id','name']
      }],
      })
      .then(resetpasswordrequest => {
        console.log("reset",resetpasswordrequest);
        User.findOne({where: { id : resetpasswordrequest.registerId}})
        .then(user => {
            console.log('userDetails', user)
            if(user) {
                //encrypt the password

                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    if(err){
                        console.log(err);
                        throw new Error(err);
                    }
                    bcrypt.hash(newpassword, salt, function(err, hash) {
                        // Store hash in your password DB.
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        user.update({ password: hash }).then(() => {
                            res.status(201).json({message: 'Successfuly update the new password'})
                        })
                    });
                });
        } else{
            return res.status(404).json({ error: 'No user Exists', success: false})
        }
        })
    })
} catch(error){
    return res.status(403).json({ error, success: false } )
}

}



