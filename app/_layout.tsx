import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { useStore } from '../src/store/useStore';
import { OnboardingFlow } from '../src/components/OnboardingFlow';
import { LevelUpModal } from '../src/components/LevelUpModal';
import { Layout, Colors } from '../src/constants/theme';
import { useEffect } from 'react';

function useInjectWebStyles() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        body { background: #000 !important; }
        #root { background: #000 !important; }
        #root > div { background: #000 !important; }
        #root > div > div { max-width: ${Layout.maxAppWidth}px !important; margin: 0 auto !important; width: 100% !important; background: #000 !important; }
        #root > div > div > div { background: #000 !important; }
      `;
      document.head.appendChild(style);
      return () => { document.head.removeChild(style); };
    }
  }, []);
}

export default function RootLayout() {
  const onboardingComplete = useStore(s => s.settings.onboardingComplete);
  useInjectWebStyles();

  if (!onboardingComplete) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <OnboardingFlow />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LevelUpModal />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
