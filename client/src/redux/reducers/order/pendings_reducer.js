import { LOAD_PENDINGS } from '../../constants/order/pendings_constants';

const initialState_pendings = [];

//This is a reducer - PURE FUNCTION
export const reducer_Pendings =
  //Action is an object, not a function
  (state = initialState_pendings, action = {}) => {
    switch (action.type) {
      case LOAD_PENDINGS: {
        return [...action.payload];
      }
      default:
        return state;
    }
  };
