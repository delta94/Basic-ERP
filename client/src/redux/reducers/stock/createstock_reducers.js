import {
  ADD_PRODUCT,
  UPDATE_PRODUCT_QUANTITY,
  UPDATE_PRODUCT_TOTAL,
  REMOVE_PRODUCT
} from '../../constants/stock/createstock_constants';

const calcTotal = products => {
  let total = products.reduce((prev, curr) => (curr = prev + curr.total), 0);
  return Math.round(total * 100) / 100;
};

const initialState_createstock = {
  products: [],
  total: 0
};

//This is a reducer - PURE FUNCTION
export const reducer_CreateStock =
  //Action is an object, not a function
  (state = initialState_createstock, action = {}) => {
    switch (action.type) {
      case ADD_PRODUCT: {
        return {
          ...state,
          products: [
            ...state.products,
            {
              ...action.payload,
              import_qty: action.payload.import_qty | 0,
              total: action.payload.total ? action.payload.total : 0
            }
          ],
          total: action.payload.total
            ? Math.round((state.total + action.payload.total) * 100) / 100
            : state.total
        };
      }

      case UPDATE_PRODUCT_QUANTITY: {
        const copy_products = [...state.products];
        const updating_product = copy_products[action.payload.position];
        updating_product.import_qty = action.payload.import_qty;
        updating_product.total =
          action.payload.import_qty * updating_product.discounted_price;

        return {
          ...state,
          products: copy_products,
          total: calcTotal(copy_products)
        };
      }

      case UPDATE_PRODUCT_TOTAL: {
        const copy_products = [...state.products];
        const updating_product = copy_products[action.payload.position];
        updating_product.total = action.payload.total;
        return {
          ...state,
          products: copy_products,
          total: calcTotal(copy_products)
        };
      }

      case REMOVE_PRODUCT: {
        let copy_products = [...state.products];
        copy_products.splice(action.payload, 1);
        return {
          ...state,
          products: copy_products,
          total: calcTotal(copy_products)
        };
      }

      default:
        return state;
    }
  };
