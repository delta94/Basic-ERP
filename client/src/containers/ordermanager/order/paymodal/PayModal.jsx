import React, { useState } from 'react';
import SmallModal from '../../../../components/modal/TopModal';
import {
  currencyFormatter_VND,
  currencyParser,
} from '../../../../utils/formatter';
import { createPaymentAPI } from '../../../../api/order.api';
import { useParams } from 'react-router-dom';
import Loading from '../../../../components/loading/Loading';

const payDict = {
  cash: 'Tiền mặt',
  card: 'Chuyển khoản',
};

const PayModal = (props) => {
  const [paymentType, setPaymentType] = useState('cash');
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const { order_id } = useParams();
  const oppositePayType = () => {
    return paymentType === 'cash' ? 'card' : 'cash';
  };

  const onPay = async () => {
    setLoading(true);
    try {
      await createPaymentAPI(order_id, paymentType, paymentTotal);
      props.onHide();
      window.location.reload();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <SmallModal show={true} onHide={props.onHide} header="Tạo thanh toán">
        <div>
          <h5
            style={{ display: 'inline-block', marginRight: 30, marginTop: 30 }}
          >
            Số tiền
          </h5>
          <input
            type="text"
            className="form-control"
            style={{ display: 'inline-block', width: 130 }}
            value={currencyFormatter_VND(paymentTotal)}
            onChange={(e) => setPaymentTotal(currencyParser(e.target.value))}
          />

          {/* Dropdown payment type */}
          <div
            className="dropdown"
            style={{ display: 'inline-block', marginLeft: 10 }}
          >
            <button
              className="btn btn-danger dropdown-toggle"
              type="button"
              id="dropdownMenu2"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {payDict[paymentType]}
            </button>

            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setPaymentType(oppositePayType())}
              >
                {payDict[oppositePayType()]}
              </button>
            </div>
          </div>
        </div>

        <button
          className="btn btn-success"
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 20,
          }}
          disabled={paymentTotal === 0}
          onClick={async () => await onPay()}
        >
          Chấp nhận
        </button>
      </SmallModal>

      {loading ? <Loading title="Đang tạo thanh toán" /> : null}
    </React.Fragment>
  );
};

export default PayModal;
