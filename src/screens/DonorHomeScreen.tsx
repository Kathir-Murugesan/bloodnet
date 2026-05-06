import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNLogoMark, BNBloodBadge, BNTag, BNCard, BNBottomNav, PulseDot, donorTabs } from '../components';
import { BellIcon, PinIcon, ChevronIcon } from '../icons';
import { supabase, BloodRequest } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { haversineKm, formatDistance, canDonate, timeAgo } from '../lib/distance';
import * as Location from 'expo-location';

type Props = NativeStackScreenProps<RootStackParamList, 'DonorApp'>;

export function DonorHomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { donorProfile, signOut } = useAuth();
  const [requests, setRequests] = useState<(BloodRequest & { distanceKm?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLat, setCurrentLat] = useState<number | null>(null);
  const [currentLng, setCurrentLng] = useState<number | null>(null);
  const [commitCount, setCommitCount] = useState(0);

  const fetchRequests = useCallback(async () => {
    if (!donorProfile) return;

    const lat = currentLat ?? donorProfile.latitude;
    const lng = currentLng ?? donorProfile.longitude;

    const { data } = await supabase
      .from('blood_requests')
      .select('*, hospital:hospital_profiles(*)')
      .eq('blood_group', donorProfile.blood_group)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (!data) { setLoading(false); return; }

    // Filter by 3-month cooldown
    if (!canDonate(donorProfile.last_donation_date)) {
      setRequests([]);
      setLoading(false);
      return;
    }

    // Filter by 10km + attach distance
    const filtered = data
      .map((r) => {
        const hLat = r.hospital?.latitude;
        const hLng = r.hospital?.longitude;
        const distanceKm = (lat && lng && hLat && hLng)
          ? haversineKm(lat, lng, hLat, hLng)
          : null;
        return { ...r, distanceKm };
      })
      .filter((r) => r.distanceKm === null || r.distanceKm <= 10);

    setRequests(filtered);
    setLoading(false);
  }, [donorProfile, currentLat, currentLng]);

  useEffect(() => {
    if (!donorProfile) return;
    // Get current location
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status === 'granted') {
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).then((loc) => {
          setCurrentLat(loc.coords.latitude);
          setCurrentLng(loc.coords.longitude);
          // Update stored location
          supabase.from('donor_profiles').update({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          }).eq('id', donorProfile.id);
        });
      }
    });

    // Count active commitments for badge
    supabase
      .from('request_commitments')
      .select('id', { count: 'exact' })
      .eq('donor_id', donorProfile.id)
      .eq('status', 'committed')
      .then(({ count }) => setCommitCount(count ?? 0));
  }, [donorProfile]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('donor-requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_requests' }, fetchRequests)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchRequests]);

  const urgent = requests.filter((r) => r.urgency === 'urgent');
  const scheduled = requests.filter((r) => r.urgency === 'scheduled');
  const firstName = donorProfile?.full_name?.split(' ')[0] ?? 'Donor';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BNLogoMark size={32} />
          <View>
            <Text style={styles.greeting}>{(() => { const h = new Date().getHours(); return h < 12 ? 'Good morning,' : h < 17 ? 'Good afternoon,' : 'Good evening,'; })()}</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>
          <BellIcon color="#fff" />
          {commitCount > 0 && <View style={styles.bellDot} />}
        </TouchableOpacity>
      </View>

      {canDonate(donorProfile?.last_donation_date ?? null) ? (
        <View style={styles.eligibleStrip}>
          <Text style={styles.eligibleText}>✓  You are eligible to donate.</Text>
        </View>
      ) : (
        <View style={[styles.eligibleStrip, { backgroundColor: BN.warn }]}>
          <Text style={styles.eligibleText}>⏳  You can donate again in 3 months.</Text>
        </View>
      )}

      <View style={styles.filterRow}>
        <View style={styles.filterContent}>
          {[['Type', donorProfile?.blood_group ?? '—'], ['Last donated', donorProfile?.last_donation_date ? '90+ days' : 'First time']].map(([k, v]) => (
            <View key={k} style={styles.chip}>
              <Text style={styles.chipKey}>{k} </Text>
              <Text style={styles.chipVal}>{v}</Text>
            </View>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={BN.crimson} />
          <Text style={styles.loadingText}>Finding requests near you…</Text>
        </View>
      ) : (
        <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent}>
          {urgent.length > 0 && <Text style={styles.sectionLabel}>URGENT — ACT NOW</Text>}
          {urgent.map((r) => (
            <TouchableOpacity key={r.id} onPress={() => navigation.navigate('RequestDetail', { requestId: r.id })} activeOpacity={0.85}>
              <BNCard accent="urgent" elevated padding={14}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{r.hospital?.hospital_name ?? 'Hospital'}</Text>
                  <BNTag color={BN.crimson} dot>Urgent</BNTag>
                </View>
                <View style={styles.badges}>
                  <BNBloodBadge group={r.blood_group} />
                  <View style={styles.badge}><Text style={styles.badgeText}>{r.units_needed} UNIT{r.units_needed > 1 ? 'S' : ''}</Text></View>
                  {r.distanceKm != null && (
                    <View style={styles.badgeMuted}>
                      <PinIcon color={BN.muted} size={11} />
                      <Text style={styles.badgeTextMuted}> {formatDistance(r.distanceKm)}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.postedTime}>{timeAgo(r.created_at)}</Text>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLink}>View Request</Text>
                    <ChevronIcon color={BN.crimson} />
                  </View>
                </View>
              </BNCard>
            </TouchableOpacity>
          ))}

          {scheduled.length > 0 && <Text style={[styles.sectionLabel, { color: BN.info, marginTop: 10 }]}>SCHEDULED</Text>}
          {scheduled.map((r) => (
            <TouchableOpacity key={r.id} onPress={() => navigation.navigate('RequestDetail', { requestId: r.id })} activeOpacity={0.85}>
              <BNCard accent="scheduled" padding={14}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{r.hospital?.hospital_name ?? 'Hospital'}</Text>
                  <Text style={styles.scheduledDate}>
                    {r.scheduled_at ? new Date(r.scheduled_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                  </Text>
                </View>
                <View style={styles.badges}>
                  <BNBloodBadge group={r.blood_group} />
                  <View style={styles.badge}><Text style={styles.badgeText}>{r.units_needed} UNIT{r.units_needed > 1 ? 'S' : ''}</Text></View>
                  {r.distanceKm != null && (
                    <View style={styles.badgeMuted}>
                      <PinIcon color={BN.muted} size={11} />
                      <Text style={styles.badgeTextMuted}> {formatDistance(r.distanceKm)}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.postedTime}>{timeAgo(r.created_at)}</Text>
                  <Text style={styles.viewLink}>View Request →</Text>
                </View>
              </BNCard>
            </TouchableOpacity>
          ))}

          {!loading && requests.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No requests right now</Text>
              <Text style={styles.emptySub}>You'll be notified when a matching request appears near you.</Text>
            </View>
          )}
        </ScrollView>
      )}

      <BNBottomNav
        tabs={donorTabs(0, commitCount)}
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
  header: { backgroundColor: BN.burgundy, paddingBottom: 12, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  greeting: { fontFamily: BN.ui, fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  name: { fontFamily: BN.uiSemiBold, fontSize: 16, color: '#fff' },
  bellBtn: { position: 'relative' },
  bellDot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: BN.crimson, borderWidth: 1.5, borderColor: BN.burgundy },
  eligibleStrip: { backgroundColor: BN.success, paddingHorizontal: 20, paddingVertical: 8 },
  eligibleText: { fontFamily: BN.uiSemiBold, fontSize: 13, color: '#fff' },
  filterRow: { backgroundColor: BN.white, borderBottomWidth: 0.5, borderBottomColor: BN.divider, height: 46, overflow: 'hidden' },
  filterContent: { flex: 1, paddingHorizontal: 20, gap: 6, flexDirection: 'row', alignItems: 'center' },
  chip: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: BN.bg, borderRadius: 100, borderWidth: 0.5, borderColor: BN.divider, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' },
  chipKey: { fontFamily: BN.ui, fontSize: 12, color: BN.muted },
  chipVal: { fontFamily: BN.uiBold, fontSize: 12, color: BN.text },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontFamily: BN.ui, fontSize: 14, color: BN.muted },
  feed: { flex: 1 },
  feedContent: { padding: 16, gap: 10 },
  sectionLabel: { fontFamily: BN.uiBold, fontSize: 11, color: BN.crimson, letterSpacing: 0.8, marginTop: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontFamily: BN.uiSemiBold, fontSize: 16, color: BN.text },
  scheduledDate: { fontFamily: BN.ui, fontSize: 13, color: BN.muted },
  badges: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: BN.bg, borderRadius: 100 },
  badgeText: { fontFamily: BN.uiBold, fontSize: 11, color: BN.text },
  badgeMuted: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: BN.bg, borderRadius: 100, flexDirection: 'row', alignItems: 'center' },
  badgeTextMuted: { fontFamily: BN.uiBold, fontSize: 11, color: BN.muted },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: BN.divider },
  postedTime: { fontFamily: BN.ui, fontSize: 12, color: BN.muted },
  viewRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewLink: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.crimson },
  emptyBox: { paddingVertical: 60, alignItems: 'center', gap: 8 },
  emptyTitle: { fontFamily: BN.uiSemiBold, fontSize: 16, color: BN.text },
  emptySub: { fontFamily: BN.ui, fontSize: 13, color: BN.muted, textAlign: 'center', paddingHorizontal: 20 },
});
