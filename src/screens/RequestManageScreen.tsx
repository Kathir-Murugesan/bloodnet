import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNBloodBadge, BNTag, BNMap, BNAvatar, PulseDot } from '../components';
import { TomTomMap } from '../components/TomTomMap';
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
  const [routeMap, setRouteMap] = useState<Record<string, { distKm: string; etaMins: number }>>({});
  const [marking, setMarking] = useState<string | null>(null);
  const [mapDonor, setMapDonor] = useState<CommitmentWithDonor | null>(null);

  async function fetchRoutes(commits: CommitmentWithDonor[], hospitalLat: number, hospitalLng: number) {
    const results: Record<string, { distKm: string; etaMins: number }> = {};
    await Promise.all(
      commits
        .filter((c) => c.current_latitude != null && c.current_longitude != null)
        .map(async (c) => {
          try {
            const url = `https://router.project-osrm.org/route/v1/driving/${c.current_longitude},${c.current_latitude};${hospitalLng},${hospitalLat}?overview=false`;
            const res = await fetch(url);
            const json = await res.json();
            const route = json?.routes?.[0];
            if (route) {
              results[c.id] = {
                distKm: (route.distance / 1000).toFixed(1),
                etaMins: Math.round(route.duration / 60),
              };
            }
          } catch { /* ignore individual failures */ }
        })
    );
    setRouteMap(results);
  }

  async function handleMarkDonated(commitmentId: string, donorId: string) {
    Alert.alert(
      'Confirm Donation',
      'Confirm that this donor physically donated blood today?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setMarking(commitmentId);
            const today = new Date().toISOString().split('T')[0];
            await Promise.all([
              supabase.from('donor_profiles').update({ last_donation_date: today }).eq('id', donorId),
              supabase.from('request_commitments').update({ status: 'completed' }).eq('id', commitmentId),
            ]);
            setMarking(null);
            fetchData();
          },
        },
      ]
    );
  }

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
    if (commits) {
      const typedCommits = commits as CommitmentWithDonor[];
      setCommitments(typedCommits);
      const hospital = (req as any)?.hospital;
      if (hospital?.latitude && hospital?.longitude) {
        fetchRoutes(typedCommits, hospital.latitude, hospital.longitude);
      }
    }
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
        <BNMap
          height={220}
          showHospital
          label={`${hospital?.hospital_name ?? 'Hospital'} · Live donor tracking`}
          hospitalLat={hospital?.latitude ?? undefined}
          hospitalLng={hospital?.longitude ?? undefined}
          donorMarkers={commitments
            .filter((c) => c.current_latitude != null && c.current_longitude != null)
            .map((c) => ({
              lat: c.current_latitude!,
              lng: c.current_longitude!,
              initials: c.donor?.full_name
                ? c.donor.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                : '?',
              name: c.donor?.full_name ?? 'Donor',
            }))}
        />
        {!hospital?.latitude && (
          <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 12, color: BN.muted, textAlign: 'center', marginTop: -8 }}>
            Set hospital location in Admin Panel to enable live tracking map.
          </Text>
        )}

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
                  {hasLocation ? (
                    <>
                      <Text style={styles.donorDist}>
                        {routeMap[c.id]?.distKm ? routeMap[c.id].distKm + ' km by road' : 'Locating…'}
                      </Text>
                      {routeMap[c.id]?.etaMins ? (
                        <Text style={styles.donorDist}>{'~' + routeMap[c.id].etaMins + ' min away'}</Text>
                      ) : null}
                    </>
                  ) : (
                    <Text style={styles.donorDist}>Location not shared yet</Text>
                  )}
                  <TouchableOpacity
                    style={[styles.markBtn, marking === c.id && { opacity: 0.5 }]}
                    onPress={() => handleMarkDonated(c.id, c.donor.id)}
                    disabled={marking === c.id}
                  >
                    {marking === c.id
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Text style={styles.markBtnText}>✓ Mark Donated</Text>
                    }
                  </TouchableOpacity>
                  {hasLocation && (
                    <TouchableOpacity
                      style={styles.mapBtn}
                      onPress={() => setMapDonor(c)}
                    >
                      <Text style={styles.mapBtnText}>📍 View Route</Text>
                    </TouchableOpacity>
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

      <Modal
        visible={!!mapDonor}
        animationType="slide"
        onRequestClose={() => setMapDonor(null)}
      >
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={styles.mapModalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mapModalName} numberOfLines={1}>
                {mapDonor?.donor?.full_name ?? 'Donor'}
              </Text>
              <Text style={styles.mapModalSub}>Route to {hospital?.hospital_name ?? 'Hospital'}</Text>
            </View>
            <TouchableOpacity onPress={() => setMapDonor(null)} style={styles.mapModalClose}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>
          {mapDonor && (
            <TomTomMap
              height={700}
              centerLat={mapDonor.current_latitude ?? hospital?.latitude ?? 19.076}
              centerLng={mapDonor.current_longitude ?? hospital?.longitude ?? 72.877}
              hospitalLat={hospital?.latitude ?? undefined}
              hospitalLng={hospital?.longitude ?? undefined}
              donorLat={mapDonor.current_latitude ?? undefined}
              donorLng={mapDonor.current_longitude ?? undefined}
              showRoute={mapDonor.current_latitude != null && hospital?.latitude != null}
            />
          )}
          {mapDonor?.current_latitude == null && (
            <View style={styles.mapNoLocation}>
              <Text style={styles.mapNoLocationText}>
                This donor hasn't shared their location yet.
              </Text>
            </View>
          )}
        </View>
      </Modal>
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
  markBtn: {
    marginTop: 10, paddingVertical: 8, paddingHorizontal: 14,
    backgroundColor: BN.success, borderRadius: 8, alignItems: 'center',
  },
  markBtnText: { fontFamily: BN.uiBold, fontSize: 13, color: '#fff' },
  mapBtn: {
    marginTop: 6, paddingVertical: 7, paddingHorizontal: 14,
    backgroundColor: 'rgba(26,107,181,0.12)', borderRadius: 8,
    alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(26,107,181,0.3)',
  },
  mapBtnText: { fontFamily: BN.uiSemiBold, fontSize: 12, color: '#1a6bb5' },
  mapModalHeader: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: BN.burgundy, paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  mapModalName: { fontFamily: BN.uiBold, fontSize: 16, color: '#fff' },
  mapModalSub: { fontFamily: BN.ui, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  mapModalClose: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  mapNoLocation: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  mapNoLocationText: { color: 'rgba(255,255,255,0.6)', fontFamily: 'DMSans_400Regular', fontSize: 14, textAlign: 'center', padding: 32 },
});
