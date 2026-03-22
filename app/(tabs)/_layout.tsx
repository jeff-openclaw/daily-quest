import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../../src/constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, nameOutline, focused }: { name: IoniconsName; nameOutline: IoniconsName; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={focused ? name : nameOutline}
        size={22}
        color={focused ? Colors.accent : Colors.textMuted}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.appContainer}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Layout.maxAppWidth,
    backgroundColor: Colors.background,
  },
  iconWrap: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(124, 77, 255, 0.15)',
  },
});
