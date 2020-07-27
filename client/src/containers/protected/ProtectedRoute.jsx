import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

/**
 * Redux State --> React Props
 * ---------
 * Redux will provide the states and React Component will consume
 *  it as a props. We need to map it for local use.
 * @param {*} state - Redux state
 */
const mapStateToProps = (state) => {
  return {
    admin: state.admin.admin,
  };
};

const ProtectedRoute = (props) => {
  const { admin } = props;
  return admin !== null ? [...props.children] : <Redirect to="/login" exact />;
};

export default connect(mapStateToProps)(ProtectedRoute);
