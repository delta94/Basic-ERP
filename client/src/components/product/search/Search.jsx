import React from 'react';
import Modal from '../../modal/Modal';
import { useState, useEffect } from 'react';
import { action_setPopup } from '../../../redux/actions/popup_actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getAllProductsAPI,
  getToBuyProductsAPI
} from '../../../api/product.api';
import { currencyFormatter_VND } from '../../../utils/formatter';
import './Search.css';

/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = state => {
  return {
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
    setPopup: popup_name => dispatch(action_setPopup(popup_name))
  };
};

const availableFilter = {
  all: 'Tất cả',
  tobuy: 'Cần mua'
};

const Search = props => {
  const [search, setSearch] = useState('');
  //Selected record in the table
  const [selectedRecord, setSelectedRecord] = useState({});

  const [filterNum, setFilterNum] = useState(0);

  //Customer table data
  const [records, setRecords] = useState([]);

  /**
   *  Action function that called when clicked "Search"
   * @param {Event} event
   */
  const onSearchProduct = async () => {
    try {
      let records;
      switch (filterNum) {
        case 0: {
          records = await getAllProductsAPI(search);
          break;
        }
        case 1: {
          records = await getToBuyProductsAPI();
          records = records.map(el => el._id);
          break;
        }
        default:
          return;
      }

      setRecords(records);
    } catch (e) {
      console.log(e);
    }
  };

  //On popup - first load, search for all possible customers
  useEffect(() => {
    onSearchProduct();

    // Don't remove below line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterNum]);

  return (
    <Modal
      isSelected={Object.keys(selectedRecord).length !== 0}
      show={props.popup === 'search_product'}
      header={'Tìm kiếm sản phẩm'}
      onSuccess={() => {
        props.onSelected(selectedRecord);
        props.setPopup(''); //get back to the page, close this search popup
      }}
      onHide={() => props.setPopup('')}
    >
      {/* Input that prompts Customer Name */}
      <input
        type="text"
        name="name"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Search button */}
      <button className="btn btn-primary" onClick={onSearchProduct}>
        Tìm kiếm
      </button>

      {/* Filter */}
      <div className="dropdown show">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenu2"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {Object.values(availableFilter)[filterNum]}
        </button>

        <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
          {Object.values(availableFilter).map((el, index) => {
            if (index === filterNum) return null;

            return (
              <button
                key={index}
                className="dropdown-item"
                type="button"
                onClick={() => setFilterNum(index)}
              >
                {el}
              </button>
            );
          })}
        </div>
      </div>
      {/* Create customer button */}
      <button
        className="btn btn-info"
        onClick={() => props.setPopup('create_product')}
      >
        Tạo sản phẩm
      </button>

      {/* Table for showing all records */}
      <div className="table-responsive">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col"> Hình ảnh </th>
              <th scope="col"> Nhà cung cấp </th>
              <th scope="col"> Tên sản phẩm </th>
              <th scope="col"> Giá sales (đô Úc) </th>
              <th scope="col"> Giá bán ra (VND) </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                className={
                  record._id === selectedRecord._id ? 'table-info' : ''
                }
                key={record._id}
                onClick={() => setSelectedRecord(record)}
                style={{ cursor: 'default' }}
              >
                <td>
                  <img src={record.image} alt="" width={70} />
                </td>
                <td>{record.provider}</td>
                <td>{record.name}</td>
                <td>{record.discounted_price}</td>
                <td>{currencyFormatter_VND(record.sell_price_vnd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

Search.propTypes = {
  onSelected: PropTypes.func.isRequired //Function on selected
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
