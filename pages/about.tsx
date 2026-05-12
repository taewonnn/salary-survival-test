import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createRoute } from '@granite-js/react-native';

export const Route = createRoute('/about', {
  component: AboutPage,
});

function AboutPage() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1115',
  },
});
