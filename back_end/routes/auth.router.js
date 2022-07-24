const express=require('express');

const authControllers=require('../controllers/auth.controller')


const router=express.Router();


router.post('/register',authControllers.postSignUp)
router.post('/login',authControllers.postLogIn)


module.exports= router;