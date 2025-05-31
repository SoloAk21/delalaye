import express from 'express';
import santimPayController from '../controllers/payment/santimpay.controller';



const router = express.Router(); 

// Chapa webhook
router.post(
  '/santimpay/notify', 
  santimPayController.notify
);

export default router;