import React, { useState, useEffect, useCallback } from 'react';
import './Order.css';
import { createShipmentAPI } from '../../../api/order.api';
import {
  datetimeFormatter,
  currencyFormatter_VND,
} from '../../../utils/formatter';
import { statusDict } from '../../../utils/dictionary';
import Loading from '../../../components/loading/Loading';
import { useParams } from 'react-router-dom';
import { getOrderByIdAPI } from '../../../api/order.api';
import _ from 'lodash';
import ShipModal from './shipmodal/ShipModal';
import PrintShip from './printship/PrintShip';
import PayModal from './paymodal/PayModal';

const calcTotalShipment = (products) => {
  return products?.reduce(
    (prev, curr) => prev + (curr.ship_qty | 0) * curr._id.sell_price_vnd,
    0
  );
};

const calcTotalProduct = (product) => {
  return (product.ship_qty | 0) * product._id.sell_price_vnd;
};

const payDict = {
  cash: 'Tiền mặt',
  card: 'Chuyển khoản',
};

const Order = (props) => {
  const [showShipModal, setShowShipModal] = useState({
    show: false,
    mode: 'view',
  });
  const [showPrint, setShowPrint] = useState(false);
  const [showPay, setShowPay] = useState(false);

  const [loading, setLoading] = useState(false);
  const { order_id } = useParams();
  const [order, setOrder] = useState(props.order);
  const [selectedShipmentRow, setSelectedShipmentRow] = useState(-1);
  const [selectedPaymentRow, setSelectedPaymentRow] = useState(-1);
  /**
   * Fetch Order API
   * ----
   * This method is called when there is no order passed
   *  as a props, it will request server for order based
   *  on id provided by URL
   */
  const fetchOrder = useCallback(async () => {
    try {
      const data = await getOrderByIdAPI(order_id);
      setOrder({ ...data });
    } catch (e) {}
  }, [order_id]);

  /**
   * Hooks
   */
  useEffect(() => {
    if (!order) fetchOrder();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOrder, order]);

  /**
   * Create a shipment to server
   * @param {*} shipment_form must formatted as
   *  {
   *    total: 0,
   *    products: [],
   *    description: ''
   *  }
   */
  const onShipmentCreated = async (shipment_form) => {
    // Format the request
    const total = calcTotalShipment(shipment_form.products);
    const formatted_products = shipment_form.products
      .filter((el) => (el.ship_qty | 0) !== 0)
      .map((el) => ({
        _id: el._id._id,
        ship_qty: el.ship_qty,
        total: calcTotalProduct(el),
      }));

    await createShipmentAPI(
      order_id,
      shipment_form.description,
      total,
      formatted_products
    );
  };

  return (
    <div>
      <div className={'order-popup container ' + order?.status + '-order'}>
        <div className="row">
          <div className="col">
            <div className="order-tag order-status text-center">
              {statusDict[order?.status]}
            </div>
          </div>

          <div className="col">
            <div className="order-tag order-id text-center">
              Mã đơn hàng: {order?._id}
            </div>
            <div className="order-tag order-ref text-center">
              Mã tài chính: {order?.finance_ref}
            </div>
          </div>
        </div>

        {/* Customer profile */}
        <div className="row">
          <div className="col">
            <section>
              <header>
                <h3>Thông tin khách hàng</h3>
              </header>
              <form>
                <div className="row">
                  <div className="col">
                    <label htmlFor="">Tên khách hàng</label>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={order?.customer?.name}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={order?.customer?.phone}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="">Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={order?.customer?.address}
                  />
                </div>
              </form>
            </section>
          </div>

          {/* Timestamp section */}
          <div className="col">
            <section>
              <header>
                <h3>Các mốc thời gian</h3>
              </header>

              <div className="row order-info-timestamp">
                <div className="col">Đã tạo ngày:</div>

                <div className="col">
                  {datetimeFormatter(order?.timestamp?.created)}
                </div>
              </div>

              <div className="row order-info-timestamp">
                <div className="col">Đã gởi từ Úc về VN ngày:</div>

                <div className="col order-info-timestamp">
                  {datetimeFormatter(order?.timestamp?.ausvnshipped)}
                </div>
              </div>

              <div className="row order-info-timestamp">
                <div className="col">VN đã kiểm ngày:</div>

                <div className="col">
                  {datetimeFormatter(order?.timestamp?.vnchecked)}
                </div>
              </div>

              <div className="row order-info-timestamp">
                <div className="col">Đã giao cho khách ngày</div>

                <div className="col">
                  {datetimeFormatter(order?.timestamp?.completed)}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Description section */}
        <div className="row">
          <section className="col-6">
            <div>
              <header>
                <h3>Ghi chú</h3>
              </header>

              {/* Description place */}
              <div className="description-area">
                <textarea
                  disabled
                  name="description"
                  cols="30"
                  rows="5"
                  value={order?.description}
                ></textarea>
              </div>
            </div>
          </section>
          <section className="col-6">
            <div>
              <header>
                <h3>Thanh toán</h3>
              </header>

              {/* Payment place */}
              <div>
                <div className="row">
                  <div className="col">
                    <h5>Tổng giá trị đơn:</h5>
                  </div>

                  <div className="col">
                    <h5>{currencyFormatter_VND(order?.total)}</h5>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <h5>Đã trả:</h5>
                  </div>

                  <div className="col">
                    <h5>
                      {currencyFormatter_VND(order?.total - order?.payment_due)}
                    </h5>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <h5>Còn lại:</h5>
                  </div>

                  <div className="col">
                    <h5>{currencyFormatter_VND(order?.payment_due)}</h5>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Products area */}
        <section>
          <header>
            <h3>Sản phẩm đặt</h3>
          </header>

          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col"> Hình ảnh </th>
                <th scope="col"> Hãng </th>
                <th scope="col"> Tên </th>
                <th scope="col"> Số Lượng </th>
                <th scope="col"> Kho </th>
                <th scope="col"> Thành tiền </th>
                <th scope="col"> Vận chuyển</th>
              </tr>
            </thead>
            <tbody>
              {order?.products?.map((el, index) => (
                <tr key={el._id._id}>
                  <td>
                    <img src={el._id.image} alt="" width={70} />
                  </td>
                  <td style={{ width: 100 }}>{el._id.provider}</td>
                  <td style={{ width: 350 }}>{el._id.name}</td>
                  <td>{el.quantity}</td>
                  <td>{el._id.stock}</td>
                  <td>{currencyFormatter_VND(el.total)}</td>
                  <td>
                    {el.shipped}/{el.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Shipment areas */}
        <section>
          <header>
            <h3>Các đợt giao hàng</h3>
          </header>
          <div className="row">
            <div className="col">
              <div className="button-group">
                <div>
                  <button
                    className="btn btn-info"
                    onClick={() => {
                      setShowShipModal({
                        show: true,
                        mode: 'view',
                      });
                    }}
                    disabled={selectedShipmentRow === -1}
                  >
                    Xem đợt hàng
                  </button>

                  <button
                    className="btn btn-secondary"
                    disabled={selectedShipmentRow === -1}
                    onClick={() => setShowPrint(true)}
                  >
                    In hoá đơn
                  </button>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowShipModal({
                      show: true,
                      mode: 'create',
                    });
                  }}
                >
                  Tạo đợt giao hàng
                </button>
              </div>

              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col"> Ngày </th>
                    <th scope="col"> Số mặt hàng </th>
                    <th scope="col"> Số sản phẩm </th>
                    <th scope="col"> Tổng giá trị </th>
                  </tr>
                </thead>
                <tbody>
                  {order?.shipments?.map((el, index) => (
                    <tr
                      key={index}
                      onClick={() => {
                        selectedShipmentRow === index
                          ? setSelectedShipmentRow(-1)
                          : setSelectedShipmentRow(index);
                      }}
                      className={
                        selectedShipmentRow === index
                          ? 'table-row-selected'
                          : ''
                      }
                    >
                      <td>{datetimeFormatter(el.timestamp)}</td>
                      <td>{el.products.length}</td>
                      <td>
                        {el.products.reduce(
                          (prev, curr) => prev + curr.ship_qty,
                          0
                        )}
                      </td>
                      <td>{currencyFormatter_VND(el.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 300 }}>
          <header>
            <h3>Lịch sử thanh toán</h3>
          </header>

          <div className="button-group">
            <div>
              <button
                className="btn btn-danger"
                disabled={selectedPaymentRow === -1}
              >
                Xoá thanh toán
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowPay(true)}
            >
              Tạo thanh toán
            </button>
          </div>

          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col"> Ngày </th>
                <th scope="col"> Phương thức thành toán </th>
                <th scope="col"> Số tiền </th>
              </tr>
            </thead>
            <tbody>
              {order?.payments?.map((el, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    selectedPaymentRow === index
                      ? setSelectedPaymentRow(-1)
                      : setSelectedPaymentRow(index);
                  }}
                  className={
                    selectedPaymentRow === index ? 'table-row-selected' : ''
                  }
                >
                  <td>{datetimeFormatter(el.timestamp)}</td>
                  <td>{payDict[el.payment_type]}</td>
                  <td>{currencyFormatter_VND(el.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Modal pop up for shipment */}
      {showShipModal.show ? (
        <ShipModal
          onHide={() =>
            setShowShipModal({
              show: false,
              mode: 'view',
            })
          }
          show={showShipModal}
          // Shipment data for form
          shipment={
            showShipModal.mode === 'view'
              ? order.shipments[selectedShipmentRow]
              : {
                  total: 0,
                  products: _.cloneDeep(order.products),
                  description: '',
                }
          }
          // On submitting shipment form
          onShipmentCreated={(shipment_form) =>
            onShipmentCreated(shipment_form)
          }
        />
      ) : null}

      {/* Modal pop up for printing shipment */}
      {showPrint ? (
        <PrintShip
          order={order}
          shipment={order.shipments[selectedShipmentRow]}
          onHide={() => setShowPrint(false)}
        />
      ) : null}

      {showPay ? <PayModal onHide={() => setShowPay(false)} /> : null}

      {loading ? <Loading title="Đang cập nhật" /> : null}
    </div>
  );
};

export default Order;
