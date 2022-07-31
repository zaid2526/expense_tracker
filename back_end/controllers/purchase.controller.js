require('dotenv').config();
const RazorPay=require('razorpay');
const UniqId=require('uniqid');





exports.purchaseMembership=(req,res,next)=>{

    try{
        // console.log(req.user)
        var rzp_instance = new RazorPay({ 
            key_id: process.env.RAZORPAY_KEY_ID, 
            key_secret: process.env.RAZORPAY_KEY_SECRET,
            // reciept:UniqId()
        });
        var option={
            amount:5000,
            currency: "INR"
        }
        rzp_instance.orders
            .create(option, (err, order) => {
            if(err) {
                throw new Error(err);
            }
            // res.json({order:order, key_id : rzp_instance.key_id})
            req.user.createOrder({ 
                    orderid: order.id, status: 'PENDING'
                })
                .then((order) => {
                    res.status(201).json({
                        order:order,
                        key_id : rzp_instance.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    }catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

exports.updateTransactionStatus =(req,res,next)=>{
    // const { payment_id, order_id} = req.body;
    // console.log(payment_id,order_id);
    try {
        const { payment_id, order_id} = req.body;
        req.user.getOrders({where : {orderid : order_id}})
            .then(orders=>{
                // console.log("order",order);
                let order=orders[0];
                return order.update({ paymentid: payment_id, status: 'SUCCESSFUL'})
            })
            .then((update) => {
                // console.log("update",update);
                // req.user.update({ispremiumuser: true})
                res.cookie('isPremium',true)
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            })
            .catch((err)=> {
                throw new Error(err);
            })

       
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }

}