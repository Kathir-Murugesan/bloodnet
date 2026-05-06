import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNInput, BNButton } from '../components';
import { BackIcon, EyeIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpStep1'>;

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function SignUpStep1Screen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('O+');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.progress}>
          <View style={[styles.progressBar, { backgroundColor: BN.crimson }]} />
          <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
        </View>
        <Text style={styles.stepLabel}>Step 1 of 2 · Personal Info</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
        <BNInput label="Full Name" value="Aarav Mehta" />
        <BNInput label="Age" value="28" />
        <View>
          <Text style={styles.sectionLabel}>Blood Group</Text>
          <View style={styles.bloodGrid}>
            {BLOOD_GROUPS.map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setSelected(g)}
                style={[styles.bloodBtn, selected === g && styles.bloodBtnActive]}
              >
                <Text style={[styles.bloodBtnText, selected === g && styles.bloodBtnTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <BNInput label="Phone Number" value="+91 98765 43210" />
        <BNInput label="Email Address" value="aarav.m@gmail.com" />
        <BNInput label="Password" value="••••••••••" secureTextEntry trailing={<EyeIcon color={BN.muted} />} />
        <BNInput label="Confirm Password" value="••••••••••" secureTextEntry trailing={<EyeIcon color={BN.muted} />} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('DonorLogin')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <BNButton onPress={() => navigation.navigate('SignUpStep2')}>Continue</BNButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: { backgroundColor: BN.burgundy, paddingBottom: 16, paddingHorizontal: 16 },
  backBtn: { padding: 4, marginBottom: 4 },
  headerTitle: { fontFamily: BN.uiSemiBold, fontSize: 17, color: '#fff', marginBottom: 16 },
  progress: { flexDirection: 'row', gap: 8 },
  progressBar: { flex: 1, height: 6, borderRadius: 3 },
  stepLabel: { fontFamily: BN.ui, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 14 },
  sectionLabel: { fontFamily: BN.uiMedium, fontSize: 12, color: BN.muted, marginBottom: 8 },
  bloodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bloodBtn: {
    width: '23%', height: 40, borderRadius: 100,
    backgroundColor: BN.white, borderWidth: 1, borderColor: BN.divider,
    alignItems: 'center', justifyContent: 'center',
  },
  bloodBtnActive: { backgroundColor: BN.crimson, borderWidth: 0 },
  bloodBtnText: { fontFamily: BN.uiBold, fontSize: 13, letterSpacing: 0.4, color: BN.muted },
  bloodBtnTextActive: { color: '#fff' },
  footer: {
    padding: 20, paddingBottom: 28,
    borderTopWidth: 0.5, borderTopColor: BN.divider,
    backgroundColor: BN.white, gap: 12,
  },
  signInRow: { flexDirection: 'row', justifyContent: 'center' },
  signInText: { fontFamily: BN.ui, fontSize: 14, color: BN.muted },
  signInLink: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.crimson },
});
