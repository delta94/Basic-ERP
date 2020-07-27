import axios from 'axios';

/**
 * API - GET ALL CUSTOMER
 * -------
 * This API will return all the records about customer,
 *  it also provides some criteria when searching such as
 *  [name, phone, address]
 * @param {*} param0
 */
export const getAllCustomersAPI = async ({
  name = '',
  phone = '',
  address = ''
}) => {
  //Fetch user data, and take the respond back
  const respond = await axios.get('/api/v1/customer', {
    params: {
      name: name !== '' ? name : undefined,
      phone: phone !== '' ? phone : undefined,
      address: address !== '' ? address : undefined
    }
  });

  //Return respond
  return respond.data.data.data;
};

/**
 * API - CREATE CUSTOMER
 * --------
 * This api call will request server to create a new
 *  customer with provided details
 * @param {*} new_customer - New customer that need to be created
 */
export const createCustomerAPI = async new_customer => {
  //Fetch user data, and take the respond back
  const respond = await axios.post('/api/v1/customer', new_customer);

  //Return respond
  return respond.data.data.data;
};
