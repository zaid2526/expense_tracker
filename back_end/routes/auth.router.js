const express=require('express');

const authControllers=require('../controllers/auth.controller')


const router=express.Router();
const Auth=require('../middleware/auth')

router.post('/register', authControllers.postSignUp)
router.post('/login',authControllers.postLogIn);

router.get('/expenses',Auth.auth,authControllers.getexpenses);
router.post('/expenses',Auth.auth,authControllers.getExpensesPaginating);

router.post('/addExpense',Auth.auth,authControllers.postExpense);

router.get('/logout',Auth.auth,authControllers.getLogOut)

router.get('/download',Auth.auth,authControllers.getDownloadExpenses)


module.exports= router;