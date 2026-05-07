import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN, shadow } from '../theme';
import { BNButton } from '../components';
import { DropIcon } from '../icons';
import { supabase, BloodRequest } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { startLocationTracking, pushLocationOnce } from '../lib/locationTask';
import { minutesUntil } from '../lib/distance';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmModal'>;

export function ConfirmModalScreen({ navigation, route }: Props) {
  const { requestId } = route.params;
  const { donorProfile } = useAuth();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [committing, setCommitting] = useState(false);

  useEffect(() => {
    supabase
      .from('blood_requests')
      .select('*, hospital:hospital_profiles(*)')
      .eq('id', requestId)
      .single()
      .then(({ data }) => { setRequest(data); setLoading(false); });
  }, [requestId]);

  async function handleConfirm() {
    if (!donorProfile || !request) return;
    setCommitting(true);
    try {
      const { data, error } = await supabase
        .from('request_commitments')
        .insert({ request_id: requestId, donor_id: donorProfile.id, status: 'committed' })
        .select()
        .single();

      if (error) {
        // Already committed — just go to map
        const { data: existing } = await supabase
          .from('request_commitments')
          .select('id')
          .eq('request_id', requestId)
          .eq('donor_id', donorProfile.id)
          .single();
        if (existing) {
          navigation.pop();
          if (request.urgency === 'urgent') {
            await startLocationTracking(existing.id);
            navigation.navigate('LiveMap', { commitmentId: existing.id });
          } else {
            navigation.navigate('LiveMap', { commitmentId: existing.id });
          }
        }
        return;
      }

      if (data) {
        // Check if this commitment fills the last unit needed
        const { count } = await supabase
          .from('request_commitments')
          .select('id', { count: 'exact' })
          .eq('request_id', requestId)
          .eq('status', 'committed');

        if ((count ?? 0) >= request.units_needed) {
          await supabase
            .from('blood_requests')
            .update({ status: 'fulfilled' })
            .eq('id', requestId);
        }

        if (request.urgency === 'urgent') {
          await startLocationTracking(data.id);
          navigation.pop();
          navigation.navigate('LiveMap', { commitmentId: data.id });
        } else {
          // Scheduled: only track 1 hour before
          const minsUntil = request.scheduled_at ? minutesUntil(request.scheduled_at) : Infinity;
          if (minsUntil <= 60) {
            await startLocationTracking(data.id);
          } else {
            await pushLocationOnce(data.id);
          }
          navigation.pop();
          navigation.navigate('LiveMap', { commitmentId: data.id });
        }
      }
    } finally {
      setCommitting(false);
    }
  }

  if (loading || !request) {
    return (
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator color={BN.crimson} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <DropIcon color={BN.crimson} size={36} />
        </View>
        <Text style={styles.title}>Confirm Your Commitment</Text>
        <Text style={styles.body}>
          By accepting, you are committing to donate{' '}
          <Text style={styles.bold}>1 unit of {request.blood_group}</Text>{' '}
          at <Text style={styles.bold}>{request.hospital?.hospital_name ?? 'the hospital'}</Text>.
        </Text>
        {request.units_needed > 1 && (
          <Text style={styles.donorsNote}>
            {request.units_needed} donors needed total for this request.
          </Text>
        )}
        <View style={styles.locationWarning}>
          <Text style={styles.locationText}>
            {request.urgency === 'urgent'
              ? 'Your location will be shared with the hospital immediately.'
              : 'Your location will be shared 1 hour before the scheduled time.'}
          </Text>
        </View>
        <View style={styles.actions}>
          <BNButton onPress={handleConfirm} loading={committing}>Yes, I'll Donate</BNButton>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBack}>
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(26,0,8,0.72)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: BN.white, borderRadius: 20, padding: 24, width: '100%', alignItems: 'center', ...shadow.elevated },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(232,0,61,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { fontFamily: BN.uiBold, fontSize: 20, color: BN.text, marginBottom: 8, textAlign: 'center' },
  body: { fontFamily: BN.ui, fontSize: 14, color: BN.muted, lineHeight: 21, textAlign: 'center', marginBottom: 8 },
  bold: { color: BN.text, fontFamily: BN.uiBold },
  locationWarning: { backgroundColor: 'rgba(232,0,61,0.06)', borderRadius: 8, padding: 10, marginBottom: 18, width: '100%' },
  locationText: { fontFamily: BN.uiSemiBold, fontSize: 12, color: BN.crimson, textAlign: 'center' },
  actions: { width: '100%', gap: 8 },
  goBack: { padding: 8, alignItems: 'center' },
  goBackText: { fontFamily: BN.ui, fontSize: 14, color: BN.muted },
  donorsNote: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, textAlign: 'center', marginBottom: 8 },
});
