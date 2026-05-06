import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN, shadow } from '../theme';
import { BNAppIcon, BNButton } from '../components';
import { CheckIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpSuccess'>;

export function SignUpSuccessScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const dropAnim = useRef(new Animated.Value(-40)).current;
  const opacAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(dropAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(opacAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.centered}>
        <View style={[styles.card, shadow.elevated]}>
          <Animated.View style={{ alignItems: 'center', transform: [{ translateY: dropAnim }], opacity: opacAnim }}>
            <BNAppIcon size={88} radius={22} />
          </Animated.View>
          <View style={styles.checkCircle}>
            <CheckIcon color="#fff" size={36} />
          </View>
          <Text style={styles.title}>Welcome to Blood Net!</Text>
          <Text style={styles.body}>
            Your first request will appear as soon as one matches your blood type nearby.
          </Text>
          <BNButton onPress={() => navigation.replace('DonorApp')}>Go to Home</BNButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: BN.white, borderRadius: 24, padding: 32,
    alignItems: 'center', width: '100%', gap: 16,
  },
  checkCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: BN.success, alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: BN.uiBold, fontSize: 22, color: BN.text, textAlign: 'center' },
  body: { fontFamily: BN.ui, fontSize: 14, color: BN.muted, lineHeight: 21, textAlign: 'center' },
});
