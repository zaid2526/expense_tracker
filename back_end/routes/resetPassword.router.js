const express=require('express');

const resetPasswordControllers=require('../controllers/resetPassword.controller')

const router=express.Router();


router.post('/forgotpassword',resetPasswordControllers.forgotPassword)
module.exports= router;