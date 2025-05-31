import express  from 'express';
import { check } from 'express-validator';
import userController from '../controllers/user/user.controller';
import { validate } from '../middlewares/validate';
import auth from '../middlewares/auth';
const router = express.Router();



// @route   PUT api/users/profile/:id
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
userController.updateProfile  
)
 
// @route   PUT api/users/forgot-password
// @desc    Request Reset password
// @access  Public
router.put(
  "/forgot-password/",
  [
    check('phone').not().isEmpty().withMessage('Please insert your phone number.'),
  ],
  validate,
userController.requestResetPassword
)
// @route   PUT api/users/check-otp
// @desc    Check otp
// @access  Public
router.put(
  "/check-otp/",
  [ 
    check('otp').not().isEmpty().withMessage('otp is required.'),
  ],
  validate,
userController.checkOtp
);
// @route   PUT api/users/reset-password/:id
// @desc    Reset password
// @access  Public
router.put(
  "/reset-password/:id",
  [ 
    check('newPassword').not().isEmpty().withMessage('newPassword is required.'),
  ],
  validate,
userController.resetPassword
);

// @route   GET api/users/connection/history
// @desc   History of connections
// @access  Private
router.get(
  "/connection/history",
  auth,
userController.connectionHistory
)

// @route   POST api/users/request-broker
// @desc    Reset password
// @access  Public
router.post(
  "/request-broker",
  auth,
  [ 
    check('brokerId').not().isEmpty().withMessage('brokerId is required.'),
    check('serviceId').not().isEmpty().withMessage('serviceId is required.'),
    check('locationName').not().isEmpty().withMessage('locationName is required.'),
    check('locationLatitude').not().isEmpty().withMessage('locationLatitude is required.'),
    check('locationLongtude').not().isEmpty().withMessage('locationLongtude is required.'),
  ],
  validate,
userController.requestBroker
);

// @route   POST api/users/call-broker-directly
// @desc    Call broker directly
// @access  Public
router.post(
  "/call-broker-directly",
  auth,
  [ 
    check('brokerId').not().isEmpty().withMessage('brokerId is required.'),
    check('serviceId').not().isEmpty().withMessage('serviceId is required.'),
    check('locationName').not().isEmpty().withMessage('locationName is required.'),
    check('locationLatitude').not().isEmpty().withMessage('locationLatitude is required.'),
    check('locationLongtude').not().isEmpty().withMessage('locationLongtude is required.'),
  ],
  validate,
userController.callBrokerDirectly
);

// @route  GET api/users/request/:id
// @desc   Check request status
// @access Public
router.get(
  "/request/:id",
  auth,
userController.checkRequests
)
// @route   PUT api/users/connection/cancel/:id
// @desc    Reset password
// @access  Public
router.put(
  "/connection/cancel/:id",
  auth,
  [ 
    check('reason').not().isEmpty().withMessage('reason is required.')
  ],
  validate,
userController.cancelConnection
);
// @route   PUT api/users/connection/call/:id
// @desc   call broker
// @access  Private
router.put(
  "/connection/call/:id",
  auth,
userController.callBroker
);

// @route   PUT api/users/rate-broker/:id
// @desc   rate broker
// @access  Private
router.put(
  "/rate-broker/:id",
  auth,
  [ 
    check('rating').not().isEmpty().withMessage('rating is required.')
  ],
  validate,
userController.rateBroker
);


  export default router