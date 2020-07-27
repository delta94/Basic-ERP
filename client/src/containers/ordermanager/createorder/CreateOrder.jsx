import React, { useState } from 'react';
import './CreateOrder.css';
import CustomerInfo from './Customer';
import Product from './Product';
import { connect } from 'react-redux';
import { currencyFormatter_VND } from '../../../utils/formatter';
import { createOrderAPI } from '../../../api/order.api';
import { action_changeDescription } from '../../../redux/actions/order/createorder_actions';
import Loading from '../../../components/loading/Loading';

import './CreateOrder.css';

/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = (state) => {
  return {
    order: state.create_order,
    popup: state.create_order.popup,
    products: state.create_order.products,
    description: state.create_order.description,
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
    changeDescription: (text) => dispatch(action_changeDescription(text)),
  };
};

/**
 * Calculate total prices of list of Products
 * @param {*} products
 */
const calcTotal = (products) => {
  return products.reduce((prev, curr) => prev + curr.total, 0);
};

function CreateOrder(props) {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const order = { ...props.order };
    order.total = calcTotal(props.products);
    try {
      await createOrderAPI(order);
      window.location.reload();
    } catch (e) {
    } finally {
      setLoading(true);
    }
  };

  return (
    <React.Fragment>
      <div className="create-order-page container">
        <h3> Tạo đơn hàng </h3>
        <form className="row" onSubmit={onSubmit}>
          <div className="col-8">
            <CustomerInfo />

            {/* Description place */}
            <div className="description-area">
              <label htmlFor="description"> Chú thích </label>
              <textarea
                name="description"
                cols="30"
                rows="5"
                value={props.description}
                onChange={(e) => props.changeDescription(e.target.value)}
                placeholder="Ví dụ gọi điện trước khi giao..."
              ></textarea>
            </div>
            <Product />
          </div>

          <div className="col">
            <div className="checkout_box">
              <h3>Tóm tắt đơn hàng</h3>
              <div className="checkout_summary">
                <ul>
                  {props.products.map((el) => (
                    <div>
                      <li key={el._id}>{el.name}</li>
                      <div className="row">
                        <div className="col-3">
                          <p>SL: {el.quantity * 1}</p>
                        </div>
                        <div className="col">
                          <p>Thành tiền: {currencyFormatter_VND(el.total)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>

              <div className="checkout_total">
                <h5> = {currencyFormatter_VND(calcTotal(props.products))}</h5>
              </div>

              <input
                type="submit"
                className="btn btn-success order-summary"
                value="Tạo đơn"
              />
            </div>
          </div>
        </form>
      </div>

      {loading ? <Loading title="đang nhập đơn" /> : null}
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);
