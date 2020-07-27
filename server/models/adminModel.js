const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên người dùng bị thiếu']
  },
  email: {
    type: String,
    required: [true, 'Không tìm thấy email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Không tìm thấy mật khẩu'],
    minlength: 8,
    select: false
  },
  passwordChangedAt: {
    type: Date,
    select: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  salt: {
    type: String,
    select: false
  }
});

/**
 * This middleware generate the Salt & hash the password of admin
 *  before (Update, Create) for better security. If the admin is new,
 *  Salt is generated randomly by using bcrypt.js, otherwise, if admin
 *  already has it, bcrypt.js will then Hash it with the corresponding
 *  Salt.
 */
adminSchema.pre('save', async function (next) {
  // If we not update or create the password, don't do anything
  if (!this.isModified('password')) return next();

  // Generate the salt if it not exists
  if (!this.salt) {
    const salt = await bcrypt.genSalt(10);

    // Attach the salt to the Mongo Document
    this.salt = salt;
  }

  // Hash the password with the salt admin is having
  this.password = await bcrypt.hash(this.password, this.salt);

  next();
});

/**
 * This middleware capture the timestamp when the admin created or
 *  change to a new password
 */
adminSchema.pre('save', async function (next) {
  // If we not update the password or this document is new, don't do anything
  if (!this.isModified('password')) return next();

  // Fix problem that passwordChangedAt expire before login with token
  this.passwordChangedAt = Date.now() - 1000; // Now - 1 minutes
  next();
});

/**
 * This middleware happens before fetching documents, only
 *  fetch those are active. Inactive documents mean it
 *  is deleted or not in use anymore.
 */
adminSchema.pre(/^find/, function (next) {
  // This points to the current query
  this.find({ active: { $ne: false } });
  next();
});

/**
 * This Mongo Method allow to check whether the
 *  provided password (original) with the hashed
 *  password already stored in the database are
 *  the same.
 *
 *  @param {String} candidatePassword - Original String password
 *  @param {String} adminPassword - hashed Password stored in DB
 */
adminSchema.methods.checkCorrectness = async function (
  candidatePassword,
  adminPassword
) {
  // 'This point' to the current password
  return await bcrypt.compare(candidatePassword, adminPassword);
};

/**
 * This MongoDB method will check if recently the admin has changed
 *  their password, but someone still get their JWT Token.
 *
 * E.g Alice does changed her password 1 day. But Sophia still has
 *  Alice's JWT that was signed 3 months ago. Therefore, Sophia JWT
 *  token need to be rejected
 *
 * @param {Number} JWTTimestamp - the time JWT Token was signed (jwt.iat)
 */
adminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // If there exists passwordChangedAt
  if (this.passwordChangedAt) {
    // Convert the Date --> into Milliseconds
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // If JWTTimestamp was signed before the password Changed date
    return JWTTimestamp < changedTimestamp;
  }

  // else return false
  return false;
};

/**
 * This MongoDB method will create reset token when admin forgot their
 *  password. This token will then be attached to the RESET_URL that
 *  will send to admin's email. Admin will need to click this email to
 *  reset their password. The Token also only valid for a period of
 *  time before it expires, then admin will need to create another
 *  RESET_URL
 *
 * E.g Samuel forgot his password. Server will send him a url like
 *  - "/api/v1/auth/reset_password/Fqwzxaskovosmemalxuuesjj"
 *
 *  Which "Fqwzxaskovosmemalxuuesjj" is the RESET_TOKEN. If Samuel
 *  won't click the links in 10 minutes, the RESET_TOKEN is expired
 *  and he won't have the right to reset his password.
 *
 * ------
 * RESET_TOKEN & PasswordResetToken stored in Database is different.
 *  RESET_TOKEN is before hashing, it is a random bytes as HEX. But,
 *  PasswordResetToken is after hashing RESET_TOKEN.
 *
 * When the Admins provide a RESET_TOKEN, we need to hash it again, then
 *  compare to the hashed token stored in the database.
 *
 * In other word, RESET_TOKEN is unhashed, PasswordResetToken is hashed
 *
 */
adminSchema.methods.createPasswordResetToken = function () {
  // Create a random 32 bytes as HEX (unhashed)
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hashing the resetToken with SHA256 as HEX and store to database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 10 min expire
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return the UNHASHED token, we need to hash and compare when have this
  return resetToken;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
