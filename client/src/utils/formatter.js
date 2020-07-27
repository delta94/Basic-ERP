/**
 * Currency formatter
 */
export const currencyFormatter_VND = number => {
  const formatter = new Intl.NumberFormat('vn-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  });

  const currencyString = formatter.format(number);

  // Eliminate the currency symbol $, đ
  return currencyString;
};

export const currencyFormatter_AUD = number => {
  const formatter = new Intl.NumberFormat('au-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2
  });

  const currencyString = formatter.format(number);

  // Eliminate the currency symbol $, đ
  return currencyString;
};

export const currencyParser = currency_string => {
  let parsed = currency_string.replace(/(,|A\$|₫)/g, '') * 1;

  //Round 2 digit
  parsed = Math.round(parsed * 100) / 100;

  return parsed;
};

// --------------------------------------
export const datetimeFormatter = date_string => {
  if (date_string === '' || !date_string) return;
  const date = new Date(date_string);

  return (
    date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  );
};

export const datetimeParser = date => {};
