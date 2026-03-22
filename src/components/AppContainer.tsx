import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Colors } from '../constants/theme';

export function AppContainer({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: Layout.maxAppWidth,
  },
});
