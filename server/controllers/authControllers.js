const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../models/adminModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendEmail } = require('../utils/mailService');
const factory = require('./apifactory/controllerFactory');
/**
 * This function is for signing a token or generate a JWT
 *  token with provided JWT_SECRET, JWT_EXPIRES_IN as a
 *  .env variables.
 * @param {*} id - payload of the JWT, in this situation
 *  we include as an id of admin
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * This function Create & Send the JWT Token to the admin end.
 *  By using the function "signToken", it generates a JWT Token
 *  with specific expires time. Furthermore, this method filters
 *  some sensitive key fields such as "password" and also leverage
 *  cookies when sending.
 * @param {*} admin - Instance of Admin Model from MongoDB
 * @param {*} statusCode - HTTP StatusCode to be sent
 * @param {*} res - Instance of Response in ExpressJS
 */
const createSendToken = (admin, statusCode, res) => {
  // Generate the JWT Token with admin id
  const token = signToken(admin._id);

  // Filter out, do not expose to admin
  ['password', 'passwordChangedAt', 'salt', '__v'].forEach((el) => {
    admin[el] = undefined;
  });

  // CookieOptions for sending
  const cookieOptions = {
    expires: new Date(
      // Now + Day * 24 Hours * 60 Minutes * 60 Seconds * 1000 milliseconds
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // Only work in HTTP or HTTPS Protocol
    httpOnly: true
  };

  /* In HTTPS connection, Cookies will be encrypted and stay secure
      We only want this feature in production environment. Not in 
      development environment.
  */
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Send the JWT Token as cookie
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    data: {
      admin
    }
  });
};

/**
 * This middleware will sign up the admin with name,
 *  email, role & password. However, internally with
 *  database, it will generate a random "SALT" and
 *  "HASH" the password using the "SALT". It also
 *  sets the passwordChangedAt field to the current
 *  time.
 *
 */
exports.signup = catchAsync(async (req, res) => {
  const newAdmin = await Admin.create({
    // Never put role in here, end_admin cannot create himself as "Admin"
    // Use POST /api/v1/admin to perform this action, but need role to be "admin"
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  // Send result back to Client
  createSendToken(newAdmin, 201, res);
});

/**
 * This middleware will log the admin in by providing
 *  email and password. MongoDB will fetch hashed password
 *  from database, and HASH given password based on the
 *  stored SALT. Finally, compare the hashed password stored
 *  and the hashed password given to check similarity.
 *
 *  Please see the '/models/adminModels' for more details
 *    by looking MongoDB Middleware "checkCorrectness".
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Không tìm thấy email hoặc mật khẩu !', 400));
  }

  // 2) Check if admin exists && password is correct

  /* Because we exclude the password field by default, now we manually added 
	in order to double-check with the provided password. We should use .select('+field') */
  const admin = await Admin.findOne({ email }).select('+password');

  // Leverage the Mongo Methods has been written in Admin model. Check the correctness
  if (!admin || !(await admin.checkCorrectness(password, admin.password))) {
    return next(new AppError('Email hoặc mật khẩu không đúng', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(admin, 200, res);
});

/**
 * This middleware will log out the admin just by delete
 *  their jwt token.
 */
exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie('jwt');

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * This middleware will protect the route from public use.
 *  Only admin with the verified JWT Token is permitted.
 *  Finally, after verification, attach the Admin onto the
 *  request for future use.
 *
 *  Please see the '/models/adminModels' for more details
 *    by looking MongoDB Middleware "changedPasswordAfter".
 */
exports.protected = catchAsync(async (req, res, next) => {
  /* NEVER CHECK AUTHHEADER, IT MAY CAUSE REPLAY ATTACK WITH JWT */

  // TODO 1) Getting Token and check of it's there
  // const authHeader = req.headers.authorization;
  // if (authHeader && authHeader.startsWith('Bearer')) {
  //   //Bearer format to be --> Bearer eyhasdcsdfsdf
  //   //We take the 2nd one
  // 	token = authHeader.split(' ')[1];
  // }

  // Token as HttpOnly Cookies is safer
  const token = req.cookies.jwt;

  // If there is no token or there is no token after Bearer
  if (!token) {
    return next(
      new AppError(
        'Bạn chưa đăng nhập !! Vui lòng đăng nhập để sử dụng tính năng.',
        401
      )
    );
  }

  // TODO 2) Verification token (Synchronous)
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  // TODO 3) Check if admin still exists
  const currentAdmin = await Admin.findById(verify.id);
  if (!currentAdmin) {
    return next(
      new AppError('Người dùng gắn với mã token không còn tồn tại', 401)
    );
  }

  // TODO 4) Check if admin changed password after JWT was issued
  if (currentAdmin.changedPasswordAfter(verify.iat)) {
    return next(
      new AppError(
        'Người dùng gần đây thay đổi mật khẩu, xin đăng nhập lại',
        401
      )
    );
  }

  /* 
  After validating the Admin JWT. We attach the Admin onto the request
    for future use
  */
  req.admin = currentAdmin;

  next();
});

/**
 * This middleware will check the permissions of the admin.
 *  Some of the admins do not have permission to perform
 *  an action.
 *
 * E.g "admin" cannot access Admin Dashboard
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    /* 
    We check if the attached Admin with the "role" is in the 
      whitelist of permissions
    */
    if (!roles.includes(req.admin.role)) {
      return next(
        new AppError('Bạn không có đủ quyền hạn để sử dụng tính năng này', 403)
      );
    }
    next();
  };
};

/**
 * This middleware will handle the scenario when admin
 *  forgot their password. This will generate a random
 *  RESET_TOKEN and then send along to admin's email.
 *
 *  The Token expires in 10 mins and they need to click
 *  to this url to perform password reset.
 *
 * Please see the '/models/adminModels' for more details
 *  by looking MongoDB Middleware "createPasswordResetToken".
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // TODO 1) get admin based on Posted email
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) {
    return next(new AppError('Không có người dùng với Email đề cập', 404));
  }

  // TODO 2) Generate random reset token
  const resetToken = admin.createPasswordResetToken();

  // Save back to admin Database & ignore the validation
  await admin.save({ validateBeforeSave: false });

  // TODO 3) Send it to admin's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/admin/reset_password/${resetToken})`;

  const message = `Bạn quên Mật Khẩu? Điền PATCH, mật khẩu mới cùng với url: ${resetURL}. \n 
  Nếu bạn không yêu cầu làm lại mật khẩu, xin bỏ qua email này.`;

  try {
    // Send Email
    await sendEmail({
      email: admin.email,
      subject: 'Link làm mới mật khẩu {khả dụng trong 10 phút)',
      message
    });

    // return to Admin the response
    res.status(200).json({
      status: 'success',
      message: 'Link làm mới đã được gởi tới mail'
    });
  } catch (err) {
    /* 
    If there is some error that we can't send to admin's email, 
      we then delete the reset_token and its expiry time
    */
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;

    // Save back to Database the changes & ignore the validation
    await admin.save({ validateBeforeSave: false });

    // Return the Error as a response
    return next(
      new AppError('Có lỗi trong khi gởi email. Xin thử lại lúc khác!', 500)
    );
  }
});

/**
 * This middleware will handle when the admin has the RESET_URL
 *  when they forgot the password. We will extract the "unhashed"
 *  token, and compare with the "hashed" that we stored in the
 *  database to validate. If the validation is successful, we
 *  will extract the "password" in the body and set the new password.
 *
 * Remember, the password before "update" or "create" always get
 *  HASH & SALT because of MongoDB Method.
 *
 * Please see the '/models/adminModels' for more details
 *  by looking MongoDB Middleware "createPasswordResetToken"
 *  and "pre('save')"
 *
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  // TODO 1) Get admin based on the token
  /*
  The Token provided on the URL is "unhashed", we need to hash
    it, then compare to the hashed version token inside the database
    validate. 
  */
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Finding admin by token & check if the token has expired
  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // TODO 2) If token has not expired, and there is admin, set the new password
  if (!admin) {
    return next(new AppError('Link làm lại Mật Khẩu đã hết hạn', 400));
  }

  // Reset the password
  admin.password = req.body.password;

  // Set token & its expiry to be undefined after using
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;

  // Save the admin, before save it will be Hash&Salt again
  await admin.save();

  // TODO 3) Update changedPasswordAt property for the admin
  // Already did in adminModel, 'pre' save

  // TODO 4) Log the admin in, send JWT
  createSendToken(admin, 200, res);
});

/**
 * This middleware will update the admin password if they provide
 *  their old password. After updating, it grants admin JWT as well
 *  as HASH & SALT their password, then store to the Database
 */
exports.updatePassword = catchAsync(async (req, res, next) => {
  // TODO 1) get admin from collection with the password to be included
  const admin = await Admin.findOne(req.admin._id).select('+password');

  // TODO 2) Check if POSTed current password is correct
  if (
    !(await admin.checkCorrectness(req.body.currentPassword, admin.password))
  ) {
    return next(new AppError('Bạn nhập sai Mật Khẩu hiện tại', 401));
  }
  // TODO 3) If so, update password
  admin.password = req.body.newPassword;
  await admin.save();

  // TODO 4) Change the ChangedPasswordAt
  // Already did with 'pre' save

  // TODO 5) Log admin in, send JWT
  createSendToken(admin, 200, res);
});

/**
 * This middleware will get THIS user information by
 *  attachs the ID they got from user when they
 *  have logged in. It then pass to getUser() middleware for
 *  processing fetch User by ID
 */
exports.getMe = (req, res, next) => {
  req.params.id = req.admin.id;
  next();
};

/**
 * Get a single user record from the database BY ID. This controller leverages
 *  the controllerFactory.js module as a blueprint. If you want more further
 *  actions & controls, consider to build your self or using other controllers
 */
exports.getAdmin = factory.getOne(Admin);
