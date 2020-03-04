import React, { useState } from 'react';
import './CustomerInfo.css';
import PopUp from './popup/PopUp';

function CustomerInfo() {
  const [searchField, changeSearchField] = useState('');
  const [showPopUp, changeShowPopUp] = useState(false);
  return (
    <div>
      <label htmlFor="customer_seach_input"> Tên khách </label>
      <input
        type="text"
        name="customer_seach_input"
        value={searchField}
        onChange={e => changeSearchField(e.target.value)}
      />
      <button
        type="button"
        name="customer_search_button"
        className="btn btn-primary"
        onClick={() => {
          changeShowPopUp(!showPopUp);
        }}
      >
        Tìm kiếm
      </button>

      {showPopUp ? (
        <PopUp
          searchField={searchField}
          closePopUp={() => {
            changeShowPopUp(!showPopUp);
          }}
        />
      ) : null}
    </div>
  );
}

export default CustomerInfo;
