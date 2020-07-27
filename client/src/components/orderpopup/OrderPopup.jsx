import React, { useState } from 'react';
import Modal from '../modal/Modal';
import SmallModal from '../modal/TopModal';
import './OrderPopup.css';
import { shipItemAPI } from '../../api/order.api';
import {
  datetimeFormatter,
  currencyFormatter_VND,
} from '../../utils/formatter';
import { statusDict } from '../../utils/dictionary';
import Loading from '../loading/Loading';

const OrderPopup = (props) => {
  const [showShipModal, setShowShipModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(-1);
  const [loading, setLoading] = useState(false);
  const onShipItemSubmit = async (product_id, ship_qty) => {
    try {
      setLoading(true);
      const order_receipt = await shipItemAPI(
        props.order._id,
        product_id,
        ship_qty
      );
      setShowShipModal(false);

      //Update the latest order with the receipt
      props.onUpdateOrder(order_receipt);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={props.show}
      header={'Mã đơn: ' + props.order._id}
      onHide={props.onHide}
    >
      <div className={'order-popup container ' + props.order.status + '-order'}>
        <div className="row">
          <div className="order-status text-center">
            {statusDict[props.order.status]}
          </div>
        </div>
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
                      value={props.order.customer?.name}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={props.order.customer?.phone}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="">Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={props.order.customer?.address}
                  />
                </div>
              </form>
            </section>
          </div>

          <div className="col">
            <section>
              <header>
                <h3>Các mốc thời gian</h3>
              </header>

              <div className="row order-info-timestamp">
                <div className="col">Đã tạo ngày:</div>

                <div className="col">
                  {datetimeFormatter(props.order.timestamp?.created)}
                </div>
              </div>

              <div className="row order-info-timestamp">
                <div className="col">Đã gởi từ Úc về VN ngày:</div>

                <div className="col order-info-timestamp">
                  {datetimeFormatter(props.order.timestamp?.ausvnshipped)}
                </div>
              </div>

              <div className="row order-info-timestamp">
                <div className="col">VN đã kiểm ngày:</div>

                <div className="col">
                  {datetimeFormatter(props.order.timestamp?.vnchecked)}
                </div>
              </div>

              <div className="row order-info-timestamp">
                <div className="col">Đã giao cho khách ngày</div>

                <div className="col">
                  {datetimeFormatter(props.order.timestamp?.completed)}
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="row">
          <div className="col-6">
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
                value={props.order?.description}
              ></textarea>
            </div>
          </div>
        </section>

        <section>
          <header>
            <h3>Sản phẩm đặt</h3>
          </header>

          <div className="button-group">
            <div>
              <button
                className="btn btn-info"
                onClick={() => {
                  setShowShipModal(true);
                }}
                disabled={selectedRow === -1}
              >
                Ship hàng
              </button>

              <button className="btn btn-warning" disabled={selectedRow === -1}>
                Thâu tiền
              </button>
            </div>
          </div>

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
                <th scope="col"> Đã thu tiền </th>
              </tr>
            </thead>
            <tbody>
              {props.order.products?.map((el, index) => (
                <tr
                  key={el._id._id}
                  onClick={() => {
                    if (selectedRow !== index) setSelectedRow(index);
                    else setSelectedRow(-1);
                  }}
                  style={{ cursor: 'pointer' }}
                  className={selectedRow === index ? 'table-info' : null}
                >
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
                  <td>
                    {el.payed}/{el.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <header></header>
          <div className="row">
            <div className="col-10"></div>
            <div className="col-2">
              <h5> ={currencyFormatter_VND(props.order.total)}</h5>
            </div>
          </div>
        </section>
      </div>

      {selectedRow !== -1 ? (
        <ShipmentModal
          show={showShipModal}
          onHide={() => setShowShipModal(false)}
          product={props.order.products[selectedRow]}
          onShipItemSubmit={(ship_qty) =>
            onShipItemSubmit(
              props.order.products[selectedRow]._id?._id,
              ship_qty
            )
          }
        />
      ) : null}

      {loading ? <Loading title="Đang cập nhật" /> : null}
    </Modal>
  );
};

export default OrderPopup;

const ShipmentModal = (props) => {
  const [ship_qty, setShip_Qty] = useState(0);
  return (
    <SmallModal
      show={props.show}
      onHide={props.onHide}
      header="Nhập số lượng đã ship"
    >
      <p>Nhập số lượng muốn ship, muốn giao cho khách</p>
      <h6>{props.product._id?.name}</h6>
      <label htmlFor="">Số lượng ship: </label>
      <input
        type="text"
        className="form-control"
        style={{ width: 100, display: 'inline-block', marginLeft: 20 }}
        value={ship_qty}
        onChange={(e) => setShip_Qty(e.target.value * 1)}
      />
      <p style={{ display: 'inline-block', fontSize: 25 }}>
        /{props.product.quantity - props.product.shipped}
      </p>

      <button
        className="btn btn-success"
        style={{ display: 'block' }}
        onClick={() => {
          props.onShipItemSubmit(ship_qty);
        }}
      >
        Chấp nhận
      </button>
    </SmallModal>
  );
};
