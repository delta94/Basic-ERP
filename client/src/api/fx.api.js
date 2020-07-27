import axios from 'axios';

export const getAUD_VND_rateAPI = async () => {
  //Fetch user data, and take the respond back
  const respond = await axios.get('/api/v1/fx');

  //Return respond
  return respond.data.data;
};
