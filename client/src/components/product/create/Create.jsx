import React from 'react';
import Modal from '../../modal/Modal';
import { useState } from 'react';
import { action_addProduct } from '../../../redux/actions/order/createorder_actions';
import { action_setPopup } from '../../../redux/actions/popup_actions';
import { connect } from 'react-redux';
import { crawlProductAPI, createProductAPI } from '../../../api/product.api';
import { getAUD_VND_rateAPI } from '../../../api/fx.api';
import { useEffect } from 'react';
import { currencyFormatter_VND, currencyParser } from '../../../utils/formatter';
import Loading from '../../loading/Loading';

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
  };
};

const Create = (props) => {
  /* Create a copy of the customer in Redux Store
    This one only for local use, before it will be submitted.
  */
  const default_form = {
    name: '',
    provider: '',
    retail_price: '',
    discounted_price: '',
    savings: '',
    sell_price_vnd: '',
    image: '',
    url: '',
  };

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(default_form);
  const [fx, setFx] = useState({});

  /* 
    Check if there is a empty fields
   */
  const hasEmptyFields = () => {
    return (
      form.name === '' ||
      form.provider === '' ||
      form.original_price === '' ||
      form.discounted_price === ''
    );
  };

  const getExRate = async () => {
    const data = await getAUD_VND_rateAPI();
    setFx(data);
  };

  useEffect(() => {
    getExRate();
  }, []);

  /**
   * On Submit the Create Form
   */
  const onSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      // await createCustomerAPI(form);
      const data = await createProductAPI(form);
      props.addProduct(data);
      props.setPopup(''); //get back to the page, close this search popup
      setForm(default_form);
    } catch (e) {}
    //Set new customer to the transaction
    // props.setCustomer(form);
  };

  const onCrawl = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
    try {
      const crawl_data = await crawlProductAPI(form.url);

      setForm(crawl_data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  /**
   * Convert AUD to VND, return a number is VND Currency with attached Formatter
   * @param {*} aud
   * @returns Number
   */
  const aud2vnd = (aud) => {
    if (fx.data === undefined) return aud * 1;
    else {
      let sell_rate = fx.data[0].Sell.replace(/,/g, '') * 1;

      return aud * sell_rate;
    }
  };

  const calcProfitVND = () => {
    const fund = aud2vnd(form.discounted_price * 1);
    return form.sell_price_vnd * 1 - fund;
  };

  return (
    <React.Fragment>
      <Modal
        isSelected={!hasEmptyFields()}
        show={props.popup === 'create_product'}
        header={'Tạo sản phẩm'}
        onSuccess={onSubmit}
        onHide={() => {
          props.setPopup('');
          setForm(default_form);
        }}
      >
        <form>
          <div className="row">
            <div className="col-7">
              <div className="form-group">
                <label htmlFor="">
                  Link sản phẩm (Trang web Chemist, Priceline...)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                />
                <button className="btn btn-primary" onClick={onCrawl}>
                  Tìm
                </button>
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="">Hình ảnh</label>
                <img src={form.image} alt="" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-8">
              <div className="form-group">
                <label htmlFor="">Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="">Nhà cung cấp</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.provider}
                  onChange={(e) =>
                    setForm({ ...form, provider: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="">Giá gốc (đô Úc)</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.retail_price}
                  onChange={(e) =>
                    setForm({ ...form, retail_price: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="">Giá sales (đô Úc)</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.discounted_price}
                  onChange={(e) =>
                    setForm({ ...form, discounted_price: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="">Tiết kiệm (đô Úc)</label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={
                    Math.round(
                      (form.retail_price * 1 - form.discounted_price * 1) * 100
                    ) /
                      100 +
                    ''
                  }
                  onChange={(e) =>
                    setForm({ ...form, savings: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="">Giá gốc (tiền Việt VND)</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={currencyFormatter_VND(aud2vnd(form.retail_price * 1))}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="">Giá sales (tiền Việt VND)</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={currencyFormatter_VND(
                    aud2vnd(form.discounted_price * 1)
                  )}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="">Tiết kiệm (tiền Việt VND)</label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={currencyFormatter_VND(
                    aud2vnd(
                      Math.round(
                        (form.retail_price * 1 - form.discounted_price * 1) *
                          100
                      ) / 100
                    )
                  )}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <h3>Giá bán ra tại Việt Nam (VNĐ)</h3>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Giá muốn bán"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  value={currencyFormatter_VND(form.sell_price_vnd)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sell_price_vnd: currencyParser(e.target.value),
                    })
                  }
                />

                <div className="row">
                  <div className="col">
                    <label htmlFor="">Tiền lời (VND)</label>
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      value={currencyFormatter_VND(calcProfitVND())}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <h5>Tỷ giá đô Úc hiện tại (Vietcombank): </h5>
              <table className="table table-dark">
                <thead className="thead-dark">
                  <tr>
                    <th colSpan="2" className="text-center">
                      Ngân hàng thâu mua
                    </th>
                    <th rowSpan="2" className="text-center">
                      Ngân hàng bán ra
                    </th>
                  </tr>

                  <tr>
                    <th className="text-center"> Tiền mặt</th>
                    <th className="text-center"> Chuyển khoản</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">
                      {fx.data !== undefined ? fx?.data[0]?.Buy : null}
                    </td>
                    <td className="text-center">
                      {fx.data !== undefined ? fx?.data[0]?.Transfer : null}
                    </td>
                    <td className="text-center">
                      {fx.data !== undefined ? fx?.data[0]?.Sell : null}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </Modal>
      {loading ? <Loading title="Đang lấy dữ liệu" /> : null}
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
