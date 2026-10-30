import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

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
import { RatesBoard } from './src/components/RatesBoard';
import { NavigationBar } from './src/components/NavigationBar';
import { CurrencyPickerModal } from './src/components/CurrencyPickerModal';

function MainApp() {
  const insets = useSafeAreaInsets();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('converter'); // 'converter' | 'cheatsheet' | 'rates'

  // Theme State
  const [themeMode, setThemeMode] = useState('dark');
  const isDark = themeMode === 'dark';
  const theme = isDark ? COLORS.dark : COLORS.light;

  // Currency & Rate State
  const [fromCurrency, setFromCurrency] = useState(CURRENCY_MAP.USD || CURRENCIES[0]);
  const [toCurrency, setToCurrency] = useState(CURRENCY_MAP.INR || CURRENCIES[4]);
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

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab !== 'converter') {
      setIsKeypadOpen(false);
    }
  };

  return (
    <View
      style={[
        styles.fullScreenRoot,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <ExpoStatusBar style={isDark ? 'light' : 'dark'} translucent />
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
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

      {/* Content Area Based on Active Navigation Tab */}
      <View style={styles.bodyContainer}>
        {activeTab === 'converter' && (
          <View style={styles.tabViewWrapper}>
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

              {/* Traveler Cheat Sheet Matrix Preview */}
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
                  Developed by <Text style={[styles.footerAuthor, { color: theme.primary }]}>Areeb Ahmed</Text> • v1.1
                </Text>
              </View>
            </ScrollView>

            {/* Docked Numeric Keypad with smooth animation */}
            <Keypad theme={theme} onKeyPress={handleKeypadPress} isOpen={isKeypadOpen} />
          </View>
        )}

        {activeTab === 'cheatsheet' && (
          <View style={styles.tabViewWrapper}>
            <QuickDenominations
              theme={theme}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              rates={rates}
              fullScreen={true}
              onSelectAmount={(val) => {
                setAmount(val);
                StorageService.saveUserPreferences({ lastAmount: val });
                setActiveTab('converter');
              }}
              onSwap={handleSwapCurrencies}
            />
          </View>
        )}

        {activeTab === 'rates' && (
          <View style={styles.tabViewWrapper}>
            <RatesBoard
              theme={theme}
              baseCurrency={fromCurrency}
              amount={amount}
              rates={rates}
              onSelectCurrency={(selected) => {
                setToCurrency(selected);
                StorageService.saveUserPreferences({ toCurrency: selected.code });
                setActiveTab('converter');
              }}
            />
          </View>
        )}
      </View>

      {/* Full-Screen Edge-to-Edge Navigation Bar */}
      <NavigationBar
        theme={theme}
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        bottomInset={insets.bottom}
      />

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
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fullScreenRoot: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
  },
  tabViewWrapper: {
    flex: 1,
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
