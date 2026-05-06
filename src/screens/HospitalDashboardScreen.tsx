import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNLogoMark, BNBloodBadge, BNCard, BNBottomNav, PulseDot, hospitalTabs } from '../components';
import { BellIcon, DropOutlineIcon, UserIcon, DropIcon, PlusIcon, CalendarIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'HospitalApp'>;

export function HospitalDashboardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const metrics = [
    { l: 'Active Requests', v: '4', c: BN.crimson, icon: <DropOutlineIcon color={BN.crimson} size={18} /> },
    { l: 'Donors Committed', v: '11', c: BN.success, icon: <UserIcon color={BN.success} size={18} /> },
    { l: 'Urgent', v: '2', c: BN.crimson, icon: <BellIcon color={BN.crimson} size={18} />, pulse: true },
    { l: 'Units Secured', v: '23', c: BN.burgundy, icon: <DropIcon color={BN.burgundy} size={18} /> },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BNLogoMark size={22} />
          <Text style={styles.headerTitle}>BLOOD NET</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={{ position: 'relative' }} onPress={() => navigation.navigate('Notifications')}>
            <BellIcon color="#fff" />
            <View style={styles.bellDot} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>KEM</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeLabel}>Welcome back,</Text>
        <Text style={styles.hospitalName}>KEM Hospital</Text>

        <View style={styles.metricsGrid}>
          {metrics.map((m) => (
            <View key={m.l} style={styles.metricCard}>
              <View style={styles.metricTop}>
                <View style={[styles.metricIcon, { backgroundColor: m.c + '22' }]}>{m.icon}</View>
                {m.pulse && <PulseDot color={BN.crimson} size={8} />}
              </View>
              <Text style={[styles.metricValue, { color: m.c }]}>{m.v}</Text>
              <Text style={styles.metricLabel}>{m.l}</Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickBtn, { backgroundColor: BN.crimson }]}
              onPress={() => navigation.navigate('PostRequest')}>
              <PlusIcon color="#fff" size={14} />
              <Text style={styles.quickBtnText}>Post Urgent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickBtn, { backgroundColor: BN.info }]}>
              <CalendarIcon color="#fff" size={14} />
              <Text style={styles.quickBtnText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickBtn, styles.quickBtnOutline]}
              onPress={() => navigation.navigate('ManageRequests')}>
              <Text style={[styles.quickBtnText, { color: BN.muted }]}>View All</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Requests</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PostRequest')}>
            <Text style={styles.postNew}>Post New</Text>
          </TouchableOpacity>
        </View>

        <BNCard accent="urgent" padding={12}>
          <View style={styles.reqRow}>
            <BNBloodBadge group="O+" />
            <View style={{ flex: 1 }}>
              <Text style={styles.reqTitle}>2 units · Urgent</Text>
              <Text style={styles.reqTime}>Posted 12 min ago</Text>
            </View>
            <View style={styles.committedBadge}>
              <Text style={styles.committedText}>3 committed</Text>
            </View>
          </View>
        </BNCard>

        <BNCard accent="urgent" padding={12}>
          <View style={styles.reqRow}>
            <BNBloodBadge group="AB-" />
            <View style={{ flex: 1 }}>
              <Text style={styles.reqTitle}>1 unit · Urgent</Text>
              <Text style={styles.reqTime}>Posted 1h ago</Text>
            </View>
            <View style={[styles.committedBadge, { backgroundColor: 'rgba(196,122,0,0.12)' }]}>
              <Text style={[styles.committedText, { color: BN.warn }]}>0 committed</Text>
            </View>
          </View>
        </BNCard>

        <BNCard accent="scheduled" padding={12}>
          <View style={styles.reqRow}>
            <BNBloodBadge group="A+" />
            <View style={{ flex: 1 }}>
              <Text style={styles.reqTitle}>3 units · Jun 15, 10:00 AM</Text>
              <Text style={styles.reqTime}>Posted 2 days ago</Text>
            </View>
            <View style={styles.committedBadge}>
              <Text style={styles.committedText}>5 committed</Text>
            </View>
          </View>
        </BNCard>
      </ScrollView>

      <BNBottomNav
        tabs={hospitalTabs()}
        active={0}
        onTabPress={(i) => {
          if (i === 1) navigation.navigate('PostRequest');
          if (i === 2) navigation.navigate('ManageRequests');
          if (i === 3) navigation.navigate('HospitalProfile');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: {
    backgroundColor: BN.burgundy, paddingBottom: 14, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontFamily: BN.display, fontSize: 18, color: '#fff', letterSpacing: 1.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellDot: {
    position: 'absolute', top: -2, right: -2,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: BN.crimson, borderWidth: 1.5, borderColor: BN.burgundy,
  },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: BN.uiBold, fontSize: 12, color: '#fff' },
  content: { padding: 16, gap: 14 },
  welcomeLabel: { fontFamily: BN.ui, fontSize: 14, color: BN.muted },
  hospitalName: { fontFamily: BN.uiBold, fontSize: 24, color: BN.text },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: {
    width: '47%', backgroundColor: BN.white, borderRadius: 12, padding: 14,
    borderWidth: 0.5, borderColor: BN.divider,
  },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  metricValue: { fontFamily: BN.display, fontSize: 32, lineHeight: 36, marginTop: 10 },
  metricLabel: { fontFamily: BN.uiSemiBold, fontSize: 12, color: BN.muted, marginTop: 2 },
  quickActions: { flexDirection: 'row', gap: 8 },
  quickBtn: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 100, flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  quickBtnOutline: {
    backgroundColor: BN.white, borderWidth: 1, borderColor: BN.divider,
  },
  quickBtnText: { fontFamily: BN.uiSemiBold, fontSize: 13, color: '#fff' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  sectionTitle: { fontFamily: BN.uiBold, fontSize: 14, color: BN.text },
  postNew: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.crimson },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reqTitle: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.text },
  reqTime: { fontFamily: BN.ui, fontSize: 11, color: BN.muted },
  committedBadge: {
    backgroundColor: 'rgba(26,122,74,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100,
  },
  committedText: { fontFamily: BN.uiBold, fontSize: 11, color: BN.success },
});
