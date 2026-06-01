import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createRoute } from '@granite-js/react-native';
import { setInput } from '../src/store';
import { BannerAd } from '../src/components/BannerAd';
import {
  SPENDING_LABELS,
  HOUSING_LABELS,
  type SpendingType,
  type HousingType,
} from '../src/survival';

export const Route = createRoute('/', {
  component: IndexPage,
});

function IndexPage() {
  const navigation = Route.useNavigation();
  const [salaryText, setSalaryText] = useState('');
  const [spendingType, setSpendingType] = useState<SpendingType>('normal');
  const [housingType, setHousingType] = useState<HousingType>('oneroom');
  const [hasCar, setHasCar] = useState(false);

  const salary = parseInt(salaryText.replace(/,/g, ''), 10);
  const isValid = !isNaN(salary) && salary > 0;

  function handleSalaryChange(text: string) {
    const digits = text.replace(/[^0-9]/g, '');
    if (!digits) {
      setSalaryText('');
      return;
    }
    setSalaryText(Number(digits).toLocaleString('ko-KR'));
  }

  function handleSubmit() {
    if (!isValid) return;
    setInput({ salary, spendingType, housingType, hasCar });
    navigation.navigate('/result');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>월급 생활비 테스트</Text>
            <Text style={styles.title}>내 월급으로{'\n'}어디까지 버틸 수 있을까?</Text>
            <Text style={styles.subtitle}>세후 월급과 생활 패턴으로 지역별 생존 가능성을 가볍게 확인해보세요.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>세후 월급</Text>
            <View style={styles.salaryRow}>
              <TextInput
                style={styles.salaryInput}
                value={salaryText}
                onChangeText={handleSalaryChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#6B7280"
                maxLength={12}
              />
              <Text style={styles.salarySuffix}>만원</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>소비 성향</Text>
            <View style={styles.row}>
              {(['save', 'normal', 'flex'] as SpendingType[]).map((type) => (
                <SelectCard
                  key={type}
                  label={SPENDING_LABELS[type]}
                  selected={spendingType === type}
                  onPress={() => setSpendingType(type)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>주거 스타일</Text>
            <View style={styles.row}>
              {(['oneroom', 'officetel', 'new'] as HousingType[]).map((type) => (
                <SelectCard
                  key={type}
                  label={HOUSING_LABELS[type]}
                  selected={housingType === type}
                  onPress={() => setHousingType(type)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>차량 여부</Text>
            <View style={styles.row}>
              <SelectCard
                label="없음"
                selected={!hasCar}
                onPress={() => setHasCar(false)}
              />
              <SelectCard
                label="있음"
                selected={hasCar}
                onPress={() => setHasCar(true)}
              />
            </View>
          </View>

          <BannerAd />

          <TouchableOpacity
            style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isValid}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>결과 보기</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface SelectCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function SelectCard({ label, selected, onPress }: SelectCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.cardText, selected && styles.cardTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F1115',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 28,
  },
  intro: {
    gap: 10,
    paddingTop: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#60A5FA',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F3F4F6',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 21,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.2,
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171A20',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#262A33',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 8,
  },
  salaryInput: {
    flex: 1,
    fontSize: 30,
    fontWeight: '700',
    color: '#F3F4F6',
    padding: 0,
    margin: 0,
  },
  salarySuffix: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#171A20',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262A33',
    paddingVertical: 14,
    alignItems: 'center',
  },
  cardSelected: {
    backgroundColor: '#1B2035',
    borderColor: '#2563EB',
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  cardTextSelected: {
    color: '#F3F4F6',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#1E3A5F',
    opacity: 0.5,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
