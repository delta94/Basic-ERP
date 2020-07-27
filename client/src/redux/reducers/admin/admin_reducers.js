import { ADMIN_LOADED, ADMIN_UNLOADED } from '../../constants/admin/admin_constants';

export const initialState_Admin = {
  admin: null
};

export const reducer_Admin = (state = initialState_Admin, action = {}) => {
  switch (action.type) {
    case ADMIN_LOADED:
      return { ...state, admin: action.payload };
    case ADMIN_UNLOADED:
      return { ...state, admin: null };
    default:
      return state;
  }
};
