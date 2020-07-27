import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import './CustomBootstrap.css';
import Loading from '../components/loading/Loading';
import { connect } from 'react-redux';
import { getMeAPI } from '../api/admin.api';
import { action_setAdmin } from '../redux/actions/admin/admin_actions';
const Dashboard = React.lazy(() => import('./dashboard/Dashboard'));
const OrderManagerPage = React.lazy(() =>
  import('../containers/ordermanager/OrderManagerPage')
);
const Nav = React.lazy(() => import('../components/nav/Navbar'));
const DataPage = React.lazy(() =>
  import('../containers/datamanager/DataManagerPage')
);
const StockManager = React.lazy(() => import('./stockmanager/StockManager'));
const FinanceManager = React.lazy(() =>
  import('../containers/financemanager/FinanceManager')
);
const Login = React.lazy(() => import('../containers/login/Login'));
const ProtectedRoute = React.lazy(() =>
  import('../containers/protected/ProtectedRoute')
);

/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = (state) => {
  return {
    admin: state.admin.admin,
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

class App extends Component {
  state = {
    loading: false,
  };

  initialFetch = async () => {
    this.setState({ loading: true });
    //Try to fetch if we have JWT Token stored
    try {
      const respond = await getMeAPI();
      const admin = respond.data.data.data;
      //Set to state to Redux store
      this.props.setAdmin(admin);
    } catch (e) {
    } finally {
      this.setState({ loading: false });
    }
  };

  async componentDidMount() {
    await this.initialFetch();
  }

  render() {
    if (this.state.loading)
      return <Loading title="Đang tải dữ liệu người dùng" />;
    else
      return (
        <Router>
          <Suspense fallback={<Loading title="Đang tải trang..." />}>
            <Switch>
              {!this.props.admin ? (
                <Route path="/login" component={Login} exact />
              ) : null}

              <ProtectedRoute>
                <Nav />
                <Route exact path="/">
                  <Dashboard />
                </Route>

                <Route path="/ordermanager">
                  <OrderManagerPage />
                </Route>

                <Route path="/data" exact>
                  <DataPage />
                </Route>

                <Route path="/stock">
                  <StockManager />
                </Route>

                <Route path="/finance">
                  <FinanceManager />
                </Route>
              </ProtectedRoute>
            </Switch>
          </Suspense>
        </Router>
      );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
