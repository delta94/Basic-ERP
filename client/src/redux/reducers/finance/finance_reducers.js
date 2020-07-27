import {
  LOAD_REPORT
} from '../../constants/finance/finance_constants';

const initialState_finance = {
  timestamp: {
    start: "",
    end: ""
  },
  orders: [],
  stockings: [],
  expenses: [],
  _id: "",
  revenues_curr_vnd: 0,
  revenues_after_vnd: 0,
  funds_aud: 0
};

//This is a reducer - PURE FUNCTION
export const reducer_Finance =
  //Action is an object, not a function
  (state = initialState_finance, action = {}) => {
    switch (action.type) {
      case LOAD_REPORT: {
        return {
          ...state,
          ...action.payload
        };
      }

      default:
        return state;
    }
  };
