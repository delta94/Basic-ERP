const AppError = require('../utils/appError');

/**
 * Token Invalid Error - JWT (prod)
 * ---
 * This error handler is used in production env, that handles
 *  when JWT token errors are raised. It is because the token
 *  are invalid or fail validation from JWT.
 *
 * Send user back StatusCode 401 - Unauthorised
 * @param {*} err - Instance of AppError
 */
const handleJWTError = (err) =>
  new AppError('Không thể xác thực phiên đăng nhập. Xin đăng nhập lại', 401);

/**
 * Token Expired Error - JWT (prod)
 * ---
 * This error handler is used in production env, that handles
 *  when JWT token has been expired. User now need to log-in
 *  again to acquire a new token
 *
 * Send user back StatusCode 401 - Unauthorised
 * @param {*} err - Instance of AppError
 */
const handleJWTExpiredError = (err) =>
  new AppError('Phiên đăng nhập của bạn đã hết hạn', 401);

/**
 * Cast to Object Error - DB (prod)
 * ---
 * This error handler is used in production env, that handles
 *  when the MongoDB couldn't cast the provided value into
 *  schema.
 *
 *  E.g  MongoDB Id is special, if you provide a wrong formatted
 *  ID, MongoDB cannot understand neither cast it into ObjectID
 *
 * Send user back StatusCode 400 - Bad Request
 * @param {*} err - Instance of AppError
 */
const handleCastErrorDB = (err) => {
  const message = `Không đúng ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Key Duplication - DB (prod)
 * ---
 * This error handler is used in production env, that handles
 *  when there exist a record that has the same key as provided
 *  one.
 *
 *  E.g  email = "Test11@gmail.com" already exists
 *
 * Send user back StatusCode 400 - Bad Request
 * @param {*} err - Instance of AppError
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Dữ liệu tồn tại: ${value}. Xin điền giá trị khác!`;
  return new AppError(message, 400);
};

/**
 * Validation Failed - DB (prod)
 * ---
 * This error handler is used in production env, that handles
 *  when the provided payload failed to be validated by DB.
 *  Provided input should meet all the requirements when being
 *  stored in the Database.
 *
 *  E.g  email = "Test11@" is wrong formatted, and will be rejected
 *
 * Send user back StatusCode 400 - Bad Request
 * @param {*} err - Instance of AppError
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Dữ liệu nhập không đúng định dạng: ${errors}`;
  return new AppError(message, 400);
};

/**
 * This method send an error response to the client
 *  in development environment. We will give as much
 *  details of error as we can to debug
 *
 * @param {*} err Instance of AppError
 * @param {*} res Instance of Response of ExpressJS
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

/**
 * This method send an error response to the client
 *  in production environment. We never give users too
 *  much details about our errors.
 *
 * Recommend to use Error Controllers as written to
 *  prepare for this
 * @param {*} err Instance of AppError
 * @param {*} res Instance of Response of ExpressJS
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error
  } else {
    // Log to the console, but not to the client
    console.error('*****ERROR*****\n', err);

    res.status(500).json({
      status: 'error',
      message: 'Có lỗi xảy ra'
    });
  }
};

/**
 * Main method that handles the Error and send back to client end.
 *  It will distinguish between whether a production env or development env.
 *  If it is dev env, send the as much as details of error for users & developers
 *  for debugging. Otherwise, if production env, only send appropriate error message.
 *
 *  Please consider to use Error Controllers as provided to prepare for this.
 */
module.exports = (error, req, res, next) => {
  // If is not defined, take a default value
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    console.log(error);
    sendErrorDev(error, res);
  }
  // Only send error handlers in production env, that we already customed the message
  else if (process.env.NODE_ENV === 'production') {
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    else if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    else if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    else if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    else if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    // Send back production error when all is handled
    sendErrorProd(error, res);
  }
};
