import React, { Component, Suspense } from 'react';
import './OrderManagerPage.css';
import { Link, Switch, Route } from 'react-router-dom';
import { getAllPendingOrdersAPI } from '../../api/order.api';
import { connect } from 'react-redux';
import { action_setPopup } from '../../redux/actions/popup_actions';
import { action_loadPendings } from '../../redux/actions/order/pendings_action';
import {
  datetimeFormatter,
  currencyFormatter_VND,
} from '../../utils/formatter';
import { timestampDict } from '../../utils/dictionary';
import Loading from '../../components/loading/Loading';
const Order = React.lazy(() => import('./order/Order'));
const CreateOrder = React.lazy(() => import('./createorder/CreateOrder'));

/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = (state) => {
  return {
    popup: state.popup,
    pendings: state.orders.pendings,
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
    setPopup: (popup_name) => dispatch(action_setPopup(popup_name)),
    setPendings: (pendings) => dispatch(action_loadPendings(pendings)),
  };
};

const findFirstOrderInPeriod = (orders_list) => {
  const firstListRef = [];
  const firstListNum = [];
  orders_list.forEach((el, index) => {
    if (!firstListRef.includes(el.finance_ref)) {
      firstListRef.push(el.finance_ref);
      firstListNum.push(index);
    }
  });

  return firstListNum;
};

class OrderManagerPage extends Component {
  state = {
    // Position that is selected
    selectedRecordPos: -1,
  };

  /**
   * Get all pending orders from db
   */
  getAllPendingOrders = async () => {
    const data = await getAllPendingOrdersAPI();
    this.props.setPendings(data);
  };

  async componentDidMount() {
    try {
      await this.getAllPendingOrders();
    } catch (e) {}
  }

  onRowClickHandler = (position) => {
    if (this.state.selectedRecordPos === position)
      this.setState({ selectedRecordPos: -1 });
    else this.setState({ selectedRecordPos: position });
  };

  onUpdateOrder = (order_position, new_order) => {
    // Copy pendings list
    const pendings_new = [...this.props.pendings];

    // Updated with new orders
    pendings_new[order_position] = { ...new_order };

    // Set new pendings
    this.props.setPendings(pendings_new);
  };

  render() {
    return (
      <Suspense fallback={<Loading title="Đang tải trang" />}>
        <Switch>
          <Route path="/ordermanager" exact>
            <div className="container-lg" id="order-manager-page">
              <h2 className="text-center">Quản lý đơn hàng</h2>
              <section className="button-group order-toolkit">
                <div className="left-group">
                  <Link
                    to={
                      '/ordermanager/order/' +
                      this.props.pendings[this.state.selectedRecordPos]?._id
                    }
                  >
                    <button disabled={this.state.selectedRecordPos === -1}>
                      Xem đơn hàng
                    </button>
                  </Link>
                  <button disabled> In đơn hàng </button>
                </div>
                <div className="right-group">
                  <Link to={'/ordermanager/createorder'}>
                    <button type="button" className="">
                      Tạo đơn hàng
                    </button>
                  </Link>
                </div>
              </section>
              <section>
                {/* Table for showing all records */}
                <div className="table-responsive">
                  <table className="table">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col"> Tạo ngày </th>
                        <th scope="col"> Mã đơn </th>
                        <th scope="col"> Họ tên </th>
                        <th scope="col"> Phone </th>
                        <th scope="col"> Trị giá </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.pendings.map((record, position, array) => (
                        <React.Fragment key={record._id}>
                          {/* Indicator the Financial Period */}
                          {findFirstOrderInPeriod(array).includes(position) ? (
                            <tr>
                              <td
                                colSpan={4}
                                style={{
                                  borderRadius: 10,
                                  backgroundColor: '#2a9d8f',
                                  display: 'inline-block',
                                  marginTop: 10,
                                  marginBottom: 10,
                                  padding: 5,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                  color: 'white',
                                }}
                              >
                                Mã tài chính: {record.finance_ref}
                              </td>
                            </tr>
                          ) : null}
                          <tr
                            className={
                              // If is selected
                              this.state.selectedRecordPos === position
                                ? 'table-row-selected'
                                : ''
                            }
                            onClick={() => this.onRowClickHandler(position)}
                          >
                            <td>
                              {datetimeFormatter(
                                record.timestamp[
                                  timestampDict.timestampRoute[record.status]
                                ]
                              )}
                            </td>
                            <td>{record._id}</td>
                            <td>{record.customer.name}</td>
                            <td>{record.customer.phone}</td>
                            <td>{currencyFormatter_VND(record.total)}</td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </Route>

          <Route path="/ordermanager/order/:order_id">
            <Order />
          </Route>

          <Route path="/ordermanager/createorder" exact>
            <CreateOrder />
          </Route>
        </Switch>
      </Suspense>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagerPage);
