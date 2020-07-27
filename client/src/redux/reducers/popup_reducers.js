import { CHANGE_POPUP } from '../constants/popup_constants';

const initialState_popup = '';

/**
 * PLEASE USE WITH CARE, AVOID RE-RENDER MULTIPLE TIMES
 * ---------------
 * @param {*} state
 * @param {*} action
 */
export const reducer_Popup =
  //Action is an object, not a function
  (state = initialState_popup, action = {}) => {
    switch (action.type) {
      case CHANGE_POPUP: {
        return action.payload;
      }
      default:
        return state;
    }
  };
