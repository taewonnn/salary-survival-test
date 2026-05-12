import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AD_KEYS } from '../adConfig';

interface InlineAdProps {
  adGroupId: string;
  theme?: 'auto' | 'light' | 'dark';
  tone?: 'blackAndWhite' | 'grey';
  variant?: 'expanded' | 'card';
  impressFallbackOnMount?: boolean;
  onAdRendered?: (payload: unknown) => void;
  onAdImpression?: (payload: unknown) => void;
  onNoFill?: (payload: unknown) => void;
  onAdFailedToRender?: (payload: unknown) => void;
}

let InlineAd: React.ComponentType<InlineAdProps> | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const framework = require('@apps-in-toss/framework');
  InlineAd = framework.InlineAd ?? null;
} catch {
  // @apps-in-toss/framework not installed
}

export function BannerAd() {
  if (InlineAd) {
    return (
      <View style={styles.container}>
        <InlineAd
          adGroupId={AD_KEYS.banner}
          theme="dark"
          tone="blackAndWhite"
          impressFallbackOnMount={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>AD</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 96,
    overflow: 'hidden',
  },
  placeholder: {
    width: '100%',
    height: 96,
    backgroundColor: '#1B2035',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A3050',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B4A6B',
    letterSpacing: 1.5,
  },
});
