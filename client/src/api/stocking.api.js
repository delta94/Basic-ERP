import axios from 'axios';

/**
 * {
 *  _id: 0,
 *  inc: 0
 * }
 * @param {*} data
 */
export const importStockAPI = async data => {
  const respond = await axios.post('/api/v1/stock/import', data);

  return respond.data.data.data;
};

export const getStockHistoryAPI = async () => {
  const respond = await axios.get('/api/v1/stock/history');

  return respond.data.data.data;
};
