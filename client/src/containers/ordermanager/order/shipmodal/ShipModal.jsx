import React, { useState } from 'react';
import Modal from '../../../../components/modal/Modal';
import TopModal from '../../../../components/modal/TopModal';
import { currencyFormatter_VND } from '../../../../utils/formatter';
import Loading from '../../../../components/loading/Loading';
import Alert from 'react-bootstrap/Alert';

const calcTotalShipment = (products) => {
  return products?.reduce(
    (prev, curr) => prev + (curr.ship_qty | 0) * curr._id.sell_price_vnd,
    0
  );
};

const calcTotalProduct = (product) => {
  return (product.ship_qty | 0) * product._id.sell_price_vnd;
};

const ShipModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState(props.shipment);
  const [errorPopUp, setErrorPopUp] = useState({
    isError: false,
    message: '',
  });

  return (
    <Modal
      show={true}
      onHide={() => {
        props.onHide();
      }}
      header="Tạo đợt giao hàng"
      isSelected={true}
      onSuccess={async () => {
        setLoading(true);
        try {
          await props.onShipmentCreated(shipment);
          window.location.reload();
        } catch (e) {
          console.log(e);
          setErrorPopUp({
            isError: true,
            message: 'Kho không đủ',
          });
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="row">
        <div className="col">
          <h3>Ghi chú</h3>
          <div className="description-area">
            <textarea
              name="description"
              cols="30"
              rows="5"
              disabled={props.show.mode === 'view'}
              value={shipment.description}
              onChange={(e) =>
                setShipment({ ...shipment, description: e.target.value })
              }
            ></textarea>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h3>Sản phẩm giao</h3>
        </div>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col"> Hình ảnh </th>
              <th scope="col"> Hãng </th>
              <th scope="col"> Tên </th>
              <th scope="col"> Kho </th>
              <th scope="col"> Số lượng giao </th>
              <th scope="col"> Thành tiền </th>
            </tr>
          </thead>
          <tbody>
            {shipment?.products?.map((el, index) => (
              <tr key={el._id._id}>
                <td style={{ width: 150 }}>
                  <img src={el._id.image} alt="" width={70} />
                </td>
                <td style={{ width: 100 }}>{el._id.provider}</td>
                <td style={{ width: 350 }}>{el._id.name}</td>
                <td>{el._id.stock}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    style={{ display: 'inline-block', width: 50 }}
                    value={el.ship_qty | 0}
                    onChange={(e) => {
                      const shipment_copy = { ...shipment };
                      shipment_copy.products[index].ship_qty =
                        e.target.value * 1;

                      setShipment(shipment_copy);
                    }}
                    disabled={
                      el.quantity - el.shipped <= 0 ||
                      props.show.mode === 'view'
                    }
                  />{' '}
                  {props.show.mode === 'view'
                    ? ''
                    : '/' + (el.quantity - el.shipped)}
                </td>
                <td>{currencyFormatter_VND(calcTotalProduct(el))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row">
        <div className="col">
          <div>
            Tổng giá trị: {'  '}
            <input
              disabled
              value={currencyFormatter_VND(
                calcTotalShipment(shipment.products)
              )}
              className="form-control"
              style={{ display: 'inline-block', width: 200, marginLeft: 20 }}
            />
          </div>
        </div>
      </div>

      {loading ? <Loading title="Đang cập nhật" /> : null}
      {errorPopUp.isError ? (
        <TopModal
          show={true}
          onHide={() =>
            setErrorPopUp({
              isError: false,
              message: '',
            })
          }
        >
          <Alert variant="danger">
            <Alert.Heading>Xảy ra lỗi</Alert.Heading>
            <p>{errorPopUp.message}</p>
          </Alert>
        </TopModal>
      ) : null}
    </Modal>
  );
};

export default ShipModal;
