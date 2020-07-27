import { LOAD_PENDINGS } from '../../constants/order/pendings_constants';

export const action_loadPendings = pending_orders => ({
  type: LOAD_PENDINGS,
  payload: pending_orders
});
