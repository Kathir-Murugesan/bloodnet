import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNInput, BNButton } from '../components';
import { BackIcon, PinIcon, CheckIcon, ShieldCheckIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpStep2'>;

export function SignUpStep2Screen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.progress}>
          <View style={[styles.progressBar, { backgroundColor: BN.crimson }]} />
          <View style={[styles.progressBar, { backgroundColor: BN.crimson }]} />
        </View>
        <Text style={styles.stepLabel}>Step 2 of 2 · Location & History</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
        <BNInput
          label="Your Location"
          value="Bandra West, Mumbai"
          trailing={<PinIcon color={BN.crimson} />}
        />

        <View>
          <Text style={styles.qLabel}>Have you donated blood before?</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity style={[styles.toggleBtn, styles.toggleBtnInactive]}>
              <Text style={styles.toggleTextInactive}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, styles.toggleBtnActive]}>
              <Text style={styles.toggleTextActive}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.eligibleBanner}>
          <View style={styles.eligibleIcon}>
            <CheckIcon color="#fff" size={18} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.eligibleTitle}>You're immediately eligible to donate!</Text>
            <Text style={styles.eligibleSub}>We'll notify you of nearby requests right away.</Text>
          </View>
        </View>

        <View style={styles.privacyCard}>
          <ShieldCheckIcon color={BN.info} size={22} />
          <Text style={styles.privacyText}>
            Your data is encrypted and only shared with hospitals when you accept a request.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BNButton onPress={() => navigation.navigate('SignUpSuccess')}>Create My Account</BNButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: { backgroundColor: BN.burgundy, paddingBottom: 16, paddingHorizontal: 16, gap: 4 },
  headerTitle: { fontFamily: BN.uiSemiBold, fontSize: 17, color: '#fff', marginBottom: 16 },
  progress: { flexDirection: 'row', gap: 8 },
  progressBar: { flex: 1, height: 6, borderRadius: 3 },
  stepLabel: { fontFamily: BN.ui, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },
  qLabel: { fontFamily: BN.uiSemiBold, fontSize: 14, marginBottom: 10, color: BN.text },
  toggleRow: {
    flexDirection: 'row', backgroundColor: BN.bg, padding: 4, borderRadius: 12,
  },
  toggleBtn: { flex: 1, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  toggleBtnActive: { backgroundColor: BN.white, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  toggleBtnInactive: {},
  toggleTextActive: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.text },
  toggleTextInactive: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.muted },
  eligibleBanner: {
    backgroundColor: 'rgba(26,122,74,0.08)',
    borderWidth: 1, borderColor: 'rgba(26,122,74,0.3)',
    borderRadius: 10, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  eligibleIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: BN.success, alignItems: 'center', justifyContent: 'center',
  },
  eligibleTitle: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.success },
  eligibleSub: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 2 },
  privacyCard: {
    backgroundColor: BN.white, borderWidth: 0.5, borderColor: BN.divider,
    borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10,
  },
  privacyText: { flex: 1, fontFamily: BN.ui, fontSize: 13, color: BN.muted, lineHeight: 20 },
  footer: { padding: 20, paddingBottom: 28, borderTopWidth: 0.5, borderTopColor: BN.divider, backgroundColor: BN.white },
});
