import React from 'react';
import Modal from '../../modal/Modal';
import { useState } from 'react';
import { action_setCustomer } from '../../../redux/actions/order/createorder_actions';
import { action_setPopup } from '../../../redux/actions/popup_actions';
import { createCustomerAPI } from '../../../api/customer.api';
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
    customer: state.create_order.customer,
    popup: state.popup
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
    setCustomer: customer => dispatch(action_setCustomer(customer)),
    setPopup: popup_name => dispatch(action_setPopup(popup_name))
  };
};

const Create = props => {
  /* Create a copy of the customer in Redux Store
    This one only for local use, before it will be submitted.
  */
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: ''
  });

  /* 
    Check if there is a empty fields
   */
  const hasEmptyFields = () => {
    return form.name === '' || form.phone === '' || form.address === '';
  };

  /**
   * On Submit the Create Form
   */
  const onSubmit = async e => {
    if (e) e.preventDefault();

    try {
      const data = await createCustomerAPI(form);
      props.setCustomer(data);
      props.setPopup(''); //get back to the page, close this search popup
    } catch (e) {}
    //Set new customer to the transaction
  };

  return (
    <Modal
      isSelected={!hasEmptyFields()}
      show={props.popup === 'create_customer'}
      header={'Tạo khách hàng'}
      onSuccess={onSubmit}
      onHide={() => props.setPopup('')}
    >
      <form>
        <div className="form-group">
          <label htmlFor="">Tên khách hàng</label>
          <input
            type="text"
            className="form-control"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Số điện thoại</label>
          <input
            type="text"
            className="form-control"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Địa chỉ nhà</label>
          <input
            type="text"
            className="form-control"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
