import { CHANGE_ROUTE } from './constants';

const initialState_OrderManagerRoute = {
  route: '/admin/ordermanager'
};

//This is a reducer - PURE FUNCTION
export const reducer_ChangeOrderManagerRoute =
  //Action is an object, not a function
  (state = initialState_OrderManagerRoute, action = {}) => {
    switch (action.type) {
      case CHANGE_ROUTE:
        //Return a NEW state, derived from previous state + New modification (searchField)
        return { ...state, route: action.payload };

      default:
        return state;
    }
  };
