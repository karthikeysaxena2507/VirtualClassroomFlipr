const router = require("express").Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");

// SESSION AUTHENTICATION MIDDLEWARE FOR A USER
router.get("/auth", auth, userController.checkAuth);

// REGISTER THE USER
router.post("/register", userController.registerUser);

// LOGIN THE USER
router.post("/login", userController.loginUser);

// GOOGLE LOGIN
router.post("/googlelogin", userController.loginWithGoogle);


module.exports = router;