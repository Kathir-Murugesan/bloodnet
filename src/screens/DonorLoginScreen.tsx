import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNAppIcon, BNInput, BNButton } from '../components';
import { EyeIcon } from '../icons';
import { supabase } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'DonorLogin'>;

export function DonorLoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignIn() {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (authError) {
        setError('Incorrect email or password. Please try again.');
      } else {
        navigation.replace('DonorApp');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandRow}>
          <BNAppIcon size={64} radius={16} />
          <Text style={styles.brandName}>BLOOD NET</Text>
        </View>
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.sub}>Sign in to continue saving lives.</Text>
        <View style={styles.form}>
          <BNInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
          />
          <View>
            <BNInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              error={error}
              trailing={
                <TouchableOpacity onPress={() => setShowPw((v) => !v)}>
                  <EyeIcon color={BN.muted} />
                </TouchableOpacity>
              }
            />
            <TouchableOpacity style={styles.forgotRow} onPress={() => Alert.alert('Password Reset', 'Contact your Blood Net admin to reset your password.')}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <BNButton onPress={handleSignIn} loading={loading}>Sign In</BNButton>
        <View style={{ flex: 1 }} />
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>New to Blood Net? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUpStep1')}>
            <Text style={styles.signupLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  content: { flexGrow: 1, padding: 20, paddingTop: 50 },
  brandRow: { alignItems: 'center', gap: 8, marginBottom: 32 },
  brandName: { fontFamily: BN.display, fontSize: 22, letterSpacing: 2, color: BN.burgundy, marginTop: 6 },
  heading: { fontFamily: BN.uiBold, fontSize: 28, color: BN.text, marginBottom: 6 },
  sub: { fontFamily: BN.ui, fontSize: 14, color: BN.muted, marginBottom: 28 },
  form: { gap: 14, marginBottom: 28 },
  forgotRow: { alignItems: 'flex-end', marginTop: 8 },
  forgot: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.crimson },
  signupRow: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 28, marginTop: 24 },
  signupText: { fontFamily: BN.ui, fontSize: 14, color: BN.muted },
  signupLink: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.crimson },
});
