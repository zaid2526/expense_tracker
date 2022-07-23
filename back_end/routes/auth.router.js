const express=require('express');

const authControllers=require('../controllers/auth.controller')


const router=express.Router();


router.post('/register',authControllers.postSignUp)


module.exports= router;