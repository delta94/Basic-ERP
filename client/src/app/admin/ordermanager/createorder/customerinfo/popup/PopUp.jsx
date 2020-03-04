import React, { useState, useEffect } from 'react';
import './PopUp.css';
import axios from 'axios';

const fetchCustomersAPI = search => {
  let paramsString = '';

  //Check whether search with phone or name
  search.startsWith('0') ? (paramsString = 'phone=') : (paramsString = 'name=');
  paramsString += search;

  axios.get('/api/v1/customer?' + paramsString);
};

function Popup(props) {
  const [name, nameChanged] = useState(props.searchField);

  useEffect(() => console.log('mounted'), []);

  return (
    <div className="popup">
      <div className="popup_inner">
        <h1>{props.text}</h1>

        <input
          type="text"
          value={name}
          onChange={e => nameChanged(e.target.value)}
        />
        <button onClick={props.closePopUp}>close me</button>
      </div>
    </div>
  );
}

export default Popup;
