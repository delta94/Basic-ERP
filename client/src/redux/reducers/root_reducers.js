import * as createorder_reducers from './order/createorder_reducers';
import * as pendings_reducers from './order/pendings_reducer';
import * as popup_reducers from './popup_reducers';
import * as createstock_reducers from './stock/createstock_reducers';
import * as finance_reducers from './finance/finance_reducers';
import * as admin_reducers from './admin/admin_reducers';

import { combineReducers } from 'redux';

/**
 * Nesting Order-related reducers
 */
const ordersReducers = combineReducers({
  pendings: pendings_reducers.reducer_Pendings
});

/**
 * Final reducers
 */
const rootReducers = combineReducers({
  create_order: createorder_reducers.reducer_CreateOrder,
  create_stock: createstock_reducers.reducer_CreateStock,
  orders: ordersReducers,
  finance: finance_reducers.reducer_Finance,
  admin: admin_reducers.reducer_Admin,

  //PLEASE USE WITH CARE, AVOID RE-RENDER MULTIPLE TIMES
  popup: popup_reducers.reducer_Popup
});

export default rootReducers;
