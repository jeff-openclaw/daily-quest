import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../../src/constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, nameOutline, focused }: { name: IoniconsName; nameOutline: IoniconsName; focused: boolean }) {
  return (
    <Ionicons
      name={focused ? name : nameOutline}
      size={22}
      color={focused ? Colors.accent : Colors.textMuted}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0A0A',
          borderTopWidth: 1,
          borderTopColor: '#1A1A1A',
          height: Layout.tabBarHeight,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 6,
          elevation: 0,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        sceneStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="flash" nameOutline="flash-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="flag" nameOutline="flag-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="stats-chart" nameOutline="stats-chart-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="settings" nameOutline="settings-outline" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
