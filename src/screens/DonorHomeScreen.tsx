import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNLogoMark, BNBloodBadge, BNTag, BNCard, BNBottomNav, PulseDot, donorTabs } from '../components';
import { BellIcon, PinIcon, ChevronIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'DonorApp'>;

export function DonorHomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BNLogoMark size={32} />
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>Aarav</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>
          <BellIcon color="#fff" />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      {/* Eligibility strip */}
      <View style={styles.eligibleStrip}>
        <Text style={styles.eligibleText}>✓  You are eligible to donate.</Text>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {[['Type', 'O+'], ['Within', '10 km'], ['Last donated', '90+ days']].map(([k, v]) => (
          <View key={k} style={styles.chip}>
            <Text style={styles.chipKey}>{k} </Text>
            <Text style={styles.chipVal}>{v}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent}>
        <Text style={styles.sectionLabel}>URGENT — ACT NOW</Text>

        <TouchableOpacity onPress={() => navigation.navigate('RequestDetail')} activeOpacity={0.85}>
          <BNCard accent="urgent" elevated padding={14}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>KEM Hospital</Text>
              <BNTag color={BN.crimson} dot>Urgent</BNTag>
            </View>
            <View style={styles.badges}>
              <BNBloodBadge group="O+" />
              <View style={styles.badge}><Text style={styles.badgeText}>2 UNITS</Text></View>
              <View style={styles.badgeMuted}>
                <PinIcon color={BN.muted} size={11} />
                <Text style={styles.badgeTextMuted}> 1.4 km</Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.postedTime}>Posted 3 min ago</Text>
              <View style={styles.viewRow}>
                <Text style={styles.viewLink}>View Request</Text>
                <ChevronIcon color={BN.crimson} />
              </View>
            </View>
          </BNCard>
        </TouchableOpacity>

        <BNCard accent="urgent" padding={14}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Tata Memorial</Text>
            <BNTag color={BN.crimson} dot>Urgent</BNTag>
          </View>
          <View style={styles.badges}>
            <BNBloodBadge group="O+" />
            <View style={styles.badge}><Text style={styles.badgeText}>1 UNIT</Text></View>
            <View style={styles.badgeMuted}>
              <PinIcon color={BN.muted} size={11} />
              <Text style={styles.badgeTextMuted}> 3.2 km</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.postedTime}>Posted 18 min ago</Text>
            <Text style={styles.viewLink}>View Request →</Text>
          </View>
        </BNCard>

        <Text style={[styles.sectionLabel, { color: BN.info, marginTop: 10 }]}>SCHEDULED</Text>

        <BNCard accent="scheduled" padding={14}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Lilavati Hospital</Text>
            <Text style={styles.scheduledDate}>Jun 15 · 10:00 AM</Text>
          </View>
          <View style={styles.badges}>
            <BNBloodBadge group="O+" />
            <View style={styles.badge}><Text style={styles.badgeText}>3 UNITS</Text></View>
            <View style={styles.badgeMuted}>
              <PinIcon color={BN.muted} size={11} />
              <Text style={styles.badgeTextMuted}> 5.1 km</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.postedTime}>Appointment in 9 days</Text>
            <Text style={styles.viewLink}>View Request →</Text>
          </View>
        </BNCard>

        <BNCard accent="scheduled" padding={14}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Hinduja Hospital</Text>
            <Text style={styles.scheduledDate}>Jun 22 · 2:30 PM</Text>
          </View>
          <View style={styles.badges}>
            <BNBloodBadge group="O+" />
            <View style={styles.badge}><Text style={styles.badgeText}>1 UNIT</Text></View>
            <View style={styles.badgeMuted}>
              <PinIcon color={BN.muted} size={11} />
              <Text style={styles.badgeTextMuted}> 4.7 km</Text>
            </View>
          </View>
        </BNCard>
      </ScrollView>

      <BNBottomNav
        tabs={donorTabs()}
        active={0}
        onTabPress={(i) => {
          if (i === 1) navigation.navigate('Commitments');
          if (i === 2) navigation.navigate('DonorProfile');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: {
    backgroundColor: BN.burgundy, paddingBottom: 12, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  greeting: { fontFamily: BN.ui, fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  name: { fontFamily: BN.uiSemiBold, fontSize: 16, color: '#fff' },
  bellBtn: { position: 'relative' },
  bellDot: {
    position: 'absolute', top: -2, right: -2,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: BN.crimson, borderWidth: 1.5, borderColor: BN.burgundy,
  },
  eligibleStrip: {
    backgroundColor: BN.success, paddingHorizontal: 20, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center',
  },
  eligibleText: { fontFamily: BN.uiSemiBold, fontSize: 13, color: '#fff' },
  filterRow: { backgroundColor: BN.white, borderBottomWidth: 0.5, borderBottomColor: BN.divider },
  filterContent: { padding: 12, paddingHorizontal: 20, gap: 6, flexDirection: 'row' },
  chip: {
    paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: BN.bg, borderRadius: 100,
    borderWidth: 0.5, borderColor: BN.divider,
    flexDirection: 'row',
  },
  chipKey: { fontFamily: BN.ui, fontSize: 12, color: BN.muted },
  chipVal: { fontFamily: BN.uiBold, fontSize: 12, color: BN.text },
  feed: { flex: 1 },
  feedContent: { padding: 16, gap: 10 },
  sectionLabel: {
    fontFamily: BN.uiBold, fontSize: 11, color: BN.crimson,
    letterSpacing: 0.8, marginTop: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontFamily: BN.uiSemiBold, fontSize: 16, color: BN.text },
  scheduledDate: { fontFamily: BN.ui, fontSize: 13, color: BN.muted },
  badges: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' },
  badge: {
    paddingHorizontal: 10, paddingVertical: 4, backgroundColor: BN.bg,
    borderRadius: 100,
  },
  badgeText: { fontFamily: BN.uiBold, fontSize: 11, color: BN.text },
  badgeMuted: {
    paddingHorizontal: 10, paddingVertical: 4, backgroundColor: BN.bg,
    borderRadius: 100, flexDirection: 'row', alignItems: 'center',
  },
  badgeTextMuted: { fontFamily: BN.uiBold, fontSize: 11, color: BN.muted },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 12, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: BN.divider,
  },
  postedTime: { fontFamily: BN.ui, fontSize: 12, color: BN.muted },
  viewRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewLink: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.crimson },
});
