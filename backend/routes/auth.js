const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");

const authValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

router.post("/register", authValidation, authController.register);
router.post("/login", authValidation, authController.login);

module.exports = router;
