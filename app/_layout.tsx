import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useStore } from '../src/store/useStore';
import { OnboardingFlow } from '../src/components/OnboardingFlow';
import { LevelUpModal } from '../src/components/LevelUpModal';

export default function RootLayout() {
  const onboardingComplete = useStore(s => s.settings.onboardingComplete);

  if (!onboardingComplete) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <StatusBar style="light" />
        <OnboardingFlow />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar style="light" />
      <LevelUpModal />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}
