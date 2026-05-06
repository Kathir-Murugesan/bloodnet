import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNCard, BNBottomNav, hospitalTabs } from '../components';
import { CrossIcon, ShieldCheckIcon, LogoutIcon } from '../icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'HospitalProfile'>;

export function HospitalProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { hospitalProfile, signOut, session } = useAuth();
  const [totalRequests, setTotalRequests] = useState(0);
  const [activeRequests, setActiveRequests] = useState(0);
  const [totalDonors, setTotalDonors] = useState(0);

  useEffect(() => {
    if (!session) return;
    async function loadStats() {
      const [{ count: total }, { count: active }, { count: donors }] = await Promise.all([
        supabase.from('blood_requests').select('id', { count: 'exact' }).eq('hospital_id', session!.user.id),
        supabase.from('blood_requests').select('id', { count: 'exact' }).eq('hospital_id', session!.user.id).eq('status', 'active'),
        supabase.from('request_commitments').select('id', { count: 'exact' })
          .in('request_id',
            (await supabase.from('blood_requests').select('id').eq('hospital_id', session!.user.id))
              .data?.map((r) => r.id) ?? []
          )
          .eq('status', 'committed'),
      ]);
      setTotalRequests(total ?? 0);
      setActiveRequests(active ?? 0);
      setTotalDonors(donors ?? 0);
    }
    loadStats();
  }, [session]);

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(); navigation.replace('Splash'); } },
    ]);
  }

  const name = hospitalProfile?.hospital_name ?? 'Hospital';
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 3).toUpperCase();

  const stats = [
    { label: 'Total Requests', value: String(totalRequests) },
    { label: 'Active Now', value: String(activeRequests) },
    { label: 'Donors Committed', value: String(totalDonors) },
  ];

  const info = [
    { label: 'Hospital Name', value: hospitalProfile?.hospital_name ?? '—' },
    { label: 'Username', value: hospitalProfile?.username ?? '—' },
    { label: 'Phone', value: hospitalProfile?.phone ?? 'Not set' },
    { label: 'Address', value: hospitalProfile?.address ?? 'Not set' },
    { label: 'Member Since', value: hospitalProfile?.created_at ? new Date(hospitalProfile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={BN.gradientColors} style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.hospitalAvatar}>
            <CrossIcon color="#fff" size={32} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hospitalName}>{name}</Text>
            <View style={styles.verifiedBadge}>
              <ShieldCheckIcon color="#fff" size={12} />
              <Text style={styles.verifiedText}>Verified by Blood Net</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <LogoutIcon color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <BNCard padding={0}>
          {info.map((item, i) => (
            <View key={item.label} style={[styles.infoRow, i < info.length - 1 && styles.rowBorder]}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={[styles.infoValue, item.label === 'Username' && { fontFamily: 'monospace' }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </BNCard>

        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <LogoutIcon color={BN.crimson} size={18} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <BNBottomNav
        tabs={hospitalTabs(activeRequests)}
        active={3}
        onTabPress={(i) => {
          if (i === 0) navigation.navigate('HospitalApp');
          if (i === 1) navigation.navigate('PostRequest');
          if (i === 2) navigation.navigate('ManageRequests');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  hero: { paddingHorizontal: 20, paddingBottom: 24, gap: 18 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  hospitalAvatar: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  hospitalName: { fontFamily: BN.uiBold, fontSize: 20, color: '#fff' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  verifiedText: { fontFamily: BN.uiSemiBold, fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontFamily: BN.display, fontSize: 28, color: '#fff', lineHeight: 32 },
  statLabel: { fontFamily: BN.uiSemiBold, fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  content: { padding: 16, gap: 14, paddingBottom: 100 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: BN.divider },
  infoLabel: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.muted },
  infoValue: { fontFamily: BN.ui, fontSize: 13, color: BN.text, maxWidth: '55%', textAlign: 'right' },
  logoutRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: 14, backgroundColor: 'rgba(232,0,61,0.08)', borderRadius: 12,
  },
  logoutText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.crimson },
});
