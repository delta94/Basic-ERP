import { CHANGE_ROUTE } from './constants';

export const action_onRouteChanged = text =>
  /**
   * We return an object, not a function
   * Actions describe what happened, what will emit, what will return
   *
   * */
  ({
    type: CHANGE_ROUTE,
    payload: text
  });
