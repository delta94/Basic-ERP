import React from 'react';
import './Customer.css';
import { action_setCustomer } from '../../../redux/actions/order/createorder_actions';
import { action_setPopup } from '../../../redux/actions/popup_actions';
import { connect } from 'react-redux';
import Search from '../../../components/customer/search/Search';
import Create from '../../../components/customer/create/Create';

/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = state => {
  return {
    customer: state.create_order.customer,
    popup: state.popup
  };
};

/**
 * This method connect Redux action with Component.
 *  Redux will provide an action and when triggered, it will
 *  dispatch this action to the Store & Reducers for handling
 *  changes.
 * @param {*} dispatch - dispatch action to send to the Store
 */
const mapDispatchToProps = dispatch => {
  return {
    setCustomer: customer => dispatch(action_setCustomer(customer)),
    setPopup: popup_name => dispatch(action_setPopup(popup_name))
  };
};

function CustomerInfo(props) {
  return (
    <div>
      <header> Thông tin khách hàng </header>
      <div className="row">
        <div className="col">
          <input
            disabled
            type="text"
            className="form-control"
            placeholder="Điền tên khách hàng"
            name="name"
            value={props.customer.name}
            onChange={e =>
              props.setCustomer({ ...props.customer, name: e.target.value })
            }
          />
        </div>

        <div className="col">
          <button
            type="button"
            name="customer_search_button col"
            className="btn btn-primary"
            onClick={() => props.setPopup('search_customer')}
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      <input
        type="text"
        className="form-control"
        placeholder="Số điện thoại"
        value={props.customer.phone}
        name="phone"
        disabled
      />

      <input
        type="text"
        className="form-control"
        placeholder="Địa chỉ"
        value={props.customer.address}
        name="address"
        disabled
      />

      <Search />
      <Create />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerInfo);
