import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Icon } from './Icons';
import { CURRENCIES } from '../constants/currencies';

export function CurrencyPickerModal({
  visible,
  onClose,
  onSelectCurrency,
  selectedCode,
  theme,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery.trim()) {
      return CURRENCIES;
    }
    const q = searchQuery.toLowerCase().trim();
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.symbol && c.symbol.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSelect = (currency) => {
    onSelectCurrency(currency);
    setSearchQuery('');
    onClose();
  };

  const renderItem = ({ item }) => {
    const isSelected = item.code === selectedCode;

    return (
      <TouchableOpacity
        style={[
          styles.itemRow,
          {
            backgroundColor: isSelected ? theme.primaryMuted : 'transparent',
            borderBottomColor: theme.borderLight,
          },
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.itemFlag}>{item.flag}</Text>

        <View style={styles.itemInfo}>
          <View style={styles.codeRow}>
            <Text
              style={[
                styles.itemCode,
                { color: isSelected ? theme.primary : theme.textPrimary },
              ]}
            >
              {item.code}
            </Text>
            <Text style={[styles.itemSymbol, { color: theme.textMuted }]}>
              {item.symbol}
            </Text>
          </View>
          <Text
            style={[styles.itemName, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>

        {isSelected && (
          <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
            <Icon name="check" size={14} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalSheet, { backgroundColor: theme.surface }]}>
          {/* Sheet Handle */}
          <View style={styles.handleBar}>
            <View style={[styles.handlePill, { backgroundColor: theme.border }]} />
          </View>

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>
              Select Currency
            </Text>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: theme.surfaceElevated }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Icon name="close" size={16} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
            ]}
          >
            <Icon name="search" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search by code, country, or name..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Currencies FlatList */}
          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.code}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={20}
            maxToRenderPerBatch={25}
            windowSize={10}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handlePill: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderBottomWidth: 1,
  },
  itemFlag: {
    fontSize: 28,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemCode: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemSymbol: {
    fontSize: 13,
    fontWeight: '500',
  },
  itemName: {
    fontSize: 12,
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
