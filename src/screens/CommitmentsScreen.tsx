import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNBloodBadge, BNTag, BNCard, BNBottomNav, PulseDot, donorTabs } from '../components';
import { PinIcon, ClockIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Commitments'>;

export function CommitmentsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Commitments</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {['Active', 'Upcoming', 'Completed'].map((t, i) => (
          <TouchableOpacity key={t} style={styles.tab} activeOpacity={0.7}>
            <Text style={[styles.tabText, i === 0 && styles.tabTextActive]}>{t}</Text>
            {i === 0 && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* LIVE urgent */}
        <BNCard accent="urgent" elevated padding={14}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>KEM Hospital</Text>
            <View style={styles.liveRow}>
              <PulseDot color={BN.success} size={7} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <View style={styles.badges}>
            <BNBloodBadge group="O+" />
            <View style={styles.badge}><Text style={styles.badgeText}>2 UNITS</Text></View>
          </View>
          <View style={styles.etaRow}>
            <PinIcon color={BN.success} size={12} />
            <Text style={styles.etaText}>Sharing location · ETA 8 min</Text>
          </View>
          <TouchableOpacity style={styles.mapBtn} onPress={() => navigation.navigate('LiveMap')}>
            <PinIcon color="#fff" size={14} />
            <Text style={styles.mapBtnText}>Open Map</Text>
          </TouchableOpacity>
        </BNCard>

        {/* Scheduled imminent */}
        <BNCard accent="scheduled" padding={14}>
          <View style={styles.scheduledRow}>
            <View>
              <Text style={styles.cardTitle}>Lilavati Hospital</Text>
              <Text style={styles.schedTime}>Tomorrow · 10:00 AM</Text>
            </View>
            <BNBloodBadge group="O+" />
          </View>
          <View style={styles.reminderBox}>
            <ClockIcon color={BN.info} size={16} />
            <Text style={styles.reminderText}>Location sharing starts in 47 mins</Text>
          </View>
        </BNCard>

        <BNCard accent="scheduled" padding={14}>
          <View style={styles.scheduledRow}>
            <View>
              <Text style={styles.cardTitle}>Hinduja Hospital</Text>
              <Text style={styles.schedTime}>Jun 22 · 2:30 PM</Text>
            </View>
            <BNTag color={BN.success}>✓ Committed</BNTag>
          </View>
        </BNCard>
      </ScrollView>

      <BNBottomNav
        tabs={donorTabs()}
        active={1}
        onTabPress={(i) => {
          if (i === 0) navigation.navigate('DonorApp');
          if (i === 2) navigation.navigate('DonorProfile');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: { backgroundColor: BN.burgundy, paddingBottom: 12, paddingHorizontal: 20 },
  headerTitle: { fontFamily: BN.uiBold, fontSize: 20, color: '#fff' },
  tabBar: {
    backgroundColor: BN.white, flexDirection: 'row',
    borderBottomWidth: 0.5, borderBottomColor: BN.divider,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', position: 'relative' },
  tabText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.muted },
  tabTextActive: { color: BN.crimson },
  tabIndicator: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2, backgroundColor: BN.crimson },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontFamily: BN.uiSemiBold, fontSize: 16, color: BN.text },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveText: { fontFamily: BN.uiBold, fontSize: 11, color: BN.success, letterSpacing: 0.6 },
  badges: { flexDirection: 'row', gap: 6, marginTop: 10, alignItems: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: BN.bg, borderRadius: 100 },
  badgeText: { fontFamily: BN.uiBold, fontSize: 11, color: BN.text },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  etaText: { fontFamily: BN.uiSemiBold, fontSize: 12, color: BN.success },
  mapBtn: {
    marginTop: 10, padding: 10, backgroundColor: BN.crimson,
    borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  mapBtnText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: '#fff' },
  scheduledRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  schedTime: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 2 },
  reminderBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 12, padding: 10,
    backgroundColor: 'rgba(26,107,181,0.08)', borderRadius: 8,
  },
  reminderText: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.info },
});
