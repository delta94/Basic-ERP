import {
  ADD_PRODUCT,
  UPDATE_PRODUCT_QUANTITY,
  UPDATE_PRODUCT_TOTAL,
  REMOVE_PRODUCT
} from '../../constants/stock/createstock_constants';

/**
 * Action occurs when a product is added into product list in Create Order
 * @param {*} product - The payload that contains _id, name, provider, sell_price_vnd...
 */
export const action_addProduct = product => ({
  type: ADD_PRODUCT,
  payload: product
});

export const action_updateProductQuantity = (position, import_qty) => ({
  type: UPDATE_PRODUCT_QUANTITY,
  payload: { position, import_qty }
});

export const action_updateProductTotal = (position, total) => ({
  type: UPDATE_PRODUCT_TOTAL,
  payload: { position, total }
});

/**
 *
 * @param {*} product_position - Position in product list
 */
export const action_removeProductByPos = product_position => ({
  type: REMOVE_PRODUCT,
  payload: product_position
});
