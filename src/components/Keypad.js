import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Icon } from './Icons';

const KEYPAD_HEIGHT = 258;

export function Keypad({ theme, onKeyPress, isOpen = true }) {
  const animValue = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: isOpen ? 1 : 0,
      duration: 260,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const height = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, KEYPAD_HEIGHT],
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.4, 1],
  });

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'DEL'],
  ];

  return (
    <Animated.View
      style={[
        styles.animatedWrapper,
        {
          height,
          backgroundColor: theme.surface,
          borderTopColor: theme.borderLight,
        },
      ]}
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        {keys.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((key) => {
              const isDel = key === 'DEL';
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.key,
                    {
                      backgroundColor: isDel ? theme.dangerMuted : theme.surfaceElevated,
                    },
                  ]}
                  onPress={() => onKeyPress(key)}
                  activeOpacity={0.65}
                  accessibilityLabel={isDel ? 'Backspace' : `Number ${key}`}
                >
                  {isDel ? (
                    <Icon name="backspace" size={20} color={theme.danger} />
                  ) : (
                    <Text style={[styles.keyText, { color: theme.textPrimary }]}>
                      {key}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedWrapper: {
    overflow: 'hidden',
    borderTopWidth: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  key: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
