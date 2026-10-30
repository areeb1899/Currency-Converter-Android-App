/**
 * Calculates conversion between two currencies based on exchange rates against USD
 * @param {number|string} amount
 * @param {string} fromCode
 * @param {string} toCode
 * @param {Object} rates (map of currency code to USD rate)
 * @returns {number}
 */
export function convertCurrency(amount, fromCode, toCode, rates) {
  const numericAmount = parseFloat(amount) || 0;
  if (numericAmount === 0 || !rates) return 0;
  if (fromCode === toCode) return numericAmount;

  const rateFrom = rates[fromCode];
  const rateTo = rates[toCode];

  if (!rateFrom || !rateTo) return 0;

  // Amount in USD = amount / rateFrom
  // Target amount = (amount / rateFrom) * rateTo
  return (numericAmount / rateFrom) * rateTo;
}

/**
 * Returns the direct exchange rate from one currency to another (1 from = X to)
 */
export function getExchangeRate(fromCode, toCode, rates) {
  if (!rates) return 1;
  if (fromCode === toCode) return 1;
  const rateFrom = rates[fromCode];
  const rateTo = rates[toCode];
  if (!rateFrom || !rateTo) return 1;
  return rateTo / rateFrom;
}

/**
 * Sanitizes and handles numeric keypad updates
 * @param {string} currentVal
 * @param {string} action (a digit '0'-'9', '.', 'DEL', or 'CLEAR')
 * @returns {string}
 */
export function processKeypadInput(currentVal, action) {
  if (action === 'CLEAR') {
    return '0';
  }

  if (action === 'DEL') {
    if (!currentVal || currentVal.length <= 1 || currentVal === '0') {
      return '0';
    }
    return currentVal.slice(0, -1);
  }

  // Prevent excess length (e.g., max 12 digits to prevent overflow)
  if (currentVal.replace(/[^0-9]/g, '').length >= 12 && action !== '.') {
    return currentVal;
  }

  if (action === '.') {
    if (currentVal.includes('.')) {
      return currentVal;
    }
    return currentVal + '.';
  }

  if (action === '00') {
    if (currentVal === '0') return '0';
    return currentVal + '00';
  }

  if (currentVal === '0') {
    return action;
  }

  return currentVal + action;
}

