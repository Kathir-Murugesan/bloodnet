import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNBloodBadge, BNTag, BNAvatar, BNMap, PulseDot } from '../components';
import { BackIcon, ShareIcon, ChevronIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'RequestManage'>;

const donors = [
  { n: 'Rajan M.',  i: 'RM', d: '2.1 km', eta: '8 min',  live: true,  time: '2 min ago' },
  { n: 'Priya K.',  i: 'PK', d: '3.4 km', eta: '12 min', live: true,  time: '5 min ago' },
  { n: 'Sneha S.',  i: 'SS', d: '5.8 km', eta: '18 min', live: false, time: '14 min ago' },
];

export function RequestManageScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>O+ · Urgent</Text>
        <ShareIcon color="#fff" size={18} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <BNTag color={BN.crimson} dot>Urgent</BNTag>
            <Text style={styles.postedTime}>Posted 12 min ago</Text>
          </View>
          <View style={styles.summaryStats}>
            <BNBloodBadge group="O+" size="lg" />
            <View>
              <Text style={styles.unitsText}>2 / 2</Text>
              <Text style={styles.unitsLabel}>Units secured</Text>
            </View>
          </View>
        </View>

        {/* Live map */}
        <View style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <View style={styles.liveRow}>
              <PulseDot color={BN.success} size={8} />
              <Text style={styles.liveText}>LIVE TRACKING</Text>
            </View>
            <Text style={styles.updatedText}>Updated just now</Text>
          </View>
          <BNMap height={180} dark donors={3} showHospital />
        </View>

        {/* Donors list */}
        <Text style={styles.donorsTitle}>Committed Donors (3)</Text>
        <View style={styles.donorsList}>
          {donors.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.donorRow, i < donors.length - 1 && styles.rowBorder]}
            >
              <BNAvatar initials={d.i} size={40} committed />
              <View style={{ flex: 1 }}>
                <View style={styles.donorNameRow}>
                  <Text style={styles.donorName}>{d.n}</Text>
                  <BNBloodBadge group="O+" />
                </View>
                <View style={styles.donorMeta}>
                  {d.live && <PulseDot color={BN.success} size={6} />}
                  <Text style={styles.donorMetaText}>{d.d} · ETA {d.eta} · {d.time}</Text>
                </View>
              </View>
              <ChevronIcon color={BN.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>Close Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: {
    backgroundColor: BN.burgundy, paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  headerTitle: { flex: 1, fontFamily: BN.uiBold, fontSize: 17, color: '#fff' },
  content: { padding: 16, gap: 14, paddingBottom: 100 },
  summaryCard: {
    backgroundColor: '#FFF5F7',
    borderWidth: 1, borderColor: 'rgba(232,0,61,0.2)',
    borderRadius: 14, padding: 16,
  },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  postedTime: { fontFamily: BN.ui, fontSize: 12, color: BN.muted },
  summaryStats: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 },
  unitsText: { fontFamily: BN.display, fontSize: 32, color: BN.crimson, lineHeight: 34 },
  unitsLabel: { fontFamily: BN.uiSemiBold, fontSize: 12, color: BN.muted },
  mapCard: { backgroundColor: BN.burgundyDark, borderRadius: 14, padding: 12 },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveText: { fontFamily: BN.uiBold, fontSize: 12, color: '#fff', letterSpacing: 0.5 },
  updatedText: { fontFamily: BN.ui, fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  donorsTitle: { fontFamily: BN.uiBold, fontSize: 14, color: BN.text },
  donorsList: { backgroundColor: BN.white, borderRadius: 12, borderWidth: 0.5, borderColor: BN.divider },
  donorRow: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: BN.divider },
  donorNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  donorName: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.text },
  donorMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  donorMetaText: { fontFamily: BN.ui, fontSize: 12, color: BN.muted },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, backgroundColor: BN.white,
    borderTopWidth: 0.5, borderTopColor: BN.divider,
  },
  closeBtn: {
    paddingVertical: 14, borderWidth: 1.5, borderColor: BN.crimsonDark,
    borderRadius: 14, alignItems: 'center',
  },
  closeBtnText: { fontFamily: BN.uiSemiBold, fontSize: 15, color: BN.crimsonDark },
});
