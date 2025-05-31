import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import staffAuthController from "../controllers/auth/staff.auth";
import brokerAuthController from "../controllers/auth/broker.auth";
import userAuthController from "../controllers/auth/user.auth";
import { validate } from "../middlewares/validate";
import auth from "../middlewares/auth";

const router = express.Router();

// Log in staff
router.post(
  "/staff/login",
  [
    check("email").isEmail().withMessage("Invalid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validate,
  staffAuthController.loginStaff
);

// Get logged in staff
router.get("/staff", auth, staffAuthController.getStaff);

// Get logged in broker
router.get("/broker", auth, brokerAuthController.getBroker);
// Get logged in user
router.get("/user", auth, userAuthController.getUser);
//Login broker Google Auth
router.post(
  "/broker/login/google",
  [check("idToken").not().isEmpty().withMessage("Token required")],
  validate,
  brokerAuthController.loginGoogle
);

// Log in broker
router.post(
  "/broker/login",
  [
    check("phone")
      .isLength({ min: 9 })
      .withMessage("Phone number must be at least 9 digits long"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validate,
  brokerAuthController.loginBroker
);

//Signup broker Google Auth
router.post(
  "/broker/signup/google",
  [check("idToken").not().isEmpty().withMessage("Token required")],
  validate,
  brokerAuthController.signupGoogle
);
// Sign up broker
router.post(
  "/signup/broker",
  [
    // check("photo").not().isEmpty().withMessage("Photo is required."),
    check("fullName").not().isEmpty().withMessage("Full name is required."),
    check("services").not().isEmpty().withMessage("Services is required."),
    check("addresses").not().isEmpty().withMessage("Addresses is required."),
  ],
  validate,
  brokerAuthController.signupBroker
);

//Signup user Google Auth
router.post(
  "/user/signup/google",
  [check("idToken").not().isEmpty().withMessage("Token required")],
  validate,
  userAuthController.signupGoogle
);
//Login user Google Auth
router.post(
  "/user/login/google",
  [check("idToken").not().isEmpty().withMessage("Token required")],
  validate,
  userAuthController.loginGoogle
);
// Sign up customer/user
router.post(
  "/signup/user",
  [check("fullName").not().isEmpty().withMessage("Full name is required.")],
  validate,
  userAuthController.signupUser
);

// Log in user
router.post(
  "/user/login",
  [
    check("phone")
      .isLength({ min: 9 })
      .withMessage("Phone number must be at least 9 digits long"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validate,
  userAuthController.loginUser
);

export default router;
