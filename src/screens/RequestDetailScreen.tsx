import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNLogoMark, BNBloodBadge, BNTag, BNCard, BNButton, BNMap } from '../components';
import { BackIcon, CrossIcon, ShieldCheckIcon, CheckIcon } from '../icons';
import { supabase, BloodRequest } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { haversineKm, formatDistance, canDonate } from '../lib/distance';

type Props = NativeStackScreenProps<RootStackParamList, 'RequestDetail'>;

export function RequestDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { donorProfile } = useAuth();
  const { requestId } = route.params;
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyCommitted, setAlreadyCommitted] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('blood_requests')
        .select('*, hospital:hospital_profiles(*)')
        .eq('id', requestId)
        .single();
      setRequest(data);

      if (donorProfile) {
        const { data: existing } = await supabase
          .from('request_commitments')
          .select('id')
          .eq('request_id', requestId)
          .eq('donor_id', donorProfile.id)
          .eq('status', 'committed')
          .maybeSingle();
        setAlreadyCommitted(!!existing);
      }
      setLoading(false);
    }
    load();
  }, [requestId, donorProfile]);

  if (loading || !request) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={BN.crimson} />
      </View>
    );
  }

  const distKm = (donorProfile?.latitude && donorProfile?.longitude && request.hospital?.latitude && request.hospital?.longitude)
    ? haversineKm(donorProfile.latitude, donorProfile.longitude, request.hospital.latitude, request.hospital.longitude)
    : null;

  const eligible = canDonate(donorProfile?.last_donation_date ?? null);

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
        <View style={styles.heroCard}>
          <View style={styles.heroLogo}><BNLogoMark size={140} /></View>
          {request.urgency === 'urgent'
            ? <BNTag color={BN.crimson} dot>Urgent</BNTag>
            : <BNTag color={BN.info}>Scheduled</BNTag>}
          <View style={styles.heroStats}>
            <BNBloodBadge group={request.blood_group} size="lg" />
            <View>
              <Text style={styles.unitsNum}>{request.units_needed}</Text>
              <Text style={styles.unitsLabel}>UNITS NEEDED</Text>
            </View>
          </View>
          {request.scheduled_at && (
            <Text style={styles.scheduledDate}>
              {new Date(request.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </Text>
          )}
        </View>

        <BNCard padding={14}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.hospitalIcon}><CrossIcon color={BN.burgundy} size={20} /></View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.hospitalName}>{request.hospital?.hospital_name ?? 'Hospital'}</Text>
                <ShieldCheckIcon color={BN.success} size={16} />
              </View>
              {request.hospital?.address ? <Text style={styles.hospitalAddress}>{request.hospital.address}</Text> : null}
              {distKm != null && <Text style={styles.hospitalDist}>{formatDistance(distKm)}</Text>}
            </View>
          </View>
        </BNCard>

        <BNMap
          height={150}
          showHospital
          showSelf
          label={distKm != null ? `You are ${formatDistance(distKm)} from this hospital` : 'Hospital location'}
          hospitalLat={request.hospital?.latitude ?? undefined}
          hospitalLng={request.hospital?.longitude ?? undefined}
          donorLat={donorProfile?.latitude ?? undefined}
          donorLng={donorProfile?.longitude ?? undefined}
        />

        {request.notes ? (
          <View>
            <Text style={styles.sectionLabel}>ABOUT THIS REQUEST</Text>
            <Text style={styles.aboutText}>{request.notes}</Text>
          </View>
        ) : null}

        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>YOUR ELIGIBILITY</Text>
          <View style={styles.requirementRow}>
            <CheckIcon color={BN.success} size={14} />
            <Text style={styles.requirementText}>Your blood type: {donorProfile?.blood_group}</Text>
          </View>
          <View style={styles.requirementRow}>
            {eligible ? <CheckIcon color={BN.success} size={14} /> : <Text style={{ color: BN.warn, fontSize: 14 }}>⚠</Text>}
            <Text style={styles.requirementText}>
              {eligible ? 'Donation cooldown: cleared' : 'You donated within 3 months'}
            </Text>
          </View>
          {distKm != null && (
            <View style={styles.requirementRow}>
              <CheckIcon color={BN.success} size={14} />
              <Text style={styles.requirementText}>Distance: {formatDistance(distKm)}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 16 }]}>
        {alreadyCommitted ? (
          <View style={styles.committedBanner}>
            <CheckIcon color={BN.success} size={16} />
            <Text style={styles.committedText}>You have already committed to this request.</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.notNow} onPress={() => navigation.goBack()}>
              <Text style={styles.notNowText}>Not Now</Text>
            </TouchableOpacity>
            <BNButton onPress={() => navigation.navigate('ConfirmModal', { requestId })}>Accept This Request</BNButton>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: { backgroundColor: BN.burgundy, paddingBottom: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { flex: 1, fontFamily: BN.uiBold, fontSize: 17, color: '#fff', textAlign: 'center', marginRight: 24 },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 14, paddingBottom: 100 },
  heroCard: { backgroundColor: '#FFF5F7', borderWidth: 1, borderColor: 'rgba(232,0,61,0.2)', borderRadius: 16, padding: 18, overflow: 'hidden', position: 'relative' },
  heroLogo: { position: 'absolute', top: -20, right: -20, opacity: 0.08 },
  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 },
  unitsNum: { fontFamily: BN.display, fontSize: 36, color: BN.crimson, lineHeight: 38 },
  unitsLabel: { fontFamily: BN.uiSemiBold, fontSize: 12, color: BN.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  scheduledDate: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.info, marginTop: 10 },
  hospitalIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: BN.bg, alignItems: 'center', justifyContent: 'center' },
  hospitalName: { fontFamily: BN.uiBold, fontSize: 17, color: BN.text },
  hospitalAddress: { fontFamily: BN.ui, fontSize: 13, color: BN.muted },
  hospitalDist: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 2 },
  sectionLabel: { fontFamily: BN.uiBold, fontSize: 14, color: BN.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  aboutText: { fontFamily: BN.ui, fontSize: 14, color: BN.text, lineHeight: 22 },
  requirementsCard: { backgroundColor: 'rgba(26,107,181,0.06)', borderWidth: 1, borderColor: 'rgba(26,107,181,0.25)', borderRadius: 12, padding: 14, gap: 6 },
  requirementsTitle: { fontFamily: BN.uiBold, fontSize: 12, color: BN.info, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 },
  requirementRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  requirementText: { fontFamily: BN.ui, fontSize: 13, color: BN.text },
  cta: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: BN.white, borderTopWidth: 0.5, borderTopColor: BN.divider, gap: 4 },
  notNow: { alignItems: 'center', paddingVertical: 8 },
  notNowText: { fontFamily: BN.ui, fontSize: 14, color: BN.muted },
  committedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, backgroundColor: 'rgba(26,122,74,0.08)', borderRadius: 10 },
  committedText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.success },
});
