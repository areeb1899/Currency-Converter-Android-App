import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { Icon } from './Icons';
import { formatRelativeTime } from '../utils/formatters';

export function Header({
  theme,
  isDark,
  onToggleTheme,
  ratesDate,
  ratesSource,
  isRefreshing,
  onRefresh,
}) {
  const spinValue = useRef(new Animated.Value(0)).current;

  const handleRefreshPress = () => {
    if (isRefreshing) return;
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
    onRefresh();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isLive = ratesSource === 'live';

  return (
    <View style={[styles.container, { borderBottomColor: theme.borderLight }]}>
      <View style={styles.titleContainer}>
        <View style={styles.brandRow}>
          <Image
            source={require('../../assets/app-logo.png')}
            style={styles.appLogo}
            resizeMode="contain"
          />
          <View style={styles.metaContainer}>
            <View style={styles.titleTextRow}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Currency</Text>
              <Text style={[styles.titleHighlight, { color: theme.primary }]}>Converter</Text>
            </View>

           
          </View>
        </View>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isLive ? theme.statusSuccess : theme.statusWarning },
            ]}
          />
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isLive ? 'Live Rates' : 'Cached/Offline'} • {formatRelativeTime(ratesDate)}
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated }]}
          onPress={onToggleTheme}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Theme"
        >
          <Icon name={isDark ? 'sun' : 'moon'} size={18} color={theme.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.surfaceElevated }]}
          onPress={handleRefreshPress}
          activeOpacity={0.7}
          accessibilityLabel="Reload and set USD to INR"
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Icon name="refresh" size={18} color={theme.textPrimary} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLogo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    marginRight: 10,
  },
  metaContainer: {
    flex: 1,
  },
  titleTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  titleHighlight: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginLeft: 4,
  },
  devRow: {
    marginTop: 1,
  },
  devLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  devName: {
    fontWeight: '700',
  },
  versionBadge: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 48, // aligns with text past logo
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
