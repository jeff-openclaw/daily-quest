import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { useStore } from '../store/useStore';

const CONFETTI = ['🎉', '✨', '🌟', '⭐', '🎊', '💫', '🔥', '💜'];

export function LevelUpModal() {
  const lastLevelUp = useStore(s => s.lastLevelUp);
  const clearLevelUp = useStore(s => s.clearLevelUp);
  const [visible, setVisible] = useState(false);
  const [level, setLevel] = useState(0);

  const numberScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);

  useEffect(() => {
    if (lastLevelUp && lastLevelUp > 0) {
      setLevel(lastLevelUp);
      setVisible(true);
      numberScale.value = 0;
      badgeOpacity.value = 0;
      numberScale.value = withDelay(200, withSequence(
        withSpring(1.3, { damping: 6, stiffness: 150 }),
        withSpring(1, { damping: 10 })
      ));
      badgeOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
    }
  }, [lastLevelUp]);

  const handleClose = () => {
    setVisible(false);
    clearLevelUp();
  };

  const numberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numberScale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Confetti decoration */}
          <View style={styles.confettiRow}>
            {CONFETTI.map((c, i) => (
              <ConfettiPiece key={i} emoji={c} delay={i * 100} />
            ))}
          </View>

          <Text style={styles.headerText}>LEVEL UP!</Text>
          
          <Animated.View style={[styles.numberContainer, numberStyle]}>
            <Text style={styles.levelNumber}>{level}</Text>
          </Animated.View>

          <Animated.View style={[styles.badgeContainer, badgeStyle]}>
            <Text style={styles.congratsText}>
              {level >= 15 ? '🏆 Legendary status!' :
               level >= 10 ? '⚡ You\'re unstoppable!' :
               level >= 5 ? '🌟 Rising star!' :
               '💪 Keep it up!'}
            </Text>
          </Animated.View>

          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeBtnText}>Continue →</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function ConfettiPiece({ emoji, delay }: { emoji: string; delay: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withSequence(
      withSpring(-30, { damping: 4, stiffness: 80 }),
      withSpring(0, { damping: 8 })
    ));
    rotate.value = withDelay(delay, withSpring(
      (Math.random() - 0.5) * 40,
      { damping: 6 }
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return <Animated.Text style={[styles.confettiEmoji, style]}>{emoji}</Animated.Text>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  confettiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  confettiEmoji: {
    fontSize: 24,
  },
  headerText: {
    color: Colors.xpGold,
    fontSize: FontSize.xl,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: Spacing.md,
  },
  numberContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.accent + '22',
    borderWidth: 3,
    borderColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  levelNumber: {
    color: Colors.accent,
    fontSize: 56,
    fontWeight: '900',
  },
  badgeContainer: {
    marginBottom: Spacing.lg,
  },
  congratsText: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  closeBtnText: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
