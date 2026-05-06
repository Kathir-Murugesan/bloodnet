import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNBloodBadge, BNTag, BNCard, BNBottomNav, PulseDot, donorTabs } from '../components';
import { PinIcon, ClockIcon } from '../icons';
import { supabase, RequestCommitment } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { minutesUntil } from '../lib/distance';
import { startLocationTracking } from '../lib/locationTask';

type Props = NativeStackScreenProps<RootStackParamList, 'Commitments'>;
type Tab = 'Active' | 'Upcoming' | 'Completed';

export function CommitmentsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { donorProfile } = useAuth();
  const [commitments, setCommitments] = useState<RequestCommitment[]>([]);
  const [tab, setTab] = useState<Tab>('Active');

  const fetchCommitments = useCallback(async () => {
    if (!donorProfile) return;
    const { data } = await supabase
      .from('request_commitments')
      .select('*, request:blood_requests(*, hospital:hospital_profiles(*))')
      .eq('donor_id', donorProfile.id)
      .order('committed_at', { ascending: false });
    if (data) {
      setCommitments(data as RequestCommitment[]);
      for (const c of data as RequestCommitment[]) {
        if (c.status !== 'committed') continue;
        if (c.request?.urgency === 'urgent') startLocationTracking(c.id).catch(() => {});
        else if (c.request?.scheduled_at && minutesUntil(c.request.scheduled_at) <= 60)
          startLocationTracking(c.id).catch(() => {});
      }
    }
  }, [donorProfile]);

  useEffect(() => { fetchCommitments(); }, [fetchCommitments]);

  const active = commitments.filter((c) => c.status === 'committed' && c.request?.urgency === 'urgent');
  const upcoming = commitments.filter((c) => c.status === 'committed' && c.request?.urgency === 'scheduled');
  const completed = commitments.filter((c) => c.status === 'completed' || c.status === 'cancelled');
  const displayed = tab === 'Active' ? active : tab === 'Upcoming' ? upcoming : completed;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Commitments</Text>
      </View>
      <View style={styles.tabBar}>
        {(['Active', 'Upcoming', 'Completed'] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={styles.tab} onPress={() => setTab(t)} activeOpacity={0.7}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            {tab === t && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {displayed.length === 0 && (
          <View style={styles.emptyBox}><Text style={styles.emptyText}>No {tab.toLowerCase()} commitments.</Text></View>
        )}
        {displayed.map((c) => {
          const req = c.request;
          const hosp = (req as any)?.hospital;
          const isUrgent = req?.urgency === 'urgent';
          const minsLeft = req?.scheduled_at ? minutesUntil(req.scheduled_at) : null;
          const trackingSoon = !isUrgent && minsLeft !== null && minsLeft <= 60 && minsLeft >= 0;
          return (
            <BNCard key={c.id} accent={isUrgent ? 'urgent' : 'scheduled'} elevated={isUrgent} padding={14}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{hosp?.hospital_name ?? 'Hospital'}</Text>
                {isUrgent && c.status === 'committed' ? (
                  <View style={styles.liveRow}><PulseDot color={BN.success} size={7} /><Text style={styles.liveText}>LIVE</Text></View>
                ) : c.status === 'completed' ? <BNTag color={BN.success}>Done</BNTag>
                  : c.status === 'cancelled' ? <BNTag color={BN.muted}>Cancelled</BNTag>
                  : <BNTag color={BN.success}>Committed</BNTag>}
              </View>
              <View style={styles.badges}>
                <BNBloodBadge group={req?.blood_group ?? 'O+'} />
                <View style={styles.badge}><Text style={styles.badgeText}>{req?.units_needed ?? 1} UNIT{(req?.units_needed ?? 1) > 1 ? 'S' : ''}</Text></View>
              </View>
              {isUrgent && c.status === 'committed' && (
                <View style={styles.etaRow}><PinIcon color={BN.success} size={12} /><Text style={styles.etaText}>Sharing location</Text></View>
              )}
              {!isUrgent && req?.scheduled_at && (
                <Text style={styles.schedTime}>{new Date(req.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</Text>
              )}
              {trackingSoon && (
                <View style={styles.reminderBox}><ClockIcon color={BN.info} size={16} /><Text style={styles.reminderText}>Location sharing starts in {minsLeft} min</Text></View>
              )}
              {isUrgent && c.status === 'committed' && (
                <TouchableOpacity style={styles.mapBtn} onPress={() => navigation.navigate('LiveMap', { commitmentId: c.id })}>
                  <PinIcon color="#fff" size={14} /><Text style={styles.mapBtnText}>Open Map</Text>
                </TouchableOpacity>
              )}
            </BNCard>
          );
        })}
      </ScrollView>
      <BNBottomNav tabs={donorTabs(0, active.length)} active={1} onTabPress={(i) => {
        if (i === 0) navigation.navigate('DonorApp');
        if (i === 2) navigation.navigate('DonorProfile');
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: { backgroundColor: BN.burgundy, paddingBottom: 12, paddingHorizontal: 20 },
  headerTitle: { fontFamily: BN.uiBold, fontSize: 20, color: '#fff' },
  tabBar: { backgroundColor: BN.white, flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: BN.divider },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', position: 'relative' },
  tabText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.muted },
  tabTextActive: { color: BN.crimson },
  tabIndicator: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2, backgroundColor: BN.crimson },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 12 },
  emptyBox: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { fontFamily: BN.ui, fontSize: 14, color: BN.muted },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontFamily: BN.uiSemiBold, fontSize: 16, color: BN.text },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveText: { fontFamily: BN.uiBold, fontSize: 11, color: BN.success, letterSpacing: 0.6 },
  badges: { flexDirection: 'row', gap: 6, marginTop: 10, alignItems: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: BN.bg, borderRadius: 100 },
  badgeText: { fontFamily: BN.uiBold, fontSize: 11, color: BN.text },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  etaText: { fontFamily: BN.uiSemiBold, fontSize: 12, color: BN.success },
  schedTime: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 8 },
  reminderBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, padding: 10, backgroundColor: 'rgba(26,107,181,0.08)', borderRadius: 8 },
  reminderText: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.info },
  mapBtn: { marginTop: 10, padding: 10, backgroundColor: BN.crimson, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  mapBtnText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: '#fff' },
});
