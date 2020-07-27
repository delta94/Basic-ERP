import axios from 'axios';

export const crawlProductAPI = async url => {
  const respond = await axios.get('/api/v1/crawler/product', {
    params: {
      url
    }
  });

  //Return respond
  return respond.data.data.data;
};

export const createProductAPI = async new_product => {
  const respond = await axios.post('/api/v1/product', new_product);

  //Return respond
  return respond.data.data.data;
};

export const getAllProductsAPI = async (name = '') => {
  const respond = await axios.get('/api/v1/product', {
    params: {
      name: name !== '' ? name : undefined
    }
  });

  //Return respond
  return respond.data.data.data;
};

export const getToBuyProductsAPI = async () => {
  const respond = await axios.get('/api/v1/product/tobuy');

  //Return respond
  return respond.data.data.data;
};
