const express=require('express');

const resetPasswordControllers=require('../controllers/resetPassword.controller')

const router=express.Router();



// router.get('/resetpassword',resetPasswordControllers.resetPassword);



router.get('/updatepassword/:resetpasswordid', resetPasswordControllers.updatePassword);

router.get('/resetpassword/:id', resetPasswordControllers.resetPassword);

router.post('/forgotpassword',resetPasswordControllers.forgotPassword);


module.exports= router;