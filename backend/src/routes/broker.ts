import express  from 'express';
import { check } from 'express-validator';
import brokerController from '../controllers/broker/broker.controller';
import { validate } from '../middlewares/validate';
import auth from '../middlewares/auth';
const router = express.Router();

// @route   GET api/broker/services
// @desc   Get available services
// @access  Public
router.get(
  "/services",
brokerController.getAvailableServies
)
// @route   GET api/broker/packages
// @desc   Get available packages
// @access  Public
router.get(
  "/packages",
  auth,
brokerController.getPackages
)

// @route   PUT api/broker/profile
// @desc    update profile
// @access  Private
router.put(
  "/profile/:id",
  auth,
  [
    check('email').optional().isEmail().withMessage('Invalid email'),
    check('phone').optional().isLength({ min: 9 }).withMessage('Phone number must be at least 9 digits long'),
    check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  validate,
brokerController.updateProfile  
)
// @route   PUT api/broker/availablity
// @desc    update available
// @access  Private
router.put(
  "/availablity/",
  auth,
  [
    check('avilableForWork')
    .not().isEmpty().withMessage('available is required'),
  ],
  validate,
brokerController.updateAvailability  
)
// @route   PUT api/broker/location
// @desc    update location
// @access  Private
router.put(
  "/location/",
  auth,
  [
    check('latitude').not().isEmpty().withMessage('latitude is required'),
    check('longtude').not().isEmpty().withMessage('longtude is required')
  ],
  validate,
brokerController.updateLocation  
)
// @route   POST api/broker/topup/:id
// @desc    Top up points
// @access  Private
router.post(
  "/topup/:id", 
  auth,
  [
    // check('phone').not().isEmpty().withMessage('Phone number is required'),
    check('packageId').not().isEmpty().withMessage('Please select a package to topup'),
  ],
  validate,
brokerController.topUp  
)

// @route   PUT api/broker/forgot-password
// @desc    Request Reset password
// @access  Public
router.put(
  "/forgot-password/",
  [
    check('phone').not().isEmpty().withMessage('Please insert your phone number.'),
  ],
  validate,
brokerController.requestResetPassword
)
// @route   PUT api/broker/check-otp
// @desc    Check otp
// @access  Public
router.put(
  "/check-otp/",
  [ 
    check('otp').not().isEmpty().withMessage('otp is required.'),
  ],
  validate,
brokerController.checkOtp
);
// @route   PUT api/broker/reset-password/:id
// @desc    Reset password
// @access  Public
router.put(
  "/reset-password/:id",
  [ 
    check('newPassword').not().isEmpty().withMessage('newPassword is required.'),
  ],
  validate,
brokerController.resetPassword
);

// @route  GET api/broker/request
// @desc   Check if there is a request from user
// @access Public
router.get(
  "/request",
  auth,
brokerController.checkRequests
)
// @route  GET api/broker/request/:id
// @desc   Check request status
// @access Public
router.get(
  "/request/:id",
  auth,
brokerController.checkRequest
)
// @route  PUT api/broker/connection/response/:id
// @desc   accept or pass connection requests from user
// @access Public
router.put(
  "/connection/response/:id",
  auth,
  [ 
    check('status').not().isEmpty().withMessage('status is required.'),
  ],
  validate,
brokerController.respondToConnection
)
// @route  GET api/broker/connection/history
// @desc   History of connections
// @access Private
router.get(
  "/connection/history",
  auth,
brokerController.connectionHistory
)
// @route   PUT api/broker/connection/cancel/:id
// @desc    Reset password
// @access  Public
router.put(
  "/connection/cancel/:id",
  auth,
brokerController.cancelConnection
);
// @route  GET api/broker/filter
// @desc   Filter brokers
// @access Public
router.get(
  "/filter",
  auth,
brokerController.filterBrokers
)

 export default router 