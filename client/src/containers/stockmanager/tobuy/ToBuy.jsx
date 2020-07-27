import React, { useState, useEffect } from 'react';
import './ToBuy.css';
import { getToBuyProductsAPI } from '../../../api/product.api';
import SmallModal from '../../../components/modal/TopModal';
import ArrowPNG from '../../../assets/img/arrow.png';
import { Link } from 'react-router-dom';
import {
  action_addProduct,
  action_updateProductQuantity
} from '../../../redux/actions/stock/createstock_actions';
import { connect } from 'react-redux';
/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = state => {
  return {
    create_stock: state.create_stock
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
    addProduct: product => dispatch(action_addProduct(product)),
    updateProductQty: (product_pos, qty) =>
      dispatch(action_updateProductQuantity(product_pos, qty))
  };
};

const findProductByID = (_id, findList) => {
  let resultIndex = -1;
  findList.forEach((el, index) => {
    if (_id === el._id) {
      resultIndex = index;
      return;
    }
  });

  return resultIndex;
};

const ToBuy = props => {
  const [toBuyProducts, setToBuyProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [focusProduct, setFocusProduct] = useState({});

  const fetchToBuyProducts = async () => {
    try {
      const records = await getToBuyProductsAPI();
      setToBuyProducts(records);
    } catch (e) {}
  };

  /**
   * When button has been click that stock
   *  has been received
   * @param {} product - product from ToBuy list
   */
  const onToBuyToImportStock = product => {
    const totalPrice =
      Math.round(product.import_qty * product._id.discounted_price * 100) / 100;
    console.log(totalPrice);
    props.addProduct({
      ...product._id,
      total: totalPrice,
      import_qty: product.import_qty
    });
    setShowModal(false);
  };

  useEffect(() => {
    fetchToBuyProducts();
  }, []);

  return (
    <section className="container tobuy-page">
      <div className="tobuy-header">
        <h1>Cần mua</h1>
        <div className="button-group" style={{ height: 50 }}>
          <Link to="/stock/create_stock">
            <button
              id="stock-btn"
              disabled={props.create_stock.products.length === 0}
              style={{ margin: 0, marginRight: 20 }}
            >
              Hoàn tất Nhập Hàng
            </button>
          </Link>

          <img src={ArrowPNG} alt="" height={45} />
        </div>
      </div>

      <div className="tobuy-list">
        {toBuyProducts.map((el, index) => {
          //Position of this product inside create_stock list
          const pos = findProductByID(el._id._id, props.create_stock.products);

          const productInStockList = props.create_stock.products[pos];
          //If already in the list and the total import > tobuy
          if (
            pos >= 0 &&
            productInStockList.import_qty + el._id.stock >= el.tobuy
          )
            return null;
          //If already have stock
          else if (el._id.stock >= el.tobuy) return null;
          else
            return (
              <div key={el._id._id} className="tobuy-box">
                <div className="tobuy-box-content">
                  <div className="tobuy-product-info">
                    <img src={el._id.image} alt="" width={70} height={70} />

                    <div className="tobuy-product-name">
                      <h5>{el._id.name}</h5>
                      <p>Hãng: {el._id.provider}</p>
                    </div>
                  </div>

                  <p className="tobuy-product-price">
                    $A {el._id.discounted_price}
                  </p>
                </div>

                <div className="tobuy-customer">
                  {el.customers.map((customer, index) => (
                    <p key={index}>
                      <span>{customer._id.name}</span> cần {customer.quantity}
                    </p>
                  ))}

                  <strong>Tổng số lượng cần mua: {el.tobuy}</strong>
                  <br />
                  <strong>
                    Tổng số lượng đã nhập:{' '}
                    {(productInStockList?.import_qty | 0) + el._id.stock}/
                    {el.tobuy}
                  </strong>
                  <button
                    className="tobuy-checked-btn btn btn-info"
                    onClick={() => {
                      setShowModal(true);
                      setFocusProduct({ ...el, import_qty: 0 });
                    }}
                  >
                    Nhập hàng
                  </button>
                </div>
              </div>
            );
        })}
      </div>

      <SmallModal
        show={showModal}
        onHide={() => setShowModal(false)}
        header="Nhập hàng đã nhận tại VN"
      >
        <p>Hàng đã về tới Việt Nam, xin nhập số lượng tại đây</p>
        <p>Kiểm tra lại hàng hoá, số lượng trước khi nhập</p>
        <h5>{focusProduct._id?.name}</h5>
        <label htmlFor="">Số lượng: </label>
        <input
          type="text"
          className="form-control"
          style={{ width: 70, display: 'inline-block', marginLeft: 20 }}
          value={focusProduct.import_qty * 1}
          onChange={e => {
            setFocusProduct({
              ...focusProduct,
              import_qty: e.target.value * 1
            });
          }}
        />
        <button
          className="btn btn-success"
          style={{ display: 'block', marginTop: 20 }}
          onClick={() => onToBuyToImportStock(focusProduct)}
        >
          Chấp nhận
        </button>
      </SmallModal>
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ToBuy);
