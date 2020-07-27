const express = require('express');

const router = express.Router();
const authController = require('../controllers/authControllers');

/* AUTHENTICATION FOR USER */
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/forgot_password', authController.forgotPassword);
router.patch('/reset_password/:token', authController.resetPassword);

// ------------------------
/* All middleware and route come after this statement, 
will be protected. Because middleware runs line-by-line */
router.use(authController.protected);

// Update user's password
router.patch('/update_password', authController.updatePassword);

// Get ME route, using getMe() to attach the ID for getUser()
router.route('/me').get(authController.getMe, authController.getAdmin);

module.exports = router;
