import React from 'react';
import {
  action_updateProductQuantity,
  action_updateProductTotal,
  action_addProduct
} from '../../../redux/actions/order/createorder_actions';
import { action_setPopup } from '../../../redux/actions/popup_actions';
import { connect } from 'react-redux';
import Search from '../../../components/product/search/Search';
import Create from '../../../components/product/create/Create';
import './Product.css';
import { currencyFormatter_VND } from '../../../utils/formatter';

/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = state => {
  return {
    popup: state.popup,
    products: state.create_order.products
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
    setPopup: popup_name => dispatch(action_setPopup(popup_name)),
    addProduct: product => dispatch(action_addProduct(product)),
    updateProductQuantity: (position, quantity) =>
      dispatch(action_updateProductQuantity(position, quantity)),
    updateProductTotal: (position, total) =>
      dispatch(action_updateProductTotal(position, total))
  };
};

const Product = props => {
  return (
    <div>
      <label> Sản phẩm </label>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => props.setPopup('search_product')}
      >
        Thêm sản phẩm
      </button>

      {props.products.map((el, index) => (
        <div key={el._id} className="product_box">
          <div className="product_info">
            <img src={el.image} alt="" width={50} height={50} />
            <h5>{el.name}</h5>
            <h5>{currencyFormatter_VND(el.sell_price_vnd)}</h5>
          </div>

          <div>
            <input
              type="text"
              className="product_quantity"
              value={el.quantity * 1}
              onChange={e => props.updateProductQuantity(index, e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="product_total"
              value={currencyFormatter_VND(el.total)}
              onChange={e =>
                props.updateProductTotal(
                  index,
                  e.target.value.replace(/,/g, '')
                )
              }
            />
          </div>
        </div>
      ))}

      <Search onSelected={product => props.addProduct(product)} />
      <Create />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
