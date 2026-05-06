import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNInput, BNButton } from '../components';
import { BackIcon, PinIcon, CheckIcon, ShieldCheckIcon } from '../icons';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpStep2'>;

export function SignUpStep2Screen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { fullName, age, bloodGroup, phone, email, password } = route.params;

  const [hasDonated, setHasDonated] = useState<boolean | null>(null);
  const [lastDonation, setLastDonation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    setError('');
    setLoading(true);
    try {
      // Get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      let lat: number | null = null;
      let lng: number | null = null;
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        lat = loc.coords.latitude;
        lng = loc.coords.longitude;
      }

      // Sign up with Supabase Auth — trigger will create donor_profile + user_role
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            role: 'donor',
            full_name: fullName,
            phone,
            blood_group: bloodGroup,
            age,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Update donor profile with location and last donation date
      if (data.user) {
        await supabase.from('donor_profiles').update({
          latitude: lat,
          longitude: lng,
          last_donation_date: hasDonated && lastDonation ? lastDonation : null,
          updated_at: new Date().toISOString(),
        }).eq('id', data.user.id);
      }

      navigation.replace('SignUpSuccess');
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const eligible = hasDonated === false || (hasDonated === true && lastDonation !== '');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.progress}>
          <View style={[styles.progressBar, { backgroundColor: BN.crimson }]} />
          <View style={[styles.progressBar, { backgroundColor: BN.crimson }]} />
        </View>
        <Text style={styles.stepLabel}>Step 2 of 2 · Location & History</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        <View style={styles.locationInfo}>
          <PinIcon color={BN.crimson} size={18} />
          <Text style={styles.locationText}>
            Your location will be detected automatically when you tap Create Account. This is used to match you with nearby requests.
          </Text>
        </View>

        <View>
          <Text style={styles.qLabel}>Have you donated blood before?</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, hasDonated === true && styles.toggleBtnActive]}
              onPress={() => setHasDonated(true)}
            >
              <Text style={[styles.toggleText, hasDonated === true && styles.toggleTextActive]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, hasDonated === false && styles.toggleBtnActive]}
              onPress={() => setHasDonated(false)}
            >
              <Text style={[styles.toggleText, hasDonated === false && styles.toggleTextActive]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        {hasDonated === true && (
          <BNInput
            label="Last Donation Date (YYYY-MM-DD)"
            value={lastDonation}
            onChangeText={setLastDonation}
            placeholder="2024-12-15"
          />
        )}

        {eligible && hasDonated !== null && (
          <View style={styles.eligibleBanner}>
            <View style={styles.eligibleIcon}>
              <CheckIcon color="#fff" size={18} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eligibleTitle}>
                {hasDonated === false
                  ? "You're immediately eligible to donate!"
                  : "Thanks for your history — we'll check your eligibility automatically."}
              </Text>
              <Text style={styles.eligibleSub}>We'll notify you of nearby requests right away.</Text>
            </View>
          </View>
        )}

        <View style={styles.privacyCard}>
          <ShieldCheckIcon color={BN.info} size={22} />
          <Text style={styles.privacyText}>
            Your data is encrypted and only shared with hospitals when you accept a request.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={BN.crimson} />
            <Text style={styles.loadingText}>Creating your account…</Text>
          </View>
        ) : (
          <BNButton onPress={handleCreate} disabled={hasDonated === null}>Create My Account</BNButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: { backgroundColor: BN.burgundy, paddingBottom: 16, paddingHorizontal: 16, gap: 4 },
  headerTitle: { fontFamily: BN.uiSemiBold, fontSize: 17, color: '#fff', marginBottom: 16 },
  progress: { flexDirection: 'row', gap: 8 },
  progressBar: { flex: 1, height: 6, borderRadius: 3 },
  stepLabel: { fontFamily: BN.ui, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },
  errorBanner: { fontFamily: BN.ui, fontSize: 13, color: BN.crimson, backgroundColor: 'rgba(232,0,61,0.08)', padding: 12, borderRadius: 8 },
  locationInfo: { flexDirection: 'row', gap: 10, backgroundColor: BN.white, borderWidth: 0.5, borderColor: BN.divider, borderRadius: 12, padding: 14 },
  locationText: { flex: 1, fontFamily: BN.ui, fontSize: 13, color: BN.muted, lineHeight: 20 },
  qLabel: { fontFamily: BN.uiSemiBold, fontSize: 14, marginBottom: 10, color: BN.text },
  toggleRow: { flexDirection: 'row', backgroundColor: BN.bg, padding: 4, borderRadius: 12 },
  toggleBtn: { flex: 1, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  toggleBtnActive: { backgroundColor: BN.crimson },
  toggleText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.muted },
  toggleTextActive: { color: '#fff' },
  eligibleBanner: { backgroundColor: 'rgba(26,122,74,0.08)', borderWidth: 1, borderColor: 'rgba(26,122,74,0.3)', borderRadius: 10, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  eligibleIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: BN.success, alignItems: 'center', justifyContent: 'center' },
  eligibleTitle: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.success },
  eligibleSub: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 2 },
  privacyCard: { backgroundColor: BN.white, borderWidth: 0.5, borderColor: BN.divider, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  privacyText: { flex: 1, fontFamily: BN.ui, fontSize: 13, color: BN.muted, lineHeight: 20 },
  footer: { padding: 20, paddingBottom: 28, borderTopWidth: 0.5, borderTopColor: BN.divider, backgroundColor: BN.white },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 52 },
  loadingText: { fontFamily: BN.ui, fontSize: 14, color: BN.muted },
});
