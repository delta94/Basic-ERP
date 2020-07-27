import React, { useState } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import CreateStock from './createstock/CreateStock';
import ToBuy from './tobuy/ToBuy';
import { getStockHistoryAPI } from '../../api/stocking.api';
import { useEffect } from 'react';
import {
  datetimeFormatter,
  currencyFormatter_AUD,
} from '../../utils/formatter';

const StockManager = () => {
  const [stockHistory, setStockHistory] = useState([]);
  const getStockHistory = async () => {
    try {
      const data = await getStockHistoryAPI();
      setStockHistory(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getStockHistory();
  }, []);

  const calcTotalProducts = (product_arr) => {
    const result = product_arr.reduce(
      (prev, curr) => curr.import_qty + prev,
      0
    );
    return result;
  };

  return (
    <Switch>
      <Route path="/stock" exact>
        <div className="container stock-manager-page">
          <h1>Quản lý kho</h1>
          <div className="button-group">
            <div className="">
              <Link to="/stock/create_stock">
                <button className="btn btn-primary">Nhập hàng về</button>
              </Link>
              <Link to="/stock/tobuy">
                <button className="btn btn-primary">Cần mua</button>
              </Link>
            </div>
          </div>

          <h2>Các đợt nhập hàng</h2>
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Mã</th>
                <th scope="col">Ngày</th>
                <th scope="col">Số mặt hàng</th>
                <th scope="col">Số sản phẩm</th>
                <th scope="col">Trị giá</th>
              </tr>
            </thead>
            <tbody>
              {stockHistory.map((el) => (
                <tr key={el._id}>
                  <td>{el._id}</td>
                  <td>{datetimeFormatter(el.timestamp)}</td>
                  <td>{el.products.length}</td>
                  <td>{calcTotalProducts(el.products)}</td>
                  <td>{currencyFormatter_AUD(el.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Route>

      <Route path="/stock/create_stock" exact>
        <CreateStock />
      </Route>

      <Route path="/stock/tobuy" exact>
        <ToBuy />
      </Route>
    </Switch>
  );
};

export default StockManager;
