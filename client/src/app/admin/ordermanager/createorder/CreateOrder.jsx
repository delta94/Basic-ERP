import React, { useState } from 'react';
import './CreateOrder.css';
import PopUp from './customerinfo/popup/PopUp';
import CustomerInfo from './customerinfo/CustomerInfo';

function CreateOrder() {
  return (
    <div>
      <h3> Tạo đơn hàng </h3>
      <div className="row">
        <div className="col-6">
          <CustomerInfo />

          <div className="create_order--products">
            <label> Sản phẩm </label>
            <button type="button" className="btn btn-primary">
              Thêm sản phẩm
            </button>
          </div>
        </div>

        <div className="col-6">
          <div className="box"></div>
        </div>
      </div>
    </div>
  );
}

export default CreateOrder;
