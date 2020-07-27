import {
  CHANGE_CUSTOMER,
  ADD_PRODUCT,
  UPDATE_PRODUCT_QUANTITY,
  UPDATE_PRODUCT_TOTAL,
  CHANGE_DESCRIPTION,
  REMOVE_PRODUCT
} from '../../constants/order/createorder_constants';

const initialState_createorder = {
  customer: {
    _id: '',
    name: '',
    phone: '',
    address: ''
  },
  products: [],
  description: ''
};

//This is a reducer - PURE FUNCTION
export const reducer_CreateOrder =
  //Action is an object, not a function
  (state = initialState_createorder, action = {}) => {
    switch (action.type) {
      case CHANGE_CUSTOMER: {
        return { ...state, customer: { ...action.payload } };
      }

      case ADD_PRODUCT: {
        return {
          ...state,
          products: [
            ...state.products,
            { ...action.payload, quantity: 0, total: 0 }
          ]
        };
      }

      case UPDATE_PRODUCT_QUANTITY: {
        const copy_products = [...state.products];
        const updating_product = copy_products[action.payload.position];
        updating_product.quantity = action.payload.quantity;
        updating_product.total =
          action.payload.quantity * updating_product.sell_price_vnd;
        return {
          ...state,
          products: copy_products
        };
      }

      case UPDATE_PRODUCT_TOTAL: {
        const copy_products = [...state.products];
        const updating_product = copy_products[action.payload.position];
        updating_product.total = action.payload.total;
        return {
          ...state,
          products: copy_products
        };
      }

      case REMOVE_PRODUCT: {
        let copy_products = [...state.products];
        copy_products.splice(action.payload, 1);
        return {
          ...state,
          products: copy_products
        };
      }

      case CHANGE_DESCRIPTION: {
        return {
          ...state,
          description: action.payload
        };
      }

      default:
        return state;
    }
  };
