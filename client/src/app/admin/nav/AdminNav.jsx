import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './AdminNav.css';
import OrderManagerPage from '../ordermanager/OrderManagerPage';

class AdminNav extends Component {
  render() {
    return (
      <Router>
        <div className="row">
          <div className="col-3 custom-nav">
            <ul>
              <li>
                <Link to="/admin" onClick={() => this.forceUpdate()}>Trang Chủ</Link>
              </li>
              <li>
                <Link
                  to="/admin/ordermanager"
                  onClick={() => this.forceUpdate()}
                >
                  Quản Lý Đơn Hàng
                </Link>
              </li>
              <li>
                <Link to="/admin/tobuy" onClick={() => this.forceUpdate()}>Cần Mua</Link>
              </li>
              <li>
                <Link to="/admin/data" onClick={() => this.forceUpdate()}>Dữ Liệu</Link>
              </li>
              <li>
                <Link to="/admin/report" onClick={() => this.forceUpdate()}>Báo Cáo</Link>
              </li>
            </ul>
          </div>

          <div className="col-9">
            <Switch>
              <Route path="/admin/ordermanager">
                <OrderManagerPage />
              </Route>
              {/* <Route path="/admin/tobuy"><Users /></Route>
            <Route path="/admin/data"><About /></Route>
            <Route path="/admin/report"><Users /></Route> */}
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default AdminNav;
