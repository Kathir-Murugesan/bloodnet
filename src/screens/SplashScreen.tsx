import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNLogoMark } from '../components';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { session, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (session && role === 'donor') {
      navigation.replace('DonorApp');
    } else if (session && role === 'hospital') {
      navigation.replace('HospitalApp');
    }
  }, [loading, session, role]);

  if (loading) {
    return (
      <LinearGradient colors={BN.gradientColors} style={styles.container}>
        <StatusBar style="light" />
        <ActivityIndicator color="#fff" size="large" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={BN.gradientColors} style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.hero}>
        <BNLogoMark size={120} />
        <Text style={styles.title}>BLOOD NET</Text>
        <Text style={styles.tagline}>Every drop counts.</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('SignUpStep1')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>I am a Donor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('HospitalLogin')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>I am a Hospital</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DonorLogin')} activeOpacity={0.7}>
          <Text style={styles.existingUser}>Already a donor? Sign in</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, paddingHorizontal: 24 },
  title: { fontFamily: BN.display, fontSize: 44, color: '#fff', letterSpacing: 3, lineHeight: 44, marginTop: 4 },
  tagline: { fontFamily: BN.ui, fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  actions: { paddingHorizontal: 24, paddingBottom: 50, gap: 12 },
  primaryBtn: { height: 52, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontFamily: BN.uiSemiBold, fontSize: 16, color: BN.crimson },
  secondaryBtn: { height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontFamily: BN.uiSemiBold, fontSize: 16, color: '#fff' },
  existingUser: { textAlign: 'center', color: 'rgba(255,255,255,0.75)', fontFamily: BN.ui, fontSize: 14, paddingVertical: 8 },
});
