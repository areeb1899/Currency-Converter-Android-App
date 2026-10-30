import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import { COLORS } from './src/constants/theme';
import { CURRENCIES, CURRENCY_MAP } from './src/constants/currencies';
import { FALLBACK_RATES, FALLBACK_DATE } from './src/constants/fallbackRates';
import { convertCurrency, getExchangeRate, processKeypadInput } from './src/utils/calculations';
import { fetchExchangeRates } from './src/services/api';
import { StorageService } from './src/services/storage';

import { Header } from './src/components/Header';
import { CurrencyCard } from './src/components/CurrencyCard';
import { SwapButton } from './src/components/SwapButton';
import { Keypad } from './src/components/Keypad';
import { QuickDenominations } from './src/components/QuickDenominations';
import { CurrencyPickerModal } from './src/components/CurrencyPickerModal';

export default function App() {
  // Theme State
  const [themeMode, setThemeMode] = useState('dark');
  const isDark = themeMode === 'dark';
  const theme = isDark ? COLORS.dark : COLORS.light;

  // Currency & Rate State
  const [fromCurrency, setFromCurrency] = useState(CURRENCY_MAP.USD || CURRENCIES[0]);
  const [toCurrency, setToCurrency] = useState(CURRENCY_MAP.INR || CURRENCY_MAP.EUR || CURRENCIES[1]);
  const [amount, setAmount] = useState('1');
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [ratesDate, setRatesDate] = useState(FALLBACK_DATE);
  const [ratesSource, setRatesSource] = useState('offline');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // UI State
  const [pickerTarget, setPickerTarget] = useState(null); // 'from' | 'to' | null
  const [isKeypadOpen, setIsKeypadOpen] = useState(true);

  // Initial Data Load (Preferences + Rates)
  useEffect(() => {
    async function initApp() {
      // 1. Load preferences
      const prefs = await StorageService.loadUserPreferences();
      if (prefs.themeMode) setThemeMode(prefs.themeMode);
      if (prefs.fromCurrency && CURRENCY_MAP[prefs.fromCurrency]) {
        setFromCurrency(CURRENCY_MAP[prefs.fromCurrency]);
      }
      if (prefs.toCurrency && CURRENCY_MAP[prefs.toCurrency]) {
        setToCurrency(CURRENCY_MAP[prefs.toCurrency]);
      }
      if (prefs.lastAmount) {
        setAmount(prefs.lastAmount);
      }

      // 2. Fetch live rates (or load cache if offline)
      loadRates();
    }

    initApp();
  }, []);

  const loadRates = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchExchangeRates();
      if (data && data.rates) {
        setRates(data.rates);
        setRatesDate(data.date);
        setRatesSource(data.source);
      }
    } catch (e) {
      console.warn('Failed to load rates:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Reload handler:
   * Whenever reload option is clicked, automatically changes the currency from USD to INR,
   * updates preferences, and refreshes exchange rates.
   */
  const handleReload = async () => {
    const usd = CURRENCY_MAP.USD || CURRENCIES[0];
    const inr = CURRENCY_MAP.INR || CURRENCIES[4];

    setFromCurrency(usd);
    setToCurrency(inr);

    StorageService.saveUserPreferences({
      fromCurrency: 'USD',
      toCurrency: 'INR',
    });

    await loadRates();
  };

  // Conversions
  const convertedValue = useMemo(() => {
    return convertCurrency(amount, fromCurrency.code, toCurrency.code, rates);
  }, [amount, fromCurrency.code, toCurrency.code, rates]);

  const directRate = useMemo(() => {
    return getExchangeRate(fromCurrency.code, toCurrency.code, rates);
  }, [fromCurrency.code, toCurrency.code, rates]);

  // Actions
  const handleToggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setThemeMode(nextTheme);
    StorageService.saveUserPreferences({ themeMode: nextTheme });
  };

  const handleSwapCurrencies = () => {
    const prevFrom = fromCurrency;
    const prevTo = toCurrency;
    setFromCurrency(prevTo);
    setToCurrency(prevFrom);
    StorageService.saveUserPreferences({
      fromCurrency: prevTo.code,
      toCurrency: prevFrom.code,
    });
  };

  const handleKeypadPress = (key) => {
    const nextAmount = processKeypadInput(amount, key);
    setAmount(nextAmount);
    StorageService.saveUserPreferences({ lastAmount: nextAmount });
  };

  const handleQuickAdd = (addition) => {
    const currentNum = parseFloat(amount) || 0;
    const nextAmount = String(currentNum + addition);
    setAmount(nextAmount);
    StorageService.saveUserPreferences({ lastAmount: nextAmount });
  };

  const handleResetAmount = () => {
    setAmount('0');
    StorageService.saveUserPreferences({ lastAmount: '0' });
  };

  const handleSelectFromCurrency = (curr) => {
    setFromCurrency(curr);
    StorageService.saveUserPreferences({ fromCurrency: curr.code });
  };

  const handleSelectToCurrency = (curr) => {
    setToCurrency(curr);
    StorageService.saveUserPreferences({ toCurrency: curr.code });
  };

  const handleOpenPickerFor = (target) => {
    setPickerTarget(target);
  };

  const handlePickerSelect = (curr) => {
    if (pickerTarget === 'from') {
      handleSelectFromCurrency(curr);
    } else if (pickerTarget === 'to') {
      handleSelectToCurrency(curr);
    }
  };

  // Handle auto-hide keypad on scrolling down
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 10 && isKeypadOpen) {
      setIsKeypadOpen(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ExpoStatusBar style={isDark ? 'light' : 'dark'} />
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Top Header */}
      <Header
        theme={theme}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        ratesDate={ratesDate}
        ratesSource={ratesSource}
        isRefreshing={isRefreshing}
        onRefresh={handleReload}
      />

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={() => {
          if (isKeypadOpen) {
            setIsKeypadOpen(false);
          }
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleReload}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* Currency Conversion Cards */}
        <View style={styles.converterSection}>
          <CurrencyCard
            theme={theme}
            type="from"
            currency={fromCurrency}
            amount={amount}
            onOpenPicker={() => handleOpenPickerFor('from')}
            onQuickAdd={handleQuickAdd}
            onResetAmount={handleResetAmount}
            onCardPress={() => setIsKeypadOpen(true)}
            isInputActive={isKeypadOpen}
          />

          <SwapButton theme={theme} onSwap={handleSwapCurrencies} />

          <CurrencyCard
            theme={theme}
            type="to"
            currency={toCurrency}
            convertedValue={convertedValue}
            rate={directRate}
            onOpenPicker={() => handleOpenPickerFor('to')}
          />
        </View>

        {/* Traveler Cheat Sheet Matrix */}
        <QuickDenominations
          theme={theme}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          rates={rates}
          onSelectAmount={(val) => {
            setAmount(val);
            StorageService.saveUserPreferences({ lastAmount: val });
          }}
        />

        {/* Developer Footer Attribution */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Developed by <Text style={[styles.footerAuthor, { color: theme.primary }]}>Areeb Ahmed</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Docked Numeric Keypad with smooth animation */}
      <Keypad theme={theme} onKeyPress={handleKeypadPress} isOpen={isKeypadOpen} />

      {/* Currency Selector Modal */}
      <CurrencyPickerModal
        visible={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelectCurrency={handlePickerSelect}
        selectedCode={
          pickerTarget === 'from'
            ? fromCurrency.code
            : pickerTarget === 'to'
            ? toCurrency.code
            : null
        }
        theme={theme}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 24,
  },
  converterSection: {
    position: 'relative',
    marginBottom: 6,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footerAuthor: {
    fontWeight: '700',
  },
});
