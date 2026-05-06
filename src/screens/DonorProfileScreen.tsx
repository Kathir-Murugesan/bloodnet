import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNAvatar, BNBloodBadge, BNCard, BNBottomNav, donorTabs } from '../components';
import { CheckIcon, EditIcon, FireIcon, ChevronIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'DonorProfile'>;

export function DonorProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Hero gradient */}
      <LinearGradient colors={BN.gradientColors} style={styles.hero}>
        <TouchableOpacity style={styles.editBtn}>
          <EditIcon color="#fff" size={16} />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <BNAvatar initials="AM" size={72} />
          <Text style={styles.heroName}>Aarav Mehta</Text>
          <BNBloodBadge group="O+" size="md" />
        </View>
      </LinearGradient>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Eligibility */}
        <BNCard accent="success" elevated padding={14}>
          <View style={styles.eligRow}>
            <View style={styles.eligIcon}>
              <CheckIcon color={BN.success} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eligTitle}>You are eligible to donate</Text>
              <Text style={styles.eligSub}>Last donated: Feb 14, 2026</Text>
            </View>
          </View>
        </BNCard>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { l: 'Donations', v: '7', c: BN.crimson },
            { l: 'Lives Impacted', v: '21', c: BN.burgundy },
            { l: 'Streak', v: '3', c: BN.warn, fire: true },
          ].map((s) => (
            <View key={s.l} style={styles.statCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Text style={[styles.statValue, { color: s.c }]}>{s.v}</Text>
                {s.fire && <FireIcon color={BN.warn} size={18} />}
              </View>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* History */}
        <View>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Donation History</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <View style={styles.listCard}>
            {[
              { h: 'KEM Hospital', d: 'Feb 14, 2026', u: '1' },
              { h: 'Lilavati Hospital', d: 'Nov 02, 2025', u: '2' },
              { h: 'Hinduja Hospital', d: 'Aug 17, 2025', u: '1' },
            ].map((r, i, arr) => (
              <View key={i} style={[styles.historyRow, i < arr.length - 1 && styles.rowBorder]}>
                <BNBloodBadge group="O+" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.histHospital}>{r.h}</Text>
                  <Text style={styles.histDate}>{r.d}</Text>
                </View>
                <Text style={styles.histUnits}>{r.u} unit</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.listCard}>
          {[
            { l: 'Edit Profile' },
            { l: 'Notification Preferences' },
            { l: 'Help & FAQ' },
            { l: 'Log Out', danger: true },
          ].map((r, i, arr) => (
            <TouchableOpacity key={r.l} style={[styles.settingsRow, i < arr.length - 1 && styles.rowBorder]}>
              <Text style={[styles.settingsLabel, r.danger && { color: BN.crimson }]}>{r.l}</Text>
              <ChevronIcon color={BN.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BNBottomNav
        tabs={donorTabs()}
        active={2}
        onTabPress={(i) => {
          if (i === 0) navigation.navigate('DonorApp');
          if (i === 1) navigation.navigate('Commitments');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  hero: { paddingBottom: 28, paddingHorizontal: 20, position: 'relative' },
  editBtn: {
    position: 'absolute', top: 0, right: 16,
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroContent: { alignItems: 'center', gap: 10 },
  heroName: { fontFamily: BN.uiBold, fontSize: 20, color: '#fff' },
  body: { flex: 1, marginTop: -16 },
  bodyContent: { padding: 16, gap: 12 },
  eligRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eligIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(26,122,74,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  eligTitle: { fontFamily: BN.uiBold, fontSize: 15, color: BN.success },
  eligSub: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1, backgroundColor: BN.white, borderRadius: 12,
    padding: 12, borderWidth: 0.5, borderColor: BN.divider, alignItems: 'center',
  },
  statValue: { fontFamily: BN.display, fontSize: 30, lineHeight: 32 },
  statLabel: { fontFamily: BN.uiSemiBold, fontSize: 11, color: BN.muted, marginTop: 4 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 4 },
  historyTitle: { fontFamily: BN.uiBold, fontSize: 14, color: BN.text },
  seeAll: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.crimson },
  listCard: { backgroundColor: BN.white, borderRadius: 12, borderWidth: 0.5, borderColor: BN.divider },
  historyRow: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: BN.divider },
  histHospital: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.text },
  histDate: { fontFamily: BN.ui, fontSize: 12, color: BN.muted },
  histUnits: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.muted },
  settingsRow: { padding: 14, flexDirection: 'row', alignItems: 'center' },
  settingsLabel: { flex: 1, fontFamily: BN.uiMedium, fontSize: 14, color: BN.text },
});
