import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { convertCurrency, getExchangeRate } from '../utils/calculations';
import { formatConvertedValue, formatRatePrecision } from '../utils/formatters';
import { Icon } from './Icons';

export function QuickDenominations({
  theme,
  fromCurrency,
  toCurrency,
  rates,
  onSelectAmount,
  fullScreen = false,
  onSwap,
}) {
  const [reverseMode, setReverseMode] = useState(false);

  const activeFrom = reverseMode ? toCurrency : fromCurrency;
  const activeTo = reverseMode ? fromCurrency : toCurrency;

  const steps = fullScreen
    ? [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]
    : [1, 5, 10, 20, 50, 100];

  const rate = getExchangeRate(activeFrom.code, activeTo.code, rates);

  const content = (
    <View
      style={[
        fullScreen ? styles.fullContainer : styles.cardContainer,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Traveler Cheat Sheet
          </Text>
          <Text style={[styles.rateSubtitle, { color: theme.textSecondary }]}>
            1 {activeFrom.code} = {formatRatePrecision(rate)} {activeTo.code}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.flipBtn, { backgroundColor: theme.surfaceElevated }]}
          onPress={() => setReverseMode((prev) => !prev)}
          activeOpacity={0.7}
          accessibilityLabel="Flip denomination direction"
        >
          <Icon name="swap" size={14} color={theme.textPrimary} />
          <Text style={[styles.flipBtnText, { color: theme.textSecondary }]}>
            Flip
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {steps.map((amount) => {
          const converted = convertCurrency(amount, activeFrom.code, activeTo.code, rates);
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
                {activeFrom.symbol || ''}
                {amount} {activeFrom.code}
              </Text>
              <Text style={[styles.arrowText, { color: theme.primary }]}>→</Text>
              <Text style={[styles.toText, { color: theme.textPrimary }]}>
                {activeTo.symbol || ''}
                {formatConvertedValue(converted)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  if (fullScreen) {
    return (
      <ScrollView
        style={styles.fullScreenScroll}
        contentContainerStyle={styles.fullScreenScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  fullContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  fullScreenScroll: {
    flex: 1,
  },
  fullScreenScrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  rateSubtitle: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  flipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  flipBtnText: {
    fontSize: 11,
    fontWeight: '600',
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
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
