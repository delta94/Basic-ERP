import axios from 'axios';

export const getLatestReportAPI = async () => {
  const respond = await axios.get('/api/v1/finance/latest');

  //Return respond
  return respond.data.data.data;
};

export const endFinancialPeriodAPI = async () => {
  const respond = await axios.post('/api/v1/finance/end');

  //Return respond
  return respond.data.data.data;
};