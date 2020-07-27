import { CHANGE_POPUP } from '../constants/popup_constants';

/**
 * PLEASE USE WITH CARE, AVOID RE-RENDER MULTIPLE TIMES
 * ---------------
 * Action occurs when additional popup is needed to show,
 *  there are many kinds of popup, such as "Create Customer",
 *  "Search Customer", "Create Products", "Search Products",...
 *
 * These kinds of popups will handle each tasks and all of these
 *  will be controlled under this action inside the Create Order Page
 *
 * *Only use when there are only one single main Components, otherwise
 *  it will trigger rendering for all components*
 * @param {*} popup_name
 */
export const action_setPopup = popup_name => ({
  type: CHANGE_POPUP,
  payload: popup_name
});
