import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { logoutRequestAPI } from '../../api/admin.api';
import { action_setAdmin } from '../../redux/actions/admin/admin_actions';
import { connect } from 'react-redux';
import './Navbar.css';

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

class AdminNav extends Component {
  //Log admin out
  onLogOut = async (e) => {
    e.preventDefault();

    try {
      await logoutRequestAPI();
      this.props.setAdmin(null);
    } catch (e) {
      //ErrorMark #HandleNeeded
    }
  };

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <div className="nav-left">
          <Link className="navbar-brand" to="/">
            Thuỷ - chuyên hàng Úc
          </Link>
          <ul className="navbar-nav travels-nav">
            <div className="nav-item">
              <Link className="nav-link" to="/ordermanager">
                Quản lý đơn hàng
              </Link>
            </div>

            <div className="nav-item">
              <Link className="nav-link" to="/stock">
                Quản lý kho
              </Link>
            </div>

            <div className="nav-item">
              <Link className="nav-link" to="/data">
                Dữ liệu
              </Link>
            </div>

            <div className="nav-item">
              <Link className="nav-link" to="/finance">
                Quản lý tài chính
              </Link>
            </div>
          </ul>
        </div>

        <div className="nav-right">
          <button
            type="button"
            className="btn btn-light"
            onClick={this.onLogOut}
          >
            Đăng xuất
          </button>
        </div>
      </nav>
    );
  }
}

export default connect(null, mapDispatchToProps)(AdminNav);
