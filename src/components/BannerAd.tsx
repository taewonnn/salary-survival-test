import React from 'react';
import { View } from 'react-native';

interface InlineAdProps {
  adGroupId: string;
  theme?: 'auto' | 'light' | 'dark';
  tone?: 'blackAndWhite' | 'grey';
  variant?: 'expanded' | 'card';
  impressFallbackOnMount?: boolean;
}

let InlineAd: React.ComponentType<InlineAdProps> | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const framework = require('@apps-in-toss/framework');
  InlineAd = framework.InlineAd ?? null;
} catch {
  // @apps-in-toss/framework not installed
}

const BANNER_AD_ID = 'ait-ad-test-banner-id';

export function BannerAd() {
  if (!InlineAd) return null;

  return (
    <View style={{ width: '100%', height: 96, overflow: 'hidden' }}>
      <InlineAd
        adGroupId={BANNER_AD_ID}
        theme="dark"
        tone="blackAndWhite"
        impressFallbackOnMount={true}
      />
    </View>
  );
}
