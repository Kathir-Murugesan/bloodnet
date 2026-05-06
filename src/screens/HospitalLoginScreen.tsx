import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNAppIcon, BNInput, BNButton } from '../components';
import { CrossIcon, EyeIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'HospitalLogin'>;

export function HospitalLoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [showPw, setShowPw] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandRow}>
          <BNAppIcon size={64} radius={16} />
          <View style={styles.brandTitle}>
            <Text style={styles.brandName}>BLOOD NET</Text>
            <CrossIcon color={BN.burgundy} size={18} />
          </View>
        </View>
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.portal}>Hospital Portal</Text>
        <View style={styles.form}>
          <BNInput label="Username" value="kemhospital" />
          <BNInput
            label="Password"
            value="••••••••••"
            secureTextEntry={!showPw}
            error="Those credentials don't match. Please try again."
            trailing={
              <TouchableOpacity onPress={() => setShowPw((v) => !v)}>
                <EyeIcon color={BN.muted} />
              </TouchableOpacity>
            }
          />
        </View>
        <BNButton onPress={() => navigation.navigate('HospitalApp')}>Sign In</BNButton>
        <View style={{ flex: 1 }} />
        <Text style={styles.contact}>Contact Blood Net Admin for access</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  content: { flexGrow: 1, padding: 20, paddingTop: 50 },
  brandRow: { alignItems: 'center', gap: 6, marginBottom: 32 },
  brandTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  brandName: { fontFamily: BN.display, fontSize: 22, letterSpacing: 2, color: BN.burgundy },
  heading: { fontFamily: BN.uiBold, fontSize: 28, color: BN.text },
  portal: { fontFamily: BN.ui, fontSize: 14, color: BN.muted, marginTop: 4, marginBottom: 28 },
  form: { gap: 14, marginBottom: 28 },
  contact: {
    textAlign: 'center', fontFamily: BN.ui, fontSize: 13, color: BN.muted,
    fontStyle: 'italic', paddingBottom: 28, marginTop: 24,
  },
});
