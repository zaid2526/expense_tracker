const express=require('express');

const purchaseController=require('../controllers/purchase.controller')
const Auth=require('../middleware/auth')

const router=express.Router();


router.get('/membership',Auth.auth,purchaseController.purchaseMembership)
router.post('/updatetransactionstatus',Auth.auth,purchaseController.updateTransactionStatus )


module.exports= router;