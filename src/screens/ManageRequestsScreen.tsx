import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNBloodBadge, BNTag, BNCard, BNBottomNav, hospitalTabs } from '../components';
import { PlusIcon, CheckIcon } from '../icons';
import { supabase, BloodRequest } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { timeAgo } from '../lib/distance';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageRequests'>;

type Filter = 'All' | 'Urgent' | 'Scheduled' | 'Closed';

interface RequestWithCount extends BloodRequest {
  commitment_count: number;
}

export function ManageRequestsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const [requests, setRequests] = useState<RequestWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('All');
  const [closing, setClosing] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!session) return;
    setLoading(true);

    let query = supabase
      .from('blood_requests')
      .select('*')
      .eq('hospital_id', session.user.id)
      .order('created_at', { ascending: false });

    if (filter === 'Closed') {
      query = query.eq('status', 'fulfilled') as typeof query;
    } else if (filter === 'All') {
      query = query.in('status', ['active', 'fulfilled']) as typeof query;
    } else {
      query = query.eq('status', 'active').eq('urgency', filter.toLowerCase()) as typeof query;
    }

    const { data } = await query;
    if (!data) { setLoading(false); return; }

    const withCounts: RequestWithCount[] = await Promise.all(
      data.map(async (r) => {
        const { count } = await supabase
          .from('request_commitments')
          .select('id', { count: 'exact' })
          .eq('request_id', r.id)
          .eq('status', 'committed');
        return { ...r, commitment_count: count ?? 0 };
      })
    );

    setRequests(withCounts);
    setLoading(false);
  }, [session, filter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  async function handleClose(requestId: string) {
    Alert.alert('Close Request', 'Mark this request as fulfilled/closed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Close It',
        style: 'destructive',
        onPress: async () => {
          setClosing(requestId);
          await supabase.from('blood_requests').update({ status: 'fulfilled' }).eq('id', requestId);
          setClosing(null);
          fetchRequests();
        },
      },
    ]);
  }

  const tabs: Filter[] = ['All', 'Urgent', 'Scheduled', 'Closed'];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Requests</Text>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((t) => (
          <TouchableOpacity key={t} style={styles.tab} onPress={() => setFilter(t)}>
            <Text style={[styles.tabText, filter === t && styles.tabTextActive]}>{t}</Text>
            {filter === t && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={BN.crimson} />
        </View>
      ) : (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {requests.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No requests</Text>
              <Text style={styles.emptySub}>Post a new request to get started.</Text>
            </View>
          )}

          {requests.map((r) => (
            <BNCard key={r.id} accent={r.urgency === 'urgent' ? 'urgent' : 'scheduled'} padding={14}>
              <View style={styles.cardTop}>
                <View style={styles.cardBadges}>
                  <BNBloodBadge group={r.blood_group} />
                  {r.status === 'active'
                    ? (r.urgency === 'urgent'
                      ? <BNTag color={BN.crimson} dot>Urgent</BNTag>
                      : <BNTag color={BN.info}>Scheduled</BNTag>)
                    : <BNTag color={BN.muted}>Fulfilled</BNTag>
                  }
                </View>
                <Text style={styles.postedTime}>{timeAgo(r.created_at)}</Text>
              </View>

              <Text style={styles.unitsText}>{r.units_needed} unit{r.units_needed > 1 ? 's' : ''} needed</Text>
              {r.scheduled_at && (
                <Text style={styles.scheduledDate}>
                  {new Date(r.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </Text>
              )}

              <View style={styles.countRow}>
                <View style={[styles.countBadge, r.commitment_count === 0 && styles.countBadgeWarn]}>
                  <Text style={[styles.countText, r.commitment_count === 0 && { color: BN.warn }]}>
                    {r.commitment_count} committed
                  </Text>
                </View>
              </View>

              {r.status === 'active' && (
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => navigation.navigate('RequestManage', { requestId: r.id })}
                  >
                    <Text style={styles.viewBtnText}>View Donors →</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => handleClose(r.id)}
                    disabled={closing === r.id}
                  >
                    {closing === r.id
                      ? <ActivityIndicator size="small" color={BN.success} />
                      : <>
                          <CheckIcon color={BN.success} size={13} />
                          <Text style={styles.closeBtnText}>Mark Fulfilled</Text>
                        </>
                    }
                  </TouchableOpacity>
                </View>
              )}
            </BNCard>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PostRequest')}>
        <PlusIcon color="#fff" size={22} />
      </TouchableOpacity>

      <BNBottomNav
        tabs={hospitalTabs(requests.filter((r) => r.status === 'active').length)}
        active={2}
        onTabPress={(i) => {
          if (i === 0) navigation.navigate('HospitalApp');
          if (i === 1) navigation.navigate('PostRequest');
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
    flexDirection: 'row', alignItems: 'center',
  },
  headerTitle: { fontFamily: BN.uiBold, fontSize: 18, color: '#fff' },
  tabBar: {
    flexDirection: 'row', backgroundColor: BN.white,
    borderBottomWidth: 0.5, borderBottomColor: BN.divider,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative' },
  tabText: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.muted },
  tabTextActive: { color: BN.crimson },
  tabIndicator: {
    position: 'absolute', bottom: 0, left: '15%', right: '15%',
    height: 2, backgroundColor: BN.crimson, borderRadius: 1,
  },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 10, paddingBottom: 120 },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyBox: { paddingVertical: 60, alignItems: 'center', gap: 8 },
  emptyTitle: { fontFamily: BN.uiSemiBold, fontSize: 16, color: BN.text },
  emptySub: { fontFamily: BN.ui, fontSize: 13, color: BN.muted, textAlign: 'center' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardBadges: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  postedTime: { fontFamily: BN.ui, fontSize: 11, color: BN.muted },
  unitsText: { fontFamily: BN.uiSemiBold, fontSize: 15, color: BN.text },
  scheduledDate: { fontFamily: BN.ui, fontSize: 12, color: BN.info, marginTop: 2 },
  countRow: { flexDirection: 'row', marginTop: 8 },
  countBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    backgroundColor: 'rgba(26,122,74,0.12)', borderRadius: 100,
  },
  countBadgeWarn: { backgroundColor: 'rgba(196,122,0,0.12)' },
  countText: { fontFamily: BN.uiBold, fontSize: 12, color: BN.success },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 10, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: BN.divider, gap: 8,
  },
  viewBtn: { flex: 1 },
  viewBtnText: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.crimson },
  closeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: 'rgba(26,122,74,0.1)', borderRadius: 8,
  },
  closeBtnText: { fontFamily: BN.uiSemiBold, fontSize: 12, color: BN.success },
  fab: {
    position: 'absolute', right: 20, bottom: 80,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: BN.crimson, alignItems: 'center', justifyContent: 'center',
    shadowColor: BN.crimson, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
});
