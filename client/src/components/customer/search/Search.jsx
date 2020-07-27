import React from 'react';
import Modal from '../../modal/Modal';
import { useState, useEffect } from 'react';
import { action_setCustomer } from '../../../redux/actions/order/createorder_actions';
import { action_setPopup } from '../../../redux/actions/popup_actions';
import { getAllCustomersAPI } from '../../../api/customer.api';
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

const Search = props => {
  //Selected record in the table
  const [selectedRecord, setSelectedRecord] = useState({});

  //Customer table data
  const [records, setRecords] = useState([]);

  /**
   *  Action function that called when clicked "Search"
   * @param {Event} event
   */
  const onSearchCustomer = async event => {
    try {
      const records = await getAllCustomersAPI({
        name: props.customer.name
      });

      setRecords(records);
    } catch (e) {
      console.log(e);
    }
  };

  //On popup - first load, search for all possible customers
  useEffect(() => {
    onSearchCustomer();

    // Don't remove below line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      isSelected={Object.keys(selectedRecord).length !== 0}
      show={props.popup === 'search_customer'}
      header={'Tìm kiếm khách hàng'}
      onSuccess={() => {
        props.setCustomer(selectedRecord);
        props.setPopup(''); //get back to the page, close this search popup
      }}
      onHide={() => props.setPopup('')}
    >
      {/* Input that prompts Customer Name */}
      <input
        type="text"
        name="name"
        value={props.customer.name}
        onChange={e =>
          props.setCustomer({ ...props.customer, name: e.target.value })
        }
      />

      {/* Search button */}
      <button className="btn btn-primary" onClick={onSearchCustomer}>
        Tìm kiếm
      </button>

      {/* Create customer button */}
      <button
        className="btn btn-info"
        onClick={() => props.setPopup('create_customer')}
      >
        Tạo khách hàng
      </button>

      {/* Table for showing all records */}
      <div className="table-responsive">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col"> Họ tên </th>
              <th scope="col"> Số Điện thoại </th>
              <th scope="col"> Địa chỉ </th>
            </tr>
          </thead>
          <tbody>
            {records.map((records, index) => (
              <tr
                className={
                  records._id === selectedRecord._id ? 'table-info' : ''
                }
                key={records._id}
                onClick={() => setSelectedRecord(records)}
                style={{ cursor: 'default' }}
              >
                <td>{records.name}</td>
                <td>{records.phone}</td>
                <td>{records.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
