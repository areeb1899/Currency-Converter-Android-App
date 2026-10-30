import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Icon } from './Icons';
import { CURRENCIES } from '../constants/currencies';
import { getExchangeRate, convertCurrency } from '../utils/calculations';
import { formatRatePrecision, formatConvertedValue } from '../utils/formatters';

export function RatesBoard({
  theme,
  baseCurrency,
  amount,
  rates,
  onSelectCurrency,
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return CURRENCIES;
    const q = search.toLowerCase().trim();
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.symbol && c.symbol.toLowerCase().includes(q))
    );
  }, [search]);

  const renderItem = ({ item }) => {
    if (item.code === baseCurrency.code) return null;

    const rate = getExchangeRate(baseCurrency.code, item.code, rates);
    const converted = convertCurrency(amount, baseCurrency.code, item.code, rates);
    const hasCustomAmount = parseFloat(amount) && parseFloat(amount) !== 1;

    return (
      <TouchableOpacity
        style={[
          styles.rateCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
        onPress={() => onSelectCurrency(item)}
        activeOpacity={0.7}
      >
        <View style={styles.leftCol}>
          <Text style={styles.flag}>{item.flag}</Text>
          <View style={styles.meta}>
            <View style={styles.codeRow}>
              <Text style={[styles.code, { color: theme.textPrimary }]}>
                {item.code}
              </Text>
              <Text style={[styles.symbol, { color: theme.textMuted }]}>
                {item.symbol}
              </Text>
            </View>
            <Text
              style={[styles.name, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <Text style={[styles.rateValue, { color: theme.textPrimary }]}>
            1 {baseCurrency.code} = {formatRatePrecision(rate)}
          </Text>
          {hasCustomAmount && (
            <Text style={[styles.convertedTotal, { color: theme.primary }]}>
              {amount} {baseCurrency.code} = {formatConvertedValue(converted)} {item.symbol}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.surfaceElevated,
            borderColor: theme.border,
          },
        ]}
      >
        <Icon name="search" size={16} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder={`Compare ${baseCurrency.code} with all currencies...`}
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Icon name="close" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Rates FlatList */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={15}
        maxToRenderPerBatch={20}
        windowSize={7}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  listContent: {
    paddingBottom: 20,
    gap: 8,
  },
  rateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 26,
    marginRight: 10,
  },
  meta: {
    flexShrink: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  code: {
    fontSize: 15,
    fontWeight: '700',
  },
  symbol: {
    fontSize: 12,
    fontWeight: '500',
  },
  name: {
    fontSize: 11,
    marginTop: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  rateValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  convertedTotal: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});

