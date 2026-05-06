import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNAvatar, BNBloodBadge, BNCard, BNButton, BNBottomNav, donorTabs } from '../components';
import { LogoutIcon, CheckIcon, ChevronIcon } from '../icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { canDonate } from '../lib/distance';

type Props = NativeStackScreenProps<RootStackParamList, 'DonorProfile'>;

export function DonorProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { donorProfile, signOut, refreshProfile } = useAuth();
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [commitCount, setCommitCount] = useState(0);

  useEffect(() => {
    if (!donorProfile) return;
    supabase
      .from('request_commitments')
      .select('id', { count: 'exact' })
      .eq('donor_id', donorProfile.id)
      .eq('status', 'committed')
      .then(({ count }) => setCommitCount(count ?? 0));
  }, [donorProfile]);

  const handleUpdateDonation = useCallback(async () => {
    if (!donorProfile || !dateValue.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from('donor_profiles')
      .update({ last_donation_date: dateValue.trim() })
      .eq('id', donorProfile.id);
    setSaving(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      await refreshProfile();
      setShowDateInput(false);
      setDateValue('');
    }
  }, [donorProfile, dateValue, refreshProfile]);

  const handleSignOut = useCallback(async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: signOut },
    ]);
  }, [signOut]);

  const initials = donorProfile?.full_name
    ? donorProfile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'DN';
  const eligible = canDonate(donorProfile?.last_donation_date ?? null);
  const lastDonation = donorProfile?.last_donation_date
    ? new Date(donorProfile.last_donation_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Never';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Hero gradient */}
      <LinearGradient colors={BN.gradientColors} style={styles.hero}>
        <View style={styles.heroContent}>
          <BNAvatar initials={initials} size={72} />
          <Text style={styles.heroName}>{donorProfile?.full_name ?? 'Donor'}</Text>
          <BNBloodBadge group={donorProfile?.blood_group ?? 'O+'} size="md" />
        </View>
      </LinearGradient>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Eligibility */}
        <BNCard accent={eligible ? 'success' : undefined} elevated padding={14}>
          <View style={styles.eligRow}>
            <View style={[styles.eligIcon, { backgroundColor: eligible ? 'rgba(26,122,74,0.12)' : 'rgba(196,122,0,0.12)' }]}>
              <CheckIcon color={eligible ? BN.success : BN.warn} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.eligTitle, { color: eligible ? BN.success : BN.warn }]}>
                {eligible ? 'Eligible to donate' : 'Not yet eligible'}
              </Text>
              <Text style={styles.eligSub}>Last donated: {lastDonation}</Text>
            </View>
          </View>
        </BNCard>

        {/* Profile info */}
        <BNCard padding={14}>
          {[
            ['Full Name', donorProfile?.full_name ?? '—'],
            ['Phone', donorProfile?.phone ?? '—'],
            ['Age', donorProfile?.age ? String(donorProfile.age) : '—'],
            ['Address', donorProfile?.address ?? '—'],
          ].map(([k, v], i, arr) => (
            <View key={k} style={[styles.infoRow, i < arr.length - 1 && styles.rowBorder]}>
              <Text style={styles.infoKey}>{k}</Text>
              <Text style={styles.infoVal} numberOfLines={2}>{v}</Text>
            </View>
          ))}
        </BNCard>

        {/* Update Last Donation */}
        {!showDateInput ? (
          <BNButton variant="secondary" onPress={() => setShowDateInput(true)}>
            Update Last Donation Date
          </BNButton>
        ) : (
          <BNCard padding={16}>
            <Text style={styles.inputLabel}>Enter Donation Date</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={BN.muted}
              value={dateValue}
              onChangeText={setDateValue}
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
            />
            <View style={styles.dateActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowDateInput(false); setDateValue(''); }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateDonation} disabled={saving}>
                <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </BNCard>
        )}

        {/* Settings */}
        <View style={styles.listCard}>
          <TouchableOpacity style={[styles.settingsRow, styles.rowBorder]} onPress={() => navigation.navigate('Notifications')}>
            <Text style={styles.settingsLabel}>Notifications</Text>
            <ChevronIcon color={BN.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow} onPress={handleSignOut}>
            <Text style={[styles.settingsLabel, { color: BN.crimson }]}>Log Out</Text>
            <LogoutIcon color={BN.crimson} size={16} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BNBottomNav
        tabs={donorTabs(0, commitCount)}
        active={2}
        onTabPress={(i) => {
          if (i === 0) navigation.navigate('DonorApp');
          if (i === 1) navigation.navigate('Commitments');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  hero: { paddingBottom: 28, paddingHorizontal: 20 },
  heroContent: { alignItems: 'center', gap: 10 },
  heroName: { fontFamily: BN.uiBold, fontSize: 20, color: '#fff' },
  body: { flex: 1, marginTop: -16 },
  bodyContent: { padding: 16, gap: 12, paddingBottom: 24 },
  eligRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eligIcon: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  eligTitle: { fontFamily: BN.uiBold, fontSize: 15 },
  eligSub: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10, gap: 12 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: BN.divider },
  infoKey: { fontFamily: BN.ui, fontSize: 13, color: BN.muted, minWidth: 80 },
  infoVal: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.text, flex: 1, textAlign: 'right' },
  inputLabel: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  dateInput: {
    height: 48, borderWidth: 1, borderColor: BN.divider,
    borderRadius: 10, paddingHorizontal: 14,
    fontFamily: BN.ui, fontSize: 15, color: BN.text,
    backgroundColor: BN.bg,
  },
  dateActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  cancelBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: BN.divider },
  cancelText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.muted },
  saveBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10, backgroundColor: BN.crimson },
  saveText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: '#fff' },
  listCard: { backgroundColor: BN.white, borderRadius: 12, borderWidth: 0.5, borderColor: BN.divider },
  settingsRow: { padding: 14, flexDirection: 'row', alignItems: 'center' },
  settingsLabel: { flex: 1, fontFamily: BN.uiMedium, fontSize: 14, color: BN.text },
});
