import React, { useState } from 'react';
import { statusDict, timestampDict } from '../../utils/dictionary';
import {
  currencyFormatter_VND,
  datetimeFormatter
} from '../../utils/formatter';
import './OrderCard.css';
import OrderPopup from '../orderpopup/OrderPopup';

const OrderCard = props => {
  const [showModal, setShowModal] = useState(false);

  const order = props.order;
  return (
    <div className={'order ' + order.status + '-order'}>
      <div className="order-id text-center">Mã đơn: {order._id}</div>
      <div className="order-status text-center">{statusDict[order.status]}</div>
      <div className="order-timpstamp text-center">
        {timestampDict.timestampText[order.status]}:
        <span>
          {' '}
          <b>
            {datetimeFormatter(
              order.timestamp[timestampDict.timestampRoute[order.status]]
            )}
          </b>
        </span>
      </div>
      <div className="order-info">
        <div>{order.customer.name}</div>
        <div>{order.customer.phone}</div>

        <div>{currencyFormatter_VND(order.total)} VND</div>
      </div>

      <div className="order-info-button">
        <button className="info-button" onClick={() => setShowModal(true)}>
          <div className="info-button-img"></div>
        </button>
      </div>

      <OrderPopup
        order={order}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </div>
  );
};

export default OrderCard;
