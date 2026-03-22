import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, FontSize } from '../constants/theme';
import { useStore } from '../store/useStore';

export function XpAnimation() {
  const lastXpGain = useStore(s => s.lastXpGain);
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(0);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    if (lastXpGain && lastXpGain.amount > 0) {
      setAmount(lastXpGain.amount);
      setVisible(true);
      opacity.value = 0;
      translateY.value = 0;
      scale.value = 0.5;

      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1.2, { duration: 300 });
      translateY.value = withTiming(-80, { duration: 1200 });
      opacity.value = withDelay(800, withTiming(0, { duration: 400 }, () => {
        runOnJS(setVisible)(false);
      }));
    }
  }, [lastXpGain?.timestamp]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (!visible) return null;

  return (
    <Animated.Text style={[styles.xpText, animatedStyle]} pointerEvents="none">
      +{amount} XP ⚡
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  xpText: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    color: Colors.xpGold,
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    zIndex: 1000,
  },
});
