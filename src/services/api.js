import { FALLBACK_RATES, FALLBACK_DATE } from '../constants/fallbackRates';
import { StorageService } from './storage';

const PRIMARY_API = 'https://open.er-api.com/v6/latest/USD';
const SECONDARY_API = 'https://api.frankfurter.dev/v1/latest?base=USD';

/**
 * Fetches live exchange rates with timeout and fallback hierarchy:
 * 1. Primary Live API (open.er-api.com)
 * 2. Secondary Live API (frankfurter.dev)
 * 3. Local AsyncStorage Cache
 * 4. Embedded Fallback Rates
 */
export async function fetchExchangeRates() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s network timeout

  try {
    // 1. Attempt Primary API
    const res = await fetch(PRIMARY_API, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        const rates = { ...data.rates, USD: 1.0 };
        const date = data.time_last_update_utc || new Date().toISOString();
        // Save to cache in background
        StorageService.saveRates(rates, date);
        return {
          rates,
          date,
          source: 'live',
        };
      }
    }
  } catch (err) {
    // Timeout or network error, proceed to fallback
    // console.log('Primary API failed, trying fallback...', err.message);
  } finally {
    clearTimeout(timeoutId);
  }

  // 2. Attempt Secondary API
  try {
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 5000);

    const res2 = await fetch(SECONDARY_API, {
      signal: controller2.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId2);

    if (res2.ok) {
      const data2 = await res2.json();
      if (data2 && data2.rates) {
        const rates = { ...data2.rates, USD: 1.0 };
        const date = data2.date || new Date().toISOString();
        StorageService.saveRates(rates, date);
        return {
          rates,
          date,
          source: 'live',
        };
      }
    }
  } catch (err) {
    // Secondary failed
  }

  // 3. Attempt cached rates from local storage
  const cached = await StorageService.loadCachedRates();
  if (cached && cached.rates && Object.keys(cached.rates).length > 0) {
    return {
      rates: cached.rates,
      date: cached.date,
      source: 'cache',
    };
  }

  // 4. Default to bundled fallback rates
  return {
    rates: FALLBACK_RATES,
    date: FALLBACK_DATE,
    source: 'offline',
  };
}

