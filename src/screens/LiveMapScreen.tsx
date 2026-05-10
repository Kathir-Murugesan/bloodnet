import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN, shadow } from '../theme';
import { BNAvatar, BNBloodBadge, PulseDot } from '../components';
import { TomTomMap } from '../components/TomTomMap';
import { supabase, RequestCommitment } from '../lib/supabase';
import { stopLocationTracking } from '../lib/locationTask';

type Props = NativeStackScreenProps<RootStackParamList, 'LiveMap'>;

export function LiveMapScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { commitmentId } = route.params;
  const [commitment, setCommitment] = useState<RequestCommitment | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distKm: string; etaMins: number } | null>(null);
  const [donorLat, setDonorLat] = useState<number | null>(null);
  const [donorLng, setDonorLng] = useState<number | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const updateTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingLocation = useRef<{ lat: number; lng: number } | null>(null);

  const fetchCommitment = useCallback(async () => {
    const { data } = await supabase
      .from('request_commitments')
      .select('*, request:blood_requests(*, hospital:hospital_profiles(*))')
      .eq('id', commitmentId)
      .single();
    if (data) setCommitment(data as RequestCommitment);
  }, [commitmentId]);

  useEffect(() => { fetchCommitment(); }, [fetchCommitment]);

  useEffect(() => {
    let active = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      locationSubscription.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 10 },
        (loc) => {
          if (!active) return;
          pendingLocation.current = { lat: loc.coords.latitude, lng: loc.coords.longitude };
          setDonorLat(loc.coords.latitude);
          setDonorLng(loc.coords.longitude);
        }
      );

      // Push to Supabase every 30 seconds
      updateTimer.current = setInterval(async () => {
        if (!pendingLocation.current) return;
        const { lat, lng } = pendingLocation.current;
        const now = new Date().toISOString();
        await supabase
          .from('request_commitments')
          .update({
            current_latitude: lat,
            current_longitude: lng,
            location_updated_at: now,
          })
          .eq('id', commitmentId);
        setLastUpdated(now);
        pendingLocation.current = null;
      }, 30_000);
    })();

    return () => {
      active = false;
      locationSubscription.current?.remove();
      if (updateTimer.current) clearInterval(updateTimer.current);
    };
  }, [commitmentId]);

  const handleStop = async () => {
    locationSubscription.current?.remove();
    if (updateTimer.current) clearInterval(updateTimer.current);
    await stopLocationTracking();
    navigation.goBack();
  };

  const req = (commitment as any)?.request;
  const hospital = req?.hospital;
  const hospitalLat: number | null = hospital?.latitude ?? null;
  const hospitalLng: number | null = hospital?.longitude ?? null;
  const hasHospitalLocation = hospitalLat != null && hospitalLng != null;
  const donor = commitment?.donor;
  const initials = donor?.full_name
    ? donor.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'ME';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Full-screen map */}
      {hasHospitalLocation ? (
        <TomTomMap
          height={812}
          centerLat={donorLat ?? hospitalLat ?? 19.076}
          centerLng={donorLng ?? hospitalLng ?? 72.877}
          hospitalLat={hospitalLat}
          hospitalLng={hospitalLng}
          hospitalName={hospital?.hospital_name}
          donorLat={donorLat ?? undefined}
          donorLng={donorLng ?? undefined}
          showRoute={!!(donorLat && donorLng)}
          onRouteInfo={setRouteInfo}
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: '#1a000816', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'DMSans_400Regular', fontSize: 14, textAlign: 'center', padding: 40 }}>
            Hospital location not configured.{'\n'}Ask the admin to update the hospital's map pin.
          </Text>
        </View>
      )}

      {/* Top info card */}
      <View style={[styles.topCard, { top: insets.top + 8 }]}>
        <View style={styles.topCardHeader}>
          <View>
            <Text style={styles.enRouteTo}>En route to</Text>
            <Text style={styles.hospitalName}>{hospital?.hospital_name ?? 'Hospital'}</Text>
          </View>
          <View style={styles.liveRow}>
            <PulseDot color={BN.success} size={8} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>
              {!hasHospitalLocation ? '—' : routeInfo?.distKm ? routeInfo.distKm + ' km' : '—'}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ETA</Text>
            <Text style={styles.statValue}>
              {!hasHospitalLocation ? '—' : routeInfo?.etaMins ? routeInfo.etaMins + ' min' : 'Locating…'}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom card */}
      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 12 }, shadow.elevated]}>
        <View style={styles.donorRow}>
          <BNAvatar initials={initials} size={44} />
          <View style={{ flex: 1 }}>
            <Text style={styles.sharingLabel}>You're sharing your location</Text>
            <Text style={styles.sharingMuted}>Hospital is tracking your arrival</Text>
          </View>
          <BNBloodBadge group={req?.blood_group ?? 'O+'} />
        </View>
        <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
          <Text style={styles.stopBtnText}>Stop Sharing Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topCard: {
    position: 'absolute', left: 16, right: 16,
    backgroundColor: 'rgba(26,0,8,0.85)', borderRadius: 16, padding: 14,
  },
  topCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  enRouteTo: { fontFamily: BN.ui, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  hospitalName: { fontFamily: BN.uiBold, fontSize: 17, color: '#fff' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveText: { fontFamily: BN.uiBold, fontSize: 12, color: '#fff', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  statBox: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10, borderRadius: 10,
  },
  statLabel: { fontFamily: BN.uiSemiBold, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  statValue: { fontFamily: BN.display, fontSize: 22, color: '#fff' },
  bottomCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: BN.white, padding: 14, borderTopLeftRadius: 16, borderTopRightRadius: 16,
    gap: 12,
  },
  donorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sharingLabel: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.text },
  sharingMuted: { fontFamily: BN.ui, fontSize: 12, color: BN.muted },
  stopBtn: {
    padding: 12, borderWidth: 1.5, borderColor: BN.crimsonDark,
    borderRadius: 12, alignItems: 'center',
  },
  stopBtnText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.crimsonDark },
});
