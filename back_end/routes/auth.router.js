const express=require('express');

const authControllers=require('../controllers/auth.controller')


const router=express.Router();
const Auth=require('../middleware/auth')

router.post('/register',Auth.auth, authControllers.postSignUp)
router.post('/login',authControllers.postLogIn)

router.get('/logout',Auth.auth,authControllers.getLogOut)


module.exports= router;