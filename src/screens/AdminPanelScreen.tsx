import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN, shadow } from '../theme';
import { BNInput, BNButton } from '../components';
import { LogoutIcon, CrossIcon, MoreVIcon, PlusIcon, CloseIcon, EyeIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminPanel'>;

const hospitals = [
  { name: 'KEM Hospital', user: 'kemhospital', date: 'Apr 12, 2026' },
  { name: 'Lilavati Medical', user: 'lilavati_med', date: 'Apr 02, 2026' },
  { name: 'Tata Memorial', user: 'tatamem', date: 'Mar 28, 2026' },
  { name: 'Nanavati Super Specialty', user: 'nanavati_ss', date: 'Mar 19, 2026' },
  { name: 'Wockhardt Hospitals', user: 'wockhardt', date: 'Mar 11, 2026' },
  { name: 'Hinduja Hospital', user: 'hinduja_h', date: 'Feb 27, 2026' },
];

export function AdminPanelScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Splash')}>
          <LogoutIcon color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          {[['Total', '24'], ['Active', '18'], ['This Mo.', '3']].map(([l, v]) => (
            <View key={l} style={[styles.statCard, shadow.card]}>
              <Text style={styles.statLabel}>{l}</Text>
              <Text style={styles.statValue}>{v}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Hospitals</Text>

        <View style={styles.listContainer}>
          {hospitals.map((h, i) => (
            <View key={i} style={[styles.hospitalRow, i < hospitals.length - 1 && styles.rowBorder]}>
              <View style={styles.hospitalIcon}>
                <CrossIcon color={BN.burgundy} size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.hospitalName}>{h.name}</Text>
                <Text style={styles.hospitalUser}>{h.user}</Text>
                <Text style={styles.hospitalDate}>Created {h.date}</Text>
              </View>
              <MoreVIcon color={BN.muted} size={18} />
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)}>
        <PlusIcon color="#fff" size={24} />
      </TouchableOpacity>

      <Modal visible={showCreate} transparent animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowCreate(false)} />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 8 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>New Hospital</Text>
              <TouchableOpacity style={styles.sheetClose} onPress={() => setShowCreate(false)}>
                <CloseIcon color={BN.muted} size={16} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ gap: 12 }}>
              <BNInput label="Hospital Name" value="Breach Candy Hospital" />
              <BNInput label="Hospital Address" value="60A Bhulabhai Desai Road, Mumbai 400026" />
              <BNInput label="Contact Phone" value="+91 22 2367 1888" />
              <BNInput label="Username" value="breachcandy" />
              <BNInput label="Password" value="X7$mqK9pLn2v" trailing={<EyeIcon color={BN.muted} />} />
              <TouchableOpacity>
                <Text style={styles.generatePw}>↻ Generate Strong Password</Text>
              </TouchableOpacity>
            </ScrollView>
            <View style={{ marginTop: 16 }}>
              <BNButton onPress={() => setShowCreate(false)}>Save Hospital</BNButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: {
    backgroundColor: BN.burgundyDark, paddingBottom: 14, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontFamily: BN.uiBold, fontSize: 18, color: '#fff' },
  content: { padding: 20, gap: 16 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1, backgroundColor: BN.white, borderRadius: 10, padding: 12,
    borderWidth: 0.5, borderColor: BN.divider,
  },
  statLabel: {
    fontFamily: BN.uiSemiBold, fontSize: 11, color: BN.muted,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  statValue: { fontFamily: BN.display, fontSize: 28, color: BN.crimson, lineHeight: 32, marginTop: 4 },
  sectionLabel: {
    fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.muted,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  listContainer: {
    backgroundColor: BN.white, borderRadius: 10,
    borderWidth: 0.5, borderColor: BN.divider,
  },
  hospitalRow: {
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: BN.divider },
  hospitalIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: BN.bg, alignItems: 'center', justifyContent: 'center',
  },
  hospitalName: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.text },
  hospitalUser: { fontFamily: 'monospace', fontSize: 12, color: BN.muted },
  hospitalDate: { fontFamily: BN.ui, fontSize: 11, color: BN.muted, marginTop: 2 },
  fab: {
    position: 'absolute', right: 20, bottom: 30,
    width: 56, height: 56, borderRadius: 28, backgroundColor: BN.crimson,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: BN.crimson, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(26,0,8,0.6)' },
  sheet: {
    backgroundColor: BN.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, maxHeight: '80%',
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: BN.divider, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontFamily: BN.uiBold, fontSize: 18, color: BN.text },
  sheetClose: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: BN.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  generatePw: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.crimson },
});
