const axios = require('axios');
const https = require('https');
const convert = require('xml-js');

exports.getAUD_VND_rateAPI = async (req, res, next) => {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  // Fetch user data, and take the respond back
  const respond = await axios.get(
    'https://www.vietcombank.com.vn/exchangerates/ExrateXML.aspx',
    {
      httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 ( compatible ) ',
        Accept: '*/*'
      }
    }
  );

  const fx_json = JSON.parse(convert.xml2json(respond.data, { compact: true }));
  fx_json.ExrateList.Exrate = fx_json.ExrateList.Exrate.map(
    (el) => el._attributes
  );
  res.status(200).json({
    status: 'success',
    data: {
      datetime: fx_json.ExrateList.DateTime._text,
      data: fx_json.ExrateList.Exrate
    }
  });
};
