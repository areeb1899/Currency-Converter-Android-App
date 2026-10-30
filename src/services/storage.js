import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  RATES: '@currency_rates_cache_v1',
  RATES_DATE: '@currency_rates_date_v1',
  FROM_CURRENCY: '@currency_from_v1',
  TO_CURRENCY: '@currency_to_v1',
  WATCHLIST: '@currency_watchlist_v1',
  THEME_MODE: '@currency_theme_mode_v1',
  LAST_AMOUNT: '@currency_last_amount_v1',
};

export const StorageService = {
  async saveRates(rates, date) {
    try {
      await AsyncStorage.multiSet([
        [KEYS.RATES, JSON.stringify(rates)],
        [KEYS.RATES_DATE, date || new Date().toISOString()],
      ]);
    } catch (e) {
      console.warn('Error saving rates cache:', e);
    }
  },

  async loadCachedRates() {
    try {
      const items = await AsyncStorage.multiGet([KEYS.RATES, KEYS.RATES_DATE]);
      const ratesStr = items[0][1];
      const dateStr = items[1][1];
      return {
        rates: ratesStr ? JSON.parse(ratesStr) : null,
        date: dateStr || null,
      };
    } catch (e) {
      console.warn('Error loading cached rates:', e);
      return { rates: null, date: null };
    }
  },

  async saveUserPreferences({ fromCurrency, toCurrency, watchlist, themeMode, lastAmount }) {
    try {
      const pairs = [];
      if (fromCurrency) pairs.push([KEYS.FROM_CURRENCY, fromCurrency]);
      if (toCurrency) pairs.push([KEYS.TO_CURRENCY, toCurrency]);
      if (watchlist) pairs.push([KEYS.WATCHLIST, JSON.stringify(watchlist)]);
      if (themeMode) pairs.push([KEYS.THEME_MODE, themeMode]);
      if (lastAmount) pairs.push([KEYS.LAST_AMOUNT, lastAmount]);

      if (pairs.length > 0) {
        await AsyncStorage.multiSet(pairs);
      }
    } catch (e) {
      console.warn('Error saving preferences:', e);
    }
  },

  async loadUserPreferences() {
    try {
      const items = await AsyncStorage.multiGet([
        KEYS.FROM_CURRENCY,
        KEYS.TO_CURRENCY,
        KEYS.WATCHLIST,
        KEYS.THEME_MODE,
        KEYS.LAST_AMOUNT,
      ]);

      return {
        fromCurrency: items[0][1] || 'USD',
        toCurrency: items[1][1] || 'EUR',
        watchlist: items[2][1] ? JSON.parse(items[2][1]) : null,
        themeMode: items[3][1] || 'dark',
        lastAmount: items[4][1] || '1',
      };
    } catch (e) {
      console.warn('Error loading preferences:', e);
      return {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        watchlist: null,
        themeMode: 'dark',
        lastAmount: '1',
      };
    }
  },
};

