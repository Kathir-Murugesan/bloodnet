import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNBloodBadge, BNTag, BNMap, BNAvatar, PulseDot } from '../components';
import { BackIcon } from '../icons';
import { supabase, BloodRequest, RequestCommitment, DonorProfile } from '../lib/supabase';
import { formatDistance, haversineKm, timeAgo } from '../lib/distance';

type Props = NativeStackScreenProps<RootStackParamList, 'RequestManage'>;

interface CommitmentWithDonor extends RequestCommitment {
  donor: DonorProfile;
}

export function RequestManageScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { requestId } = route.params;
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [commitments, setCommitments] = useState<CommitmentWithDonor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [{ data: req }, { data: commits }] = await Promise.all([
      supabase
        .from('blood_requests')
        .select('*, hospital:hospital_profiles(*)')
        .eq('id', requestId)
        .single(),
      supabase
        .from('request_commitments')
        .select('*, donor:donor_profiles(*)')
        .eq('request_id', requestId)
        .eq('status', 'committed')
        .order('committed_at', { ascending: true }),
    ]);

    if (req) setRequest(req);
    if (commits) setCommitments(commits as CommitmentWithDonor[]);
    setLoading(false);
  }, [requestId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Real-time updates for donor locations
  useEffect(() => {
    const channel = supabase
      .channel(`request-manage-${requestId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'request_commitments',
        filter: `request_id=eq.${requestId}`,
      }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [requestId, fetchData]);

  if (loading || !request) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={BN.crimson} />
      </View>
    );
  }

  const hospital = (request as any).hospital;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {request.blood_group} · {request.urgency === 'urgent' ? 'Urgent' : 'Scheduled'}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <BNBloodBadge group={request.blood_group} size="lg" />
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryTitle}>{request.units_needed} unit{request.units_needed > 1 ? 's' : ''} needed</Text>
              <Text style={styles.summaryMuted}>
                {request.urgency === 'urgent' ? 'Urgent request' :
                  request.scheduled_at
                    ? new Date(request.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                    : 'Scheduled'}
              </Text>
            </View>
            {request.urgency === 'urgent'
              ? <BNTag color={BN.crimson} dot>Urgent</BNTag>
              : <BNTag color={BN.info}>Scheduled</BNTag>
            }
          </View>
          <View style={styles.committedCountRow}>
            <View style={[styles.countBadge, commitments.length === 0 && { backgroundColor: 'rgba(196,122,0,0.12)' }]}>
              <Text style={[styles.countText, commitments.length === 0 && { color: BN.warn }]}>
                {commitments.length} / {request.units_needed} committed
              </Text>
            </View>
          </View>
        </View>

        {/* Map showing donors */}
        <BNMap height={160} showHospital label={`${hospital?.hospital_name ?? 'Hospital'} · Live donor tracking`} />

        {/* Committed donors */}
        <Text style={styles.sectionLabel}>COMMITTED DONORS</Text>

        {commitments.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No donors yet</Text>
            <Text style={styles.emptySub}>Donors who accept this request will appear here.</Text>
          </View>
        ) : (
          commitments.map((c) => {
            const initials = c.donor?.full_name
              ? c.donor.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
              : '?';
            const hasLocation = c.current_latitude != null && c.current_longitude != null;
            const distKm = (hasLocation && hospital?.latitude && hospital?.longitude)
              ? haversineKm(c.current_latitude!, c.current_longitude!, hospital.latitude, hospital.longitude)
              : null;
            const isLive = hasLocation && c.location_updated_at
              ? (Date.now() - new Date(c.location_updated_at).getTime()) < 5 * 60 * 1000
              : false;

            return (
              <View key={c.id} style={styles.donorCard}>
                <BNAvatar initials={initials} size={44} />
                <View style={{ flex: 1 }}>
                  <View style={styles.donorNameRow}>
                    <Text style={styles.donorName}>{c.donor?.full_name ?? 'Donor'}</Text>
                    {isLive && (
                      <View style={styles.liveRow}>
                        <PulseDot color={BN.success} size={7} />
                        <Text style={styles.liveText}>LIVE</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.donorMeta}>
                    {c.donor?.blood_group} · Committed {timeAgo(c.committed_at)}
                  </Text>
                  {distKm != null && (
                    <Text style={styles.donorDist}>{formatDistance(distKm)} from hospital</Text>
                  )}
                  {!hasLocation && (
                    <Text style={styles.donorDist}>Location not shared yet</Text>
                  )}
                </View>
                {c.donor?.phone ? (
                  <View style={styles.phoneBadge}>
                    <Text style={styles.phoneText}>{c.donor.phone}</Text>
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    backgroundColor: BN.burgundy, paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  headerTitle: { flex: 1, fontFamily: BN.uiBold, fontSize: 17, color: '#fff', textAlign: 'center', marginRight: 22 },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 14, paddingBottom: 40 },
  summaryCard: {
    backgroundColor: BN.white, borderRadius: 14, padding: 14,
    borderWidth: 0.5, borderColor: BN.divider, gap: 10,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryTitle: { fontFamily: BN.uiSemiBold, fontSize: 16, color: BN.text },
  summaryMuted: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 2 },
  committedCountRow: { flexDirection: 'row' },
  countBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    backgroundColor: 'rgba(26,122,74,0.12)', borderRadius: 100,
  },
  countText: { fontFamily: BN.uiBold, fontSize: 12, color: BN.success },
  sectionLabel: {
    fontFamily: BN.uiBold, fontSize: 11, color: BN.muted,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  emptyBox: { paddingVertical: 40, alignItems: 'center', gap: 8 },
  emptyTitle: { fontFamily: BN.uiSemiBold, fontSize: 15, color: BN.text },
  emptySub: { fontFamily: BN.ui, fontSize: 13, color: BN.muted, textAlign: 'center' },
  donorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: BN.white, borderRadius: 12, padding: 14,
    borderWidth: 0.5, borderColor: BN.divider,
  },
  donorNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  donorName: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.text },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveText: { fontFamily: BN.uiBold, fontSize: 10, color: BN.success, letterSpacing: 0.5 },
  donorMeta: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 2 },
  donorDist: { fontFamily: BN.uiSemiBold, fontSize: 11, color: BN.info, marginTop: 2 },
  phoneBadge: {
    paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: BN.bg, borderRadius: 8, borderWidth: 0.5, borderColor: BN.divider,
  },
  phoneText: { fontFamily: 'monospace', fontSize: 11, color: BN.text },
});
