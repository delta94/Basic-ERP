import React from 'react';
import './Login.css';
import { loginRequestAPI } from '../../api/admin.api';
import { getMeAPI } from '../../api/admin.api';
import { connect } from 'react-redux';
import { action_setAdmin } from '../../redux/actions/admin/admin_actions';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = (state) => {
  return {
    admin: state.admin,
  };
};

/**
 * This method connect Redux action with Component.
 *  Redux will provide an action and when triggered, it will
 *  dispatch this action to the Store & Reducers for handling
 *  changes.
 * @param {*} dispatch - dispatch action to send to the Store
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setAdmin: (admin) => dispatch(action_setAdmin(admin)),
  };
};

const Login = (props) => {
  //Access Redux states & actions after mapping
  const { setAdmin } = props;
  const history = useHistory();
  //Components local states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');

  /**
   * This handle when button Log In is clicked
   * @param {Event} e
   */
  const onLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      // Login request to server
      let respond = await loginRequestAPI(email, password);

      //If login is authenticated, fetch the Admin info
      //Send a respond to get Me info
      respond = await getMeAPI();

      //Get admin data from respond
      const admin = respond.data.data.data;

      //Set to state to Redux store
      setAdmin(admin);

      //Push back to /
      history.push('/');
    } catch (e) {
      if (!e.response) {
        // setErrorMessage('Có lỗi từ server, xin thử lại lúc khác');
        // setErrorMessage(e + '');
        // toast.error('Có lỗi từ server, xin thử lại lúc khác');
        return;
      }

      switch (e.response.status) {
        case 401:
          // setErrorMessage(e.response.data.message);
          // toast.error(e.response.data.message);
          return;
        case 500:
          // setErrorMessage('Có lỗi từ server, xin thử lại lúc khác');
          // toast.error('Có lỗi từ server, xin thử lại lúc khác');
          return;
        default:
          // setErrorMessage('Có lỗi xảy ra, xin thử lại lúc khác');
          // toast.error('Có lỗi xảy ra, xin thử lại lúc khác');
          return;
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>
      <div className="login-background-2"></div>
      <form className="login-form" onSubmit={onLoginSubmit}>
        <h3 className="text-center">Đăng nhập</h3>
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email-input">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            name="email-input"
            id="email-input"
            placeholder="Điền địa chỉ email"
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password-input">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password-input"
            id="password-input"
            placeholder="Điền mật khẩu"
            required
          />
        </div>

        {/* Button */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary center-block">
            Đăng nhập
          </button>
        </div>

        {/* Sub */}
        {/* <div className="text-center" style={{ padding: 10 }}>
          <p>
            Hoặc liên hệ admin để <span> </span>
            <a
              href="https://bit.ly/2WCVqen"
              target="_blank"
              rel="noopener noreferrer"
            >
              đăng ký
            </a>
          </p>
        </div> */}
      </form>
    </div>
  );
};

//Export with the connection to Redux
export default connect(mapStateToProps, mapDispatchToProps)(Login);
