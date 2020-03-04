import React, { Component } from 'react';
import './OrderManagerPage.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import PendingOrder from './pendingorder/PendingOrder';
import CreateOrder from './createorder/CreateOrder';

class OrderManagerPage extends Component {
  CREATE_ORDER_ROUTE = '/admin/ordermanager/createorder';

  render() {
    return (
      <Router>
        <h2 className="text-center">Quản lý đơn hàng</h2>
        {window.location.pathname === '/admin/ordermanager' ? (
          <section className="PendingOrder">
            <PendingOrder
              route={this.props.route}
              onRouteChanged={this.props.onRouteChanged}
            />

            <Link to={this.CREATE_ORDER_ROUTE}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.forceUpdate()}
              >
                Tạo đơn hàng
              </button>
            </Link>
          </section>
        ) : null}

        <Switch>
          <Route path={this.CREATE_ORDER_ROUTE}>
            {window.location.pathname === this.CREATE_ORDER_ROUTE ? (
              <CreateOrder />
            ) : null}
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default OrderManagerPage;
