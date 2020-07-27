import {
  LOAD_REPORT,
} from '../../constants/finance/finance_constants';

/**
 * Action when the Text inside Create Order get changes
 * @param {*} customer - The payload that contains _id, name, phone, address
 */
export const action_loadReport = report => ({
  type: LOAD_REPORT,
  payload: report
});