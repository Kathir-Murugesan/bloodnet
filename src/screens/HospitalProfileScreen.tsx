import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNCard, BNBottomNav, hospitalTabs } from '../components';
import { CrossIcon, ShieldCheckIcon, ChevronIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'HospitalProfile'>;

export function HospitalProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={BN.gradientColors} style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.hospitalAvatar}>
            <CrossIcon color="#fff" size={32} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hospitalName}>KEM Hospital</Text>
            <View style={styles.verifiedBadge}>
              <ShieldCheckIcon color="#fff" size={12} />
              <Text style={styles.verifiedText}>Verified by Blood Net</Text>
            </View>
          </View>
        </View>
        <Text style={styles.address}>Acharya Donde Marg, Parel, Mumbai 400012</Text>
      </LinearGradient>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Contact info */}
        <BNCard padding={14}>
          {[
            ['Phone', '+91 22 2410 7000'],
            ['Email', 'requests@kem.org'],
            ['Website', 'kem.edu'],
          ].map(([k, v], i, arr) => (
            <View key={k} style={[styles.infoRow, i < arr.length - 1 && styles.rowBorder]}>
              <Text style={styles.infoKey}>{k}</Text>
              <Text style={styles.infoVal}>{v}</Text>
            </View>
          ))}
        </BNCard>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { l: 'Requests', v: '142', c: BN.crimson },
            { l: 'Committed', v: '486', c: BN.success },
            { l: 'Units', v: '623', c: BN.burgundy },
          ].map((s) => (
            <View key={s.l} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.c }]}>{s.v}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.listCard}>
          {['Edit Hospital Info', 'Change Password', 'Notification Preferences', 'Help & FAQ'].map((r, i, arr) => (
            <TouchableOpacity key={r} style={[styles.settingsRow, i < arr.length - 1 && styles.rowBorder]}>
              <Text style={styles.settingsLabel}>{r}</Text>
              <ChevronIcon color={BN.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.listCard}>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('Splash')}>
            <Text style={[styles.settingsLabel, { color: BN.crimson }]}>Log Out</Text>
            <ChevronIcon color={BN.crimson} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BNBottomNav
        tabs={hospitalTabs()}
        active={3}
        onTabPress={(i) => {
          if (i === 0) navigation.navigate('HospitalApp');
          if (i === 1) navigation.navigate('PostRequest');
          if (i === 2) navigation.navigate('ManageRequests');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  hero: { paddingBottom: 24, paddingHorizontal: 20 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  hospitalAvatar: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  hospitalName: { fontFamily: BN.uiBold, fontSize: 22, color: '#fff' },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, marginTop: 4, alignSelf: 'flex-start',
  },
  verifiedText: { fontFamily: BN.uiSemiBold, fontSize: 11, color: '#fff' },
  address: { fontFamily: BN.ui, fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 12 },
  body: { flex: 1, marginTop: -14 },
  bodyContent: { padding: 16, gap: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: BN.divider },
  infoKey: { fontFamily: BN.ui, fontSize: 13, color: BN.muted },
  infoVal: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.text },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1, backgroundColor: BN.white, borderRadius: 12,
    padding: 12, borderWidth: 0.5, borderColor: BN.divider, alignItems: 'center',
  },
  statValue: { fontFamily: BN.display, fontSize: 26, lineHeight: 28 },
  statLabel: { fontFamily: BN.uiSemiBold, fontSize: 11, color: BN.muted, marginTop: 4 },
  listCard: { backgroundColor: BN.white, borderRadius: 12, borderWidth: 0.5, borderColor: BN.divider },
  settingsRow: { padding: 14, flexDirection: 'row', alignItems: 'center' },
  settingsLabel: { flex: 1, fontFamily: BN.uiMedium, fontSize: 14, color: BN.text },
});
