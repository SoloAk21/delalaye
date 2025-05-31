import express from 'express';
import { check,query } from 'express-validator';
import brokerController from '../controllers/admin/broker.controller';
import serviceController from '../controllers/admin/services.controller';
import settingController from '../controllers/admin/setting.controller';
import packageController from '../controllers/admin/package.controller';
import staffController from '../controllers/admin/staff.controller';
import dashboardController from '../controllers/admin/dashboard/dashboard.controller';
import smsController from '../controllers/admin/sms.controller';
import { validate } from '../middlewares/validate';
import auth from '../middlewares/auth';
const router = express.Router();

// @route   POST api/admin/staff 
// @desc    Register a staff
// @access  Private
router.post(
  "/staff",
  auth,
  check('fullName', 'fullname is required').not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
    check('phone', 'phone is required').not().isEmpty(), 
  check("role", "role is required").not().isEmpty(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long"),
    validate,
staffController.addStaff
)

// @route   PUT api/admin/staff/:id 
// @desc    Update a staff
// @access  Private
router.put(
  "/staff/:id",
  auth,
staffController.updateStaff
)

// @route   GET api/admin/staffs
// @desc    get all staffs
// @access  Private
router.get(
  "/staffs",
  auth,
  staffController.getStaffs
)

// @route   POST api/admin/service
// @desc    add a service
// @access  Private
router.post(
  "/service",
  auth,
  check('name', 'name is required').not().isEmpty(),
  check('description', 'description is required').not().isEmpty(),
  check("serviceRate", "serviceRate is required").not().isEmpty(),
  validate,
  serviceController.addService
)

// @route   PUT api/admin/service/:id
// @desc    update a service
// @access  Private
router.put(
  "/service/:id",
  auth,
  serviceController.updateService
)


// @route   GET api/admin/services
// @desc    get all services
// @access  Private
router.get(
  "/services",
  // auth,
  serviceController.getServices
)

// @route   POST api/admin/package
// @desc    add a package
// @access  Private
router.post(
  "/package",
  auth,
  check('name', 'name is required').not().isEmpty(),
  check('totalDays', 'totalDays is required').not().isEmpty(),
  check("discount", "discount is required").not().isEmpty(),
  validate,
  packageController.addPackage
)
// @route   PUT api/admin/package/:ID
// @desc    update a package
// @access  Private
router.put(
  "/package/:id",
  auth,
  check('name', 'name is required').not().isEmpty(),
  check('totalDays', 'totalDays is required').not().isEmpty(),
  check("discount", "discount is required").not().isEmpty(),
  validate,
  packageController.updatePackage
)
// @route   PUT api/admin/package/:ID
// @desc    make package active and not active
// @access  Private
router.put(
  "/package/status/:id",
  auth,
  packageController.updatePackageStatus
)

// @route   GET api/admin/packages
// @desc    get all packages
// @access  Private
router.get(
  "/packages",
  auth,
  packageController.getPackages
)
// @route   GET api/admin/settings
// @desc    get all settings
// @access  Private
router.get(
  "/settings",
  auth,
  settingController.getSettings
)

// @route    DELETE api/package/:id
// @desc    Delete package by id
// @access  Private
router.delete(
  "/package/:id",
  auth,
packageController.deletePackage  
)


// @route   POST api/admin/broker
// @desc    Register a broker
// @access  Private
router.post(
    "/broker",
    auth,
    check('fullname', 'fullname is required').not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    //   check('phone_number', 'phone_number is required').not().isEmpty(),
    check("role", "role is required").not().isEmpty(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars long"),
      validate,
brokerController.addBroker
  )

  

// @route   GET api/admin/allbrokers
// @desc    Get all brokers
// @access  Private
router.get(
  "/allbrokers",
  auth,
  validate,
brokerController.getAllBrokers 
)
// @route   GET api/admin/approved
// @desc    Get all brokers
// @access  Private
router.get(
  "/brokers/approved",
  auth,
  validate,
brokerController.getApprovedBrokers 
);
// @route   GET api/admin/approved/search
// @desc    Search approved brokers
// @access  Private
router.get(
  "/brokers/approved/search",
  auth,
  validate,
brokerController.searchApprovedBrokers 
);
// @route   GET api/admin/registered/search
// @desc    Search registered brokers
// @access  Private
router.get(
  "/brokers/registered/search",
  auth,
  validate,
brokerController.searchRegisteredBrokers 
);
// @route   GET api/admin/allbrokers
// @desc    Get all brokers
// @access  Private
router.get(
  "/brokers/registered",
  auth,
  validate, 
brokerController.getRegisteredBrokers 
);


// @route   PUT api/admin/broker/update/:id
// @desc    Update a broker
// @access  Private
router.put(
  "/broker/:id",
  auth,
[  check('fullname', 'fullname is required').not().isEmpty().optional(),
    check('phone', 'phone is required').not().isEmpty().optional()],
    validate,
brokerController.updateBroker  
);
// @route   PUT api/admin/broker/update/photo/:id
// @desc    Update a broker photo
// @access  Private
router.put(
  "/broker/photo/:id",
  auth,
[  check('photo', 'photo is required').not().isEmpty()],
    validate,
brokerController.updateBrokerPhoto
);
// @route   PUT api/admin/broker/approve/:id
// @desc    Approve a broker
// @access  Private
router.put(
  "/broker/approve/:id",
  auth,
brokerController.approveBroker
);

// @route    DELETE api/broker/:id
// @desc    Delete broker by id
// @access  Private
router.delete(
  "/broker/:id",
  auth,
brokerController.deleteBroker  
);

// @route   GET api/admin/settings
// @desc    get all settings
// @access  Private
router.get(
  "/settings",
  auth,
  settingController.getSettings
);
// @route   GET api/admin/settings/init
// @desc   Iitialize settings
// @access  Private
router.get(
  "/settings/init",
  // auth,
  settingController.initializeSettings
);
// @route   PUT api/admin/settings
// @desc    get all settings
// @access  Private
router.put(
  "/settings",
  auth,
  [  check('dailyFee', 'dailyFee is required').not().isEmpty(),],
    validate,
  settingController.updateSettings
);
// @route   GET api/admin/dashboard/count
// @desc    Get dashboard info
// @access  Private
router.get(
  "/dashboard/count",
  auth,
  dashboardController.getDashboardInfo
);

// @route   GET api/admin/dashboard/counter/:year
// @desc    Get counter statistics for brokers,users and connections
// @access  Private
router.get(
  "/dashboard/counter/:year",
  auth,
  dashboardController.getConnectionStat);

// @route   GET api/admin/dashboard/services
// @desc    Get services statistics
// @access  Private
router.get(
  "/dashboard/services",
  auth,
  dashboardController.getServicesStat);

// @route   GET api/admin/dashboard/topup/:year
// @desc    Get topup statistics 
// @access  Private
router.get(
  "/dashboard/topup/:year",
  auth,
  dashboardController.getTopupStat);

// @route   POST api/admin/sms
// @desc    Send bulk sms
// @access  Private
router.post(
  "/sms",
  auth,
  check('to', 'recipient is required, ').not().isEmpty(),
  check('services', 'services is required').exists(),
  check('message', 'message is required, ').not().isEmpty(),
  validate,
  smsController.sendSms
);

  export default router