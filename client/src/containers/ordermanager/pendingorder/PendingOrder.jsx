import React from 'react';
import './PendingOrder.css';
import { action_loadPendings } from '../../../redux/actions/order/pendings_action';
import { connect } from 'react-redux';
import OrderCard from '../../../components/ordercard/OrderCard';

/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = state => {
  return {
    pendings: state.orders.pendings
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
    setPendings: pendings => dispatch(action_loadPendings(pendings))
  };
};

const PendingOrder = props => {
  return (
    <section>
      <h3>Đơn hàng cần xử lý</h3>
      <div className="pending-group">
        {props.pendings.map((el, index) => (
          <OrderCard key={index} order={el} />
        ))}
      </div>
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PendingOrder);
