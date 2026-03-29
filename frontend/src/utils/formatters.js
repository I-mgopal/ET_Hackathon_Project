// Indian number formatting utilities

export const formatIndianCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  
  const num = Math.round(amount);
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 10000000) {
    // Crores
    return `${sign}₹${(absNum / 10000000).toFixed(2)} Cr`;
  } else if (absNum >= 100000) {
    // Lakhs
    return `${sign}₹${(absNum / 100000).toFixed(2)} L`;
  } else {
    // Thousands
    return `${sign}₹${absNum.toLocaleString('en-IN')}`;
  }
};

export const formatIndianNumber = (num) => {
  if (!num && num !== 0) return '0';
  return Math.round(num).toLocaleString('en-IN');
};

export const formatPercentage = (num) => {
  if (!num && num !== 0) return '0%';
  return `${num.toFixed(2)}%`;
};