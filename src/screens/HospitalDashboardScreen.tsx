import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNLogoMark, BNBloodBadge, BNCard, BNBottomNav, PulseDot, hospitalTabs } from '../components';
import { BellIcon, DropOutlineIcon, UserIcon, DropIcon, PlusIcon, CalendarIcon } from '../icons';
import { supabase, BloodRequest } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { timeAgo } from '../lib/distance';

type Props = NativeStackScreenProps<RootStackParamList, 'HospitalApp'>;

interface RequestWithCount extends BloodRequest {
  commitment_count: number;
}

export function HospitalDashboardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { session, hospitalProfile } = useAuth();
  const [requests, setRequests] = useState<RequestWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [committedCount, setCommittedCount] = useState(0);
  const [urgentCount, setUrgentCount] = useState(0);
  const [manageCount, setManageCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!session) return;
    const hospitalId = session.user.id;

    const { data: reqs } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('hospital_id', hospitalId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!reqs) { setLoading(false); return; }

    // Fetch commitment counts for each request
    const withCounts: RequestWithCount[] = await Promise.all(
      reqs.map(async (r) => {
        const { count } = await supabase
          .from('request_commitments')
          .select('id', { count: 'exact' })
          .eq('request_id', r.id)
          .eq('status', 'committed');
        return { ...r, commitment_count: count ?? 0 };
      })
    );

    setRequests(withCounts);
    setActiveCount(reqs.length);
    setUrgentCount(reqs.filter((r) => r.urgency === 'urgent').length);

    const totalCommitted = withCounts.reduce((sum, r) => sum + r.commitment_count, 0);
    setCommittedCount(totalCommitted);

    const { count: manage } = await supabase
      .from('blood_requests')
      .select('id', { count: 'exact' })
      .eq('hospital_id', hospitalId)
      .eq('status', 'active');
    setManageCount(manage ?? 0);

    setLoading(false);
  }, [session]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Real-time subscription
  useEffect(() => {
    if (!session) return;
    const channel = supabase
      .channel('hospital-dashboard')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'blood_requests',
        filter: `hospital_id=eq.${session.user.id}`,
      }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session, fetchData]);

  const hospitalName = hospitalProfile?.hospital_name ?? 'Hospital';
  const abbr = hospitalName.split(' ').map((w: string) => w[0]).join('').slice(0, 3).toUpperCase();

  const metrics = [
    { l: 'Active Requests', v: String(activeCount), c: BN.crimson, icon: <DropOutlineIcon color={BN.crimson} size={18} /> },
    { l: 'Donors Committed', v: String(committedCount), c: BN.success, icon: <UserIcon color={BN.success} size={18} /> },
    { l: 'Urgent', v: String(urgentCount), c: BN.crimson, icon: <BellIcon color={BN.crimson} size={18} />, pulse: urgentCount > 0 },
    { l: 'Units Needed', v: String(requests.reduce((s, r) => s + r.units_needed, 0)), c: BN.burgundy, icon: <DropIcon color={BN.burgundy} size={18} /> },
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
            {urgentCount > 0 && <View style={styles.bellDot} />}
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{abbr}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeLabel}>Welcome back,</Text>
        <Text style={styles.hospitalName}>{hospitalName}</Text>

        {loading ? (
          <ActivityIndicator color={BN.crimson} style={{ marginVertical: 20 }} />
        ) : (
          <>
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
                <TouchableOpacity style={[styles.quickBtn, { backgroundColor: BN.info }]}
                  onPress={() => navigation.navigate('PostRequest')}>
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

            {requests.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>No active requests</Text>
                <Text style={styles.emptySub}>Post a request to find donors near your hospital.</Text>
              </View>
            )}

            {requests.map((r) => (
              <BNCard key={r.id} accent={r.urgency === 'urgent' ? 'urgent' : 'scheduled'} padding={12}>
                <View style={styles.reqRow}>
                  <BNBloodBadge group={r.blood_group} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reqTitle}>
                      {r.units_needed} unit{r.units_needed > 1 ? 's' : ''} · {r.urgency === 'urgent' ? 'Urgent' : (r.scheduled_at ? new Date(r.scheduled_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Scheduled')}
                    </Text>
                    <Text style={styles.reqTime}>{timeAgo(r.created_at)}</Text>
                  </View>
                  <View style={[
                    styles.committedBadge,
                    r.commitment_count === 0 ? { backgroundColor: 'rgba(196,122,0,0.12)' } : {},
                  ]}>
                    <Text style={[
                      styles.committedText,
                      r.commitment_count === 0 ? { color: BN.warn } : {},
                    ]}>
                      {r.commitment_count} committed
                    </Text>
                  </View>
                </View>
              </BNCard>
            ))}
          </>
        )}
      </ScrollView>

      <BNBottomNav
        tabs={hospitalTabs(manageCount)}
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
  quickBtnOutline: { backgroundColor: BN.white, borderWidth: 1, borderColor: BN.divider },
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
  emptyBox: { paddingVertical: 40, alignItems: 'center', gap: 8 },
  emptyTitle: { fontFamily: BN.uiSemiBold, fontSize: 16, color: BN.text },
  emptySub: { fontFamily: BN.ui, fontSize: 13, color: BN.muted, textAlign: 'center' },
});
