/**
 * Formats a numeric string or number with standard comma grouping
 */
export function formatDisplayNumber(value) {
  if (value === null || value === undefined || value === '') return '0';
  
  const str = String(value);
  const parts = str.split('.');
  const intPart = parts[0];
  const decPart = parts.length > 1 ? parts[1] : null;

  // Add commas to integer part
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (decPart !== null) {
    return `${formattedInt}.${decPart}`;
  }
  return formattedInt;
}

/**
 * Formats a computed converted amount intelligently
 */
export function formatConvertedValue(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (!num || isNaN(num) || num === 0) return '0.00';

  if (num >= 100000) {
    // Large numbers: 2 decimals maximum
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else if (num >= 1) {
    // Normal fiat ranges: 2 decimals
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else if (num >= 0.0001) {
    // Small fractions: up to 4 decimals
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  } else {
    // Crypto or micro-amounts: up to 8 decimals
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }
}

/**
 * Formats exchange rate with proper precision
 */
export function formatRatePrecision(rate) {
  if (!rate || isNaN(rate)) return '0.00';
  if (rate >= 1000) {
    return rate.toFixed(2);
  }
  if (rate >= 1) {
    return rate.toFixed(4);
  }
  if (rate >= 0.001) {
    return rate.toFixed(6);
  }
  return rate.toFixed(8);
}

/**
 * Formats ISO date or timestamp into clean human readable string
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return 'Recently';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Recently';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recently';
  }
}

