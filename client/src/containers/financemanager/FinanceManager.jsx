import React, { useState, useEffect } from 'react';
import Loading from '../../components/loading/Loading';
import { connect } from 'react-redux';
import { action_loadReport } from '../../redux/actions/finance/finance_actions';
import {
  getLatestReportAPI,
  endFinancialPeriodAPI,
} from '../../api/finance.api';
import {
  datetimeFormatter,
  currencyFormatter_AUD,
  currencyFormatter_VND,
} from '../../utils/formatter';
import './FinanceManager.css';

/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = (state) => {
  return {
    report: state.finance,
  };
};

/**
 * This method connect Redux action with Component.
 *  Redux will provide an action and when triggered, it will
 *  dispatch this action to the Store & Reducers for handling
 *  changes.
 * @param {*} dispatch - dispatch action to send to the Store
 */
const mapDispatchToProps = (dispatch) => {
  return {
    loadReport: (report) => dispatch(action_loadReport(report)),
  };
};

const FinanceManager = (props) => {
  const [loading, setLoading] = useState(false);

  const onCloseFinancePeriod = async () => {
    setLoading(true);
    try {
      await endFinancialPeriodAPI();
      window.location.reload();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const loadReport = async () => {
    try {
      const data = await getLatestReportAPI();
      props.loadReport(data);
    } catch (e) {}
  };

  useEffect(() => {
    loadReport();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h1 className="text-center">Quản lý tài chính</h1>
      <div className="button-group">
        <div>
          <button className="btn btn-danger" onClick={onCloseFinancePeriod}>
            Kết thúc kỳ tài chính
          </button>
          <button className="btn btn-info">In báo cáo tài chính</button>
        </div>
      </div>

      <div className="finance-content">
        <div className="finance-info">
          <p>Mã số tài chính: {props.report._id}</p>
          <p>Ngày bắt đầu: {datetimeFormatter(props.report.timestamp.start)}</p>
          <p>Ngày kết thúc: {datetimeFormatter(props.report.timestamp.end)}</p>
        </div>

        <div className="finance-exrate">
          <p>Tỷ giá hôm nay (Vietcombank)</p>
        </div>

        <div className="finance-funds">
          <p>Số vốn đã bỏ</p>
          <p>{currencyFormatter_AUD(props.report.funds_aud)}</p>
        </div>

        <div className="finance-revenues">
          <p>Doanh thu</p>
          <p>
            Hiện tại: {currencyFormatter_VND(props.report.revenues_curr_vnd)}
          </p>
          <p>
            Kết thúc: {currencyFormatter_VND(props.report.revenues_after_vnd)}
          </p>
        </div>

        <div className="finance-orders">
          <p>Tổng số đơn hàng</p>
          <p>{props.report.orders.length}</p>
        </div>

        <div className="finance-stockings">
          <p>Số đợt nhập hàng</p>
          <p>{props.report.stockings.length}</p>
        </div>
      </div>

      {loading ? <Loading title="Đang lấy dữ liệu" /> : null}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FinanceManager);
