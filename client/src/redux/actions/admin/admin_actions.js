import { ADMIN_LOADED } from '../../constants/admin/admin_constants';

/**
 *
 * @param {*} admin - Admin loaded from Server
 */
export const action_setAdmin = admin => ({
  type: ADMIN_LOADED,
  payload: admin
});
