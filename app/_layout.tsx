import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useStore } from '../src/store/useStore';
import { OnboardingFlow } from '../src/components/OnboardingFlow';
import { LevelUpModal } from '../src/components/LevelUpModal';
import { Layout, Colors } from '../src/constants/theme';

export default function RootLayout() {
  const onboardingComplete = useStore(s => s.settings.onboardingComplete);

  if (!onboardingComplete) {
    return (
      <View style={styles.outer}>
        <StatusBar style="light" />
        <View style={styles.inner}>
          <OnboardingFlow />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outer}>
      <StatusBar style="light" />
      <View style={styles.inner}>
        <LevelUpModal />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: Layout.maxAppWidth,
    backgroundColor: '#000000',
  },
});
