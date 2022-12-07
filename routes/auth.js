const express = require("express");
const verifySignUp = require("../middlewares/verifySignUp");
const router = express.Router();
const authController = require("../controllers/auth");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/signup",
  verifySignUp.checkDuplicateUsername,
  authController.signUp
);

router.post("/signin", authController.signIn);

module.exports = router;
