import axios from 'axios';

export const createOrderAPI = async order => {
  const respond = await axios.post('/api/v1/order', order);

  //Return respond
  return respond.data.data.data;
};

export const getAllPendingOrdersAPI = async () => {
  const respond = await axios.get('/api/v1/order?status=pending');

  //Return respond
  return respond.data.data.data;
};

export const getOrderByIdAPI = async id => {
  const respond = await axios.get('/api/v1/order/' + id);

  //Return respond
  return respond.data.data.data;
};

export const shipItemAPI = async (order_id, product_id, ship_qty) => {
  const respond = await axios.post('/api/v1/order/' + order_id + '/ship', {
    product_id,
    ship_qty
  });

  //Return respond
  return respond.data.data.data;
};

export const createShipmentAPI = async (order_id, description, total, products_list) => {
  const respond = await axios.post('/api/v1/order/' + order_id + '/ship', {
    description,
    total,
    products: products_list
  });

  //Return respond
  return respond.data.data.data;
}

export const createPaymentAPI = async (order_id, payment_type, total) => {
  console.log('hello');
  const respond = await axios.post('/api/v1/order/' + order_id + '/pay', {
    total,
    payment_type
  });

  console.log(respond);

  //Return respond
  return respond.data.data.data;
}