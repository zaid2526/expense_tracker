const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.FORGOT_PASSWORD_API)

exports.forgotPassword=(req,res,next)=>{
    console.log(req.body);
    const {email}=req.body
    
    const msg = {
        to: email, // Change to your recipient
        from: 'mzr16894@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        // `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
    }
    sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
        res.json(response)
      })
      .catch((error) => {
        console.error(error)
      })
    
      
    
}




