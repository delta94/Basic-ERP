import React from 'react';
import OptionGroup from '../../components/optiongroup/OptionGroup';
import { useState } from 'react';
import CustomerData from './customers/CustomerData';

const dictionary = {
  customer: 'Khách hàng',
  product: 'Sản phẩm',
  transaction: 'Đơn hàng'
};

const DataManagerPage = () => {
  //Position of Category, related to the Dictionary
  const [categoryPos, setCategoryPos] = useState(0);

  /**
   * Function Handler that will route the content
   * based on Customer Data, Product Data or Transaction Data
   */
  const contentRoutingHandler = () => {
    switch (categoryPos) {
      case 0:
        return <CustomerData />;
      default:
        return;
    }
  };

  return (
    <div className="container">
      <h1>Dữ liệu</h1>
      <OptionGroup
        group_type="radio"
        available_options={Object.values(dictionary)}
        value={Object.values(dictionary)[categoryPos]}
        onChosen={new_categoryPos => setCategoryPos(new_categoryPos)}
      />
      {contentRoutingHandler()}
    </div>
  );
};

export default DataManagerPage;
