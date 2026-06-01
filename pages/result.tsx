import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Share,
} from 'react-native';
import { createRoute } from '@granite-js/react-native';
import { getInput, getRetryCount, incrementRetry } from '../src/store';
import {
  calcAllRegions,
  SPENDING_LABELS,
  HOUSING_LABELS,
  type RegionResult,
} from '../src/survival';
import { BannerAd } from '../src/components/BannerAd';
import { AD_KEYS, FREE_RETRY_LIMIT } from '../src/adConfig';

export const Route = createRoute('/result', {
  component: ResultPage,
});

interface FullScreenAdLoadParams {
  options: { adGroupId: string };
  onEvent: (event: { type: string }) => void;
  onError: (err: unknown) => void;
}

interface FullScreenAdShowParams {
  options: { adGroupId: string };
  onEvent: (event: { type: string }) => void;
  onError: (err: unknown) => void;
}

let loadFullScreenAd: ((params: FullScreenAdLoadParams) => () => void) | null = null;
let showFullScreenAd: ((params: FullScreenAdShowParams) => () => void) | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const framework = require('@apps-in-toss/framework');
  loadFullScreenAd = framework.loadFullScreenAd ?? null;
  showFullScreenAd = framework.showFullScreenAd ?? null;
} catch {
  // @apps-in-toss/framework not installed
}

const FULLSCREEN_AD_ID = AD_KEYS.fullscreen;

function ResultPage() {
  const navigation = Route.useNavigation();
  const input = getInput();
  const retryCount = getRetryCount();
  const shouldShowAdGate = retryCount >= FREE_RETRY_LIMIT;
  const canShowAd = shouldShowAdGate && loadFullScreenAd !== null;

  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    if (!canShowAd || !loadFullScreenAd) return;

    const unregister = loadFullScreenAd({
      options: { adGroupId: FULLSCREEN_AD_ID },
      onEvent: (event) => {
        if (event.type === 'loaded') setIsAdLoaded(true);
      },
      onError: () => {},
    });

    return unregister;
  }, [canShowAd]);

  if (!input) {
    navigation.navigate('/');
    return null;
  }

  const results = calcAllRegions(input);

  function handleRetry() {
    if (!shouldShowAdGate) {
      incrementRetry();
      navigation.goBack();
      return;
    }

    if (!canShowAd || !showFullScreenAd || !isAdLoaded) {
      incrementRetry();
      navigation.goBack();
      return;
    }

    showFullScreenAd({
      options: { adGroupId: FULLSCREEN_AD_ID },
      onEvent: (event) => {
        if (event.type === 'dismissed') {
          incrementRetry();
          navigation.goBack();
        }
      },
      onError: () => {
        incrementRetry();
        navigation.goBack();
      },
    });
  }

  async function handleShare() {
    const sorted = [...results].sort((a, b) => b.score - a.score);
    const best = sorted[0]!;
    const worst = sorted[sorted.length - 1]!;
    const salaryStr = input!.salary.toLocaleString('ko-KR');

    let shareLink = '';
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getTossShareLink } = require('@apps-in-toss/native-modules');
      shareLink = await getTossShareLink('intoss://salary-survival-test');
    } catch {
      // 링크 생성 실패 시 텍스트만 공유
    }

    const baseMessage =
      `💰 내 월급 ${salaryStr}만원으로 지역별 생존 테스트\n\n` +
      `✅ ${best.name}: ${best.label}\n` +
      `❌ ${worst.name}: ${worst.label}\n\n` +
      `너도 테스트해봐 👇`;

    const message = shareLink ? `${baseMessage}\n${shareLink}` : baseMessage;

    try {
      await Share.share({ message });
    } catch {
      // cancelled
    }
  }

  const spendingLabel = SPENDING_LABELS[input.spendingType];
  const housingLabel = HOUSING_LABELS[input.housingType];
  const carLabel = input.hasCar ? ' · 차량있음' : '';
  const summaryText = `${input.salary.toLocaleString('ko-KR')}만원 · ${spendingLabel} · ${housingLabel}${carLabel}`;

  const retryLabel =
    shouldShowAdGate && canShowAd && !isAdLoaded
      ? '광고 로딩 중...'
      : shouldShowAdGate
        ? '광고 보고 다시하기'
        : '다시하기';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>지역별 생존 리포트</Text>
          <Text style={styles.summary}>{summaryText}</Text>
        </View>

        <View style={styles.cardList}>
          {results.map((result) => (
            <RegionCard key={result.name} result={result} />
          ))}
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Text style={styles.shareBtnText}>결과 공유하기</Text>
        </TouchableOpacity>

        <BannerAd />

        <TouchableOpacity
          style={styles.retryBtn}
          onPress={handleRetry}
          activeOpacity={0.8}
          disabled={canShowAd && !isAdLoaded}
        >
          <Text style={[styles.retryBtnText, canShowAd && !isAdLoaded && styles.retryBtnTextDisabled]}>
            {retryLabel}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function RegionCard({ result }: { result: RegionResult }) {
  return (
    <View style={styles.regionCard}>
      <Text style={styles.resultEmoji}>{result.resultEmoji}</Text>
      <View style={styles.regionLeft}>
        <Text style={styles.regionName}>
          {result.emoji} {result.name}
        </Text>
        <Text style={[styles.regionLabel, { color: result.color }]}>{result.label}</Text>
      </View>
      <Text style={styles.regionCost}>월 {result.totalCost.toLocaleString('ko-KR')}만원</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F1115',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F3F4F6',
    letterSpacing: -0.5,
  },
  summary: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  cardList: {
    gap: 8,
  },
  regionCard: {
    backgroundColor: '#171A20',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#262A33',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultEmoji: {
    fontSize: 36,
    lineHeight: 44,
  },
  regionLeft: {
    flex: 1,
    gap: 3,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F3F4F6',
  },
  regionCost: {
    fontSize: 12,
    color: '#6B7280',
    flexShrink: 0,
  },
  regionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EAB308',
  },
  shareBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 8,
  },
  shareBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  retryBtn: {
    backgroundColor: '#171A20',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262A33',
  },
  retryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  retryBtnTextDisabled: {
    color: '#6B7280',
  },
});
