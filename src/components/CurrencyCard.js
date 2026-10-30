import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from './Icons';
import { formatDisplayNumber, formatConvertedValue, formatRatePrecision } from '../utils/formatters';

export function CurrencyCard({
  theme,
  type = 'from', // 'from' | 'to'
  currency,
  amount,
  convertedValue,
  rate,
  onOpenPicker,
  onQuickAdd,
  onResetAmount,
  onCardPress,
  isInputActive,
}) {
  const isFrom = type === 'from';
  const displayAmount = isFrom ? formatDisplayNumber(amount) : formatConvertedValue(convertedValue);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: isFrom && isInputActive ? theme.primary : theme.border,
          borderWidth: isFrom && isInputActive ? 1.5 : 1,
        },
      ]}
    >
      {/* Top Bar: Currency Selector & Label */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[styles.selectorBtn, { backgroundColor: theme.surfaceElevated }]}
          onPress={onOpenPicker}
          activeOpacity={0.7}
          accessibilityLabel={`Change ${isFrom ? 'source' : 'target'} currency, current is ${currency?.code}`}
        >
          <Text style={styles.flagEmoji}>{currency?.flag || '🏳️'}</Text>
          <View style={styles.currencyMeta}>
            <View style={styles.codeRow}>
              <Text style={[styles.currencyCode, { color: theme.textPrimary }]}>
                {currency?.code || 'USD'}
              </Text>
              <Icon name="chevron-down" size={14} color={theme.textSecondary} />
            </View>
            <Text
              style={[styles.currencyName, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {currency?.name || 'US Dollar'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* <View style={styles.typeBadge}>
          <Text style={[styles.typeBadgeText, { color: isFrom ? theme.primary : theme.secondary }]}>
            {isFrom ? 'YOU SEND' : 'YOU GET'}
          </Text>
        </View> */}
      </View>

      {/* Main Amount Display */}
      <TouchableOpacity
        style={styles.amountArea}
        onPress={onCardPress}
        activeOpacity={isFrom ? 0.8 : 1}
      >
        <Text
          style={[
            styles.symbolPrefix,
            { color: isFrom ? theme.textSecondary : theme.primaryLight },
          ]}
        >
          {currency?.symbol || ''}
        </Text>
        <View style={styles.valueRow}>
          <Text
            style={[
              styles.amountText,
              { color: isFrom ? theme.textPrimary : theme.primary },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayAmount}
          </Text>
          {isFrom && isInputActive && (
            <View style={[styles.cursor, { backgroundColor: theme.primary }]} />
          )}
        </View>
      </TouchableOpacity>

      {/* Bottom Row: Quick Add buttons for 'from', or Rate Pill for 'to' */}
      {isFrom ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickAddScroll}
        >
          {[10, 50, 100, 500, 1000].map((step) => (
            <TouchableOpacity
              key={step}
              style={[styles.quickChip, { backgroundColor: theme.surfaceElevated }]}
              onPress={() => onQuickAdd(step)}
              activeOpacity={0.65}
            >
              <Text style={[styles.quickChipText, { color: theme.textSecondary }]}>
                +{step}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.quickChip, { backgroundColor: theme.primaryMuted }]}
            onPress={onResetAmount}
            activeOpacity={0.65}
          >
            <Text style={[styles.quickChipText, { color: theme.primary, fontWeight: '700' }]}>
              Clear
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.rateRow}>
          <View style={[styles.ratePill, { backgroundColor: theme.surfaceElevated }]}>
            <Text style={[styles.rateText, { color: theme.textSecondary }]}>
              Rate: <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>
                1 = {formatRatePrecision(rate)} {currency?.code}
              </Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    maxWidth: '75%',
  },
  flagEmoji: {
    fontSize: 26,
    marginRight: 8,
  },
  currencyMeta: {
    flexShrink: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  currencyName: {
    fontSize: 11,
    fontWeight: '500',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  amountArea: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    marginVertical: 4,
  },
  symbolPrefix: {
    fontSize: 22,
    fontWeight: '600',
    marginRight: 6,
    alignSelf: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cursor: {
    width: 2.5,
    height: 30,
    marginLeft: 3,
    borderRadius: 2,
  },
  quickAddScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
  },
  ratePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  rateText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

