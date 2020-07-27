import {
  CHANGE_CUSTOMER,
  ADD_PRODUCT,
  UPDATE_PRODUCT_QUANTITY,
  UPDATE_PRODUCT_TOTAL,
  CHANGE_DESCRIPTION,
  REMOVE_PRODUCT
} from '../../constants/order/createorder_constants';

/**
 * Action when the Text inside Create Order get changes
 * @param {*} customer - The payload that contains _id, name, phone, address
 */
export const action_setCustomer = customer => ({
  type: CHANGE_CUSTOMER,
  payload: customer
});

/**
 * Action occurs when a product is added into product list in Create Order
 * @param {*} product - The payload that contains _id, name, provider, sell_price_vnd...
 */
export const action_addProduct = product => ({
  type: ADD_PRODUCT,
  payload: product
});

/**
 *
 * @param {*} product_position - Position in product list
 */
export const action_removeProductByPos = product_position => ({
  type: REMOVE_PRODUCT,
  payload: product_position
});

export const action_updateProductQuantity = (position, quantity) => ({
  type: UPDATE_PRODUCT_QUANTITY,
  payload: { position, quantity }
});

export const action_updateProductTotal = (position, total) => ({
  type: UPDATE_PRODUCT_TOTAL,
  payload: { position, total }
});

export const action_changeDescription = description => ({
  type: CHANGE_DESCRIPTION,
  payload: description
});
