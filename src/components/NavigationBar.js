import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Icon } from './Icons';

export function NavigationBar({
  theme,
  activeTab,
  onSelectTab,
  bottomInset = 0,
}) {
  const tabs = [
    { id: 'converter', label: 'Converter', icon: 'calculator' },
    { id: 'cheatsheet', label: 'Cheat Sheet', icon: 'table' },
    { id: 'rates', label: 'All Rates', icon: 'globe' },
  ];

  return (
    <View
      style={[
        styles.navContainer,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.borderLight,
          paddingBottom: Math.max(bottomInset, Platform.OS === 'ios' ? 14 : 10),
        },
      ]}
    >
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const activeColor = theme.primary;
          const inactiveColor = theme.textMuted;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.navBtn,
                isActive && [styles.navBtnActive, { backgroundColor: theme.primaryMuted }],
              ]}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} tab`}
            >
              <Icon
                name={tab.icon}
                size={20}
                color={isActive ? activeColor : inactiveColor}
              />
              <Text
                style={[
                  styles.navLabel,
                  {
                    color: isActive ? activeColor : inactiveColor,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 14,
    marginHorizontal: 4,
    gap: 3,
  },
  navBtnActive: {
    transform: [{ scale: 1.02 }],
  },
  navLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
});

