import express  from 'express';
import { check } from 'express-validator';
import userController from '../controllers/user/user.controller';
import { validate } from '../middlewares/validate';
import auth from '../middlewares/auth';
import { SantimpaySdk } from '../lib/santimpay';
import { PRIVATE_KEY_IN_PEM } from '../lib/santimpay/utils/constants';
import prisma from '../controllers/config/db';
const router = express.Router();









// const client = new SantimpaySdk(GATEWAY_MERCHANT_ID, PRIVATE_KEY_IN_PEM);

// // client side pages to redirect user to after payment is completed/failed
// const successRedirectUrl = "https://santimpay.com";
// const failureRedirectUrl = "https://santimpay.com";
// const cancelRedirectUrl = "https://santimpay.com";

// // backend url to receive a status update (webhook)
// // const notifyUrl = "https://santimpay.com";
// const notifyUrl = "https://sant.requestcatcher.com/test";

// // custom ID used by merchant to identify the payment
// const id = Math.floor(Math.random() * 1000000000).toString();

// client.generatePaymentUrl(id, 0.5, "payment", successRedirectUrl, failureRedirectUrl, notifyUrl, "+251984006406", cancelRedirectUrl).then(url => {
//     // redirect user to url to process payment
//     console.log("Payment URL: ", url);
    
//     setTimeout(() => {

//         console.log("\n\n*********************************")
//         console.log("checking for transaction...")
        
//         client.checkTransactionStatus(id).then(transaction => {
//             console.log("Transaction: ", transaction);
//         }).catch(error => {
//             console.error(error)
//         })
//     }, 20_000)
// }).catch(error => {
//     console.error(error)
// })



// @route   PUT api/test/santimpay
// @desc   check santimpay
// @access  Private
router.get(
  "/santimpay",async(req, res) => {
try { 

 
  const client = new SantimpaySdk(process.env.GATEWAY_MERCHANT_ID!, PRIVATE_KEY_IN_PEM!);

    // client side pages to redirect user to after payment is completed/failed
    const successRedirectUrl = "https://delalaye.com/success";
    const failureRedirectUrl = "https://delalaye.com/fail";
    const cancelRedirectUrl = "https://delalaye.com/cancel";
    
    // backend url to receive a status update (webhook)
    // const notifyUrl = "https://santimpay.com";
    const notifyUrl = "https://dev-api.delalaye.com/chapa/notify";
    
    // custom ID used by merchant to identify the payment
    const id = Math.floor(Math.random() * 1000000000).toString();
    console.log('id')
    console.log(id)
   const url = await client.generatePaymentUrl(id, 0.1, "payment", successRedirectUrl, failureRedirectUrl, notifyUrl, "+251929336352", cancelRedirectUrl);
res.json({chekout_url:url})
        setTimeout(() => {
    
            console.log("\n\n*********************************")
            console.log("checking for transaction...")
            
            client.checkTransactionStatus(id).then(transaction => {
                console.log("Transaction: ");
                console.log(transaction)
            }).catch(error => {
                console.error(error)
            })
        }, 20_000)
  
} catch (error) {
  console.log(error)
  res.status(500).json({error})
}
    
  }
)



  export default router