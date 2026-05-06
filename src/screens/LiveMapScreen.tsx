import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN, shadow } from '../theme';
import { BNMap, BNAvatar, BNBloodBadge, PulseDot } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'LiveMap'>;

export function LiveMapScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Full-screen map */}
      <BNMap height={812} showHospital showSelf />

      {/* Top info card */}
      <View style={[styles.topCard, { top: insets.top + 8 }]}>
        <View style={styles.topCardHeader}>
          <View>
            <Text style={styles.enRouteTo}>En route to</Text>
            <Text style={styles.hospitalName}>KEM Hospital</Text>
          </View>
          <View style={styles.liveRow}>
            <PulseDot color={BN.success} size={8} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ETA</Text>
            <Text style={styles.statValue}>~8 min</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>1.4 km</Text>
          </View>
        </View>
      </View>

      {/* Bottom card */}
      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 12 }, shadow.elevated]}>
        <View style={styles.donorRow}>
          <BNAvatar initials="AM" size={44} />
          <View style={{ flex: 1 }}>
            <Text style={styles.sharingLabel}>You're sharing your location</Text>
            <Text style={styles.sharingMuted}>Hospital is tracking your arrival</Text>
          </View>
          <BNBloodBadge group="O+" />
        </View>
        <TouchableOpacity style={styles.stopBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.stopBtnText}>Stop Sharing Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topCard: {
    position: 'absolute', left: 16, right: 16,
    backgroundColor: 'rgba(26,0,8,0.85)', borderRadius: 16, padding: 14,
  },
  topCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  enRouteTo: { fontFamily: BN.ui, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  hospitalName: { fontFamily: BN.uiBold, fontSize: 17, color: '#fff' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveText: { fontFamily: BN.uiBold, fontSize: 12, color: '#fff', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  statBox: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10, borderRadius: 10,
  },
  statLabel: { fontFamily: BN.uiSemiBold, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  statValue: { fontFamily: BN.display, fontSize: 22, color: '#fff' },
  bottomCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: BN.white, padding: 14, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    gap: 12,
  },
  donorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sharingLabel: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.text },
  sharingMuted: { fontFamily: BN.ui, fontSize: 12, color: BN.muted },
  stopBtn: {
    padding: 12, borderWidth: 1.5, borderColor: BN.crimsonDark,
    borderRadius: 12, alignItems: 'center',
  },
  stopBtnText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.crimsonDark },
});
