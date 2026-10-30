import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { convertCurrency } from '../utils/calculations';
import { formatConvertedValue } from '../utils/formatters';

export function QuickDenominations({
  theme,
  fromCurrency,
  toCurrency,
  rates,
  onSelectAmount,
}) {
  const steps = [1, 5, 10, 20, 50, 100];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Traveler Cheat Sheet
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Tap any row to set amount
        </Text>
      </View>

      <View style={styles.grid}>
        {steps.map((amount) => {
          const converted = convertCurrency(amount, fromCurrency.code, toCurrency.code, rates);
          return (
            <TouchableOpacity
              key={amount}
              style={[
                styles.rowItem,
                {
                  backgroundColor: theme.surfaceElevated,
                },
              ]}
              onPress={() => onSelectAmount(String(amount))}
              activeOpacity={0.65}
            >
              <Text style={[styles.fromText, { color: theme.textSecondary }]}>
                {fromCurrency.symbol || ''}
                {amount} {fromCurrency.code}
              </Text>
              <Text style={[styles.arrowText, { color: theme.primary }]}>→</Text>
              <Text style={[styles.toText, { color: theme.textPrimary }]}>
                {toCurrency.symbol || ''}
                {formatConvertedValue(converted)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rowItem: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  fromText: {
    fontSize: 12,
    fontWeight: '600',
  },
  arrowText: {
    fontSize: 12,
    fontWeight: '700',
  },
  toText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

