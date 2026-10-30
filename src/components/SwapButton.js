import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Icon } from './Icons';

export function SwapButton({ theme, onSwap }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    onSwap();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.primary,
            borderColor: theme.background,
            shadowColor: theme.primary,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityLabel="Swap currencies"
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Icon name="swap" size={20} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -16,
    zIndex: 10,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

