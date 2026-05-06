import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNLogoMark, BNBloodBadge, BNTag, BNCard, BNButton, BNMap } from '../components';
import { BackIcon, CrossIcon, ShieldCheckIcon, CheckIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'RequestDetail'>;

export function RequestDetailScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blood Request</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroLogo}>
            <BNLogoMark size={140} />
          </View>
          <BNTag color={BN.crimson} dot>Urgent</BNTag>
          <View style={styles.heroStats}>
            <BNBloodBadge group="O+" size="lg" />
            <View>
              <Text style={styles.unitsNum}>2</Text>
              <Text style={styles.unitsLabel}>UNITS NEEDED</Text>
            </View>
          </View>
        </View>

        {/* Hospital */}
        <BNCard padding={14}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.hospitalIcon}>
              <CrossIcon color={BN.burgundy} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.hospitalName}>KEM Hospital</Text>
                <ShieldCheckIcon color={BN.success} size={16} />
              </View>
              <Text style={styles.hospitalAddress}>Acharya Donde Marg, Parel</Text>
              <Text style={styles.hospitalDist}>1.4 km away</Text>
            </View>
          </View>
        </BNCard>

        {/* Map */}
        <BNMap height={150} showHospital showSelf label="You are 1.4 km from this hospital" />

        {/* About */}
        <View>
          <Text style={styles.sectionLabel}>ABOUT THIS REQUEST</Text>
          <Text style={styles.aboutText}>
            Trauma patient admitted to ICU after a road accident. Requires immediate transfusion. Donors who can arrive within 60 minutes are urgently needed.
          </Text>
        </View>

        {/* Requirements */}
        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>YOU QUALIFY</Text>
          {['Your blood type: O+', 'Last donated: Feb 2025 (eligible)', 'Distance: 1.4 km'].map((t, i) => (
            <View key={i} style={styles.requirementRow}>
              <CheckIcon color={BN.success} size={14} />
              <Text style={styles.requirementText}>{t}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.notNow}>
          <Text style={styles.notNowText}>Not Now</Text>
        </TouchableOpacity>
        <BNButton onPress={() => navigation.navigate('ConfirmModal')}>Accept This Request</BNButton>
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
  headerTitle: { flex: 1, fontFamily: BN.uiBold, fontSize: 17, color: '#fff', textAlign: 'center', marginRight: 24 },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 14, paddingBottom: 100 },
  heroCard: {
    backgroundColor: '#FFF5F7',
    borderWidth: 1, borderColor: 'rgba(232,0,61,0.2)',
    borderRadius: 16, padding: 18, overflow: 'hidden', position: 'relative',
  },
  heroLogo: { position: 'absolute', top: -20, right: -20, opacity: 0.08 },
  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 },
  unitsNum: { fontFamily: BN.display, fontSize: 36, color: BN.crimson, lineHeight: 38 },
  unitsLabel: {
    fontFamily: BN.uiSemiBold, fontSize: 12, color: BN.muted,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  hospitalIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: BN.bg, alignItems: 'center', justifyContent: 'center',
  },
  hospitalName: { fontFamily: BN.uiBold, fontSize: 17, color: BN.text },
  hospitalAddress: { fontFamily: BN.ui, fontSize: 13, color: BN.muted },
  hospitalDist: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 2 },
  sectionLabel: {
    fontFamily: BN.uiBold, fontSize: 14, color: BN.muted,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
  },
  aboutText: { fontFamily: BN.ui, fontSize: 14, color: BN.text, lineHeight: 22 },
  requirementsCard: {
    backgroundColor: 'rgba(26,107,181,0.06)',
    borderWidth: 1, borderColor: 'rgba(26,107,181,0.25)',
    borderRadius: 12, padding: 14, gap: 6,
  },
  requirementsTitle: { fontFamily: BN.uiBold, fontSize: 12, color: BN.info, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 },
  requirementRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  requirementText: { fontFamily: BN.ui, fontSize: 13, color: BN.text },
  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, backgroundColor: BN.white,
    borderTopWidth: 0.5, borderTopColor: BN.divider, gap: 4,
  },
  notNow: { alignItems: 'center', paddingVertical: 8 },
  notNowText: { fontFamily: BN.ui, fontSize: 14, color: BN.muted },
});
