import React from 'react';
import './OptionButton.css';

const OptionButton = ({ checked, onChecked, children }) => {
  return (
    <div className="option-box">
      <label>
        <input
          type="checkbox"
          value="1"
          checked={checked}
          onChange={onChecked}
        />
        <span>{children}</span>
      </label>
    </div>
  );
};
export default OptionButton;
