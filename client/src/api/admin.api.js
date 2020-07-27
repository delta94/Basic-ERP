import axios from 'axios';
/**
 * Login Request - API
 * -------
 * This API will send a request to Server with (email, password).
 *  Server will send back a JWT Token as "HttpOnly" cookies, that
 *  React or Browser can't modify. This is a keylocker for authed
 *  route and Cookies will be automatically send to Server in the
 *  future.
 *
 * Password will be hashed with SHA256 by (Orginal Pass + App Secret)
 *  before it will send to the server. So we expect that we never
 *  send a raw plain text password when it reach the Server.
 *
 * @param {String} email - input email
 * @param {String} password - input password
 * @returns {import('axios').AxiosResponse}
 */
export const loginRequestAPI = async (email, password) => {
  /*
  Post email & hash_password to server. They will send back 
    JWT Token as httpOnly cookies. This piece of cookies will be
    automatically sent along with future requests
  */
  const respond = await axios.post('/api/v1/admin/login', {
    email,
    password: password
  });

  //Return a Response from server
  return respond;
};

/**
 * Log out Request - API
 * ------
 * This will send a request to server and server will then
 *  delete a httpOnly token for us
 */
export const logoutRequestAPI = async () => {
  const respond = await axios.post('/api/v1/admin/logout', {});

  //Return a Response from server
  return respond;
};

/**
 * Reset pass Request - API
 * --------
 *
 *
 * @param {String} oldpass - current password
 * @param {String} newpass - new password
 */
export const resetPasswordRequestAPI = async (oldpass, newpass) => {
  const respond = await axios.patch('/api/v1/admin/update_password', {
    currentPassword: oldpass,
    newPassword: newpass
  });

  //Return a Response from server
  return respond;
};

/**
 * Get Me - API (Protected)
 * -----
 * This API will send to Server along with the attached
 *  JWT 'HttpOnly' Cookies for validation. Server will
 *  send back data of this user if JWT is valid.
 *
 * @returns {import('axios').AxiosResponse}
 */
export const getMeAPI = async () => {
  //Fetch user data, and take the respond back
  const respond = await axios.get('/api/v1/admin/me');

  console.log(respond)
  //Return respond
  return respond;
};
