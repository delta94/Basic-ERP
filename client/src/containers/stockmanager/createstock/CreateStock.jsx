import React from 'react';
import Search from '../../../components/product/search/Search';
import Create from '../../../components/product/create/Create';
import './CreateStock.css';
import { connect } from 'react-redux';
import { action_setPopup } from '../../../redux/actions/popup_actions';
import { importStockAPI } from '../../../api/stocking.api';
import {
  action_addProduct,
  action_removeProductByPos,
  action_updateProductQuantity,
  action_updateProductTotal,
} from '../../../redux/actions/stock/createstock_actions';
import {
  currencyFormatter_AUD,
  currencyParser,
} from '../../../utils/formatter';
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
    products: state.create_stock.products,
    total: state.create_stock.total,
    create_stock: state.create_stock,
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
    addProduct: (product) => dispatch(action_addProduct(product)),
    updateProductQty: (product_pos, qty) =>
      dispatch(action_updateProductQuantity(product_pos, qty)),
    updateProductTotal: (product_pos, total) =>
      dispatch(action_updateProductTotal(product_pos, total)),
    removeProduct: (product_pos) =>
      dispatch(action_removeProductByPos(product_pos)),
  };
};

const calcTotalProduct = (products) => {
  return products.reduce((prev, curr) => (curr = prev + curr.import_qty), 0);
};

const CreateStock = (props) => {
  /**
   * Handling when click Import Stock button
   */
  const onImportStock = async () => {
    try {
      await importStockAPI(props.create_stock);

      //reload the page
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="create-stock container">
      <h1>Hàng nhập về VN</h1>
      <div className="button-group">
        <button
          className="btn btn-info"
          onClick={() => props.setPopup('search_product')}
          style={{ marginBottom: 10 }}
        >
          Thêm sản phẩm
        </button>
      </div>

      <div className="layout">
        <section className="products-area">
          {props.products.map((el, index) => (
            <div key={el._id} className="product-box">
              <img src={el.image} alt="" width={50} height={50} />
              <div className="product-info">
                <b>{el.name}</b>
                <p>{el.provider}</p>
              </div>

              <input
                type="text"
                value={el.import_qty}
                onChange={(e) =>
                  props.updateProductQty(index, e.target.value * 1)
                }
                style={{ width: 50, height: 25 }}
              />
              <input
                type="text"
                value={currencyFormatter_AUD(el.total)}
                onChange={(e) =>
                  props.updateProductTotal(
                    index,
                    currencyParser(e.target.value)
                  )
                }
                style={{ width: 150, height: 25 }}
              />

              <button
                className="product-dlt-btn"
                onClick={() => props.removeProduct(index)}
              >
                Xoá
              </button>
            </div>
          ))}
        </section>

        <section className="summary">
          <h3>Tóm tắt</h3>
          <div className="row">
            <div className="col-7">
              <h6>Tổng giá trị: </h6>
            </div>
            <div className="col"> {currencyFormatter_AUD(props.total)} </div>
          </div>

          <div className="row">
            <div className="col-7">
              <h6>Tổng các mặt hàng: </h6>
            </div>
            <div className="col"> {props.products?.length} </div>
          </div>

          <div className="row">
            <div className="col-7">
              <h6>Tổng số sản phẩm: </h6>
            </div>
            <div className="col"> {calcTotalProduct(props.products)} </div>
          </div>

          <button className="btn btn-success" onClick={onImportStock}>
            Nhập hàng
          </button>
        </section>
      </div>

      <Search
        onSelected={(product) => {
          // Only add if the product is not in the list
          let found = false;
          props.products.forEach((el) => {
            if (el._id === product._id) {
              found = true;
              return;
            }
          });
          if (!found) props.addProduct(product);
        }}
      />

      <Create />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateStock);
