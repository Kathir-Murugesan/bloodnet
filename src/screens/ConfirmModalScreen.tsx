import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN, shadow } from '../theme';
import { BNButton } from '../components';
import { DropIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmModal'>;

export function ConfirmModalScreen({ navigation }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <DropIcon color={BN.crimson} size={36} />
        </View>
        <Text style={styles.title}>Confirm Your Commitment</Text>
        <Text style={styles.body}>
          By accepting, you are committing to donate{' '}
          <Text style={styles.bold}>1 unit of O+</Text> at{' '}
          <Text style={styles.bold}>KEM Hospital</Text>.
        </Text>
        <View style={styles.locationWarning}>
          <Text style={styles.locationText}>
            Your location will be shared with the hospital immediately.
          </Text>
        </View>
        <View style={styles.actions}>
          <BNButton onPress={() => {
            navigation.pop();
            navigation.navigate('LiveMap');
          }}>Yes, I'll Donate</BNButton>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBack}>
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(26,0,8,0.72)',
    alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: BN.white, borderRadius: 20, padding: 24,
    width: '100%', alignItems: 'center', ...shadow.elevated,
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(232,0,61,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontFamily: BN.uiBold, fontSize: 20, color: BN.text, marginBottom: 8, textAlign: 'center' },
  body: { fontFamily: BN.ui, fontSize: 14, color: BN.muted, lineHeight: 21, textAlign: 'center', marginBottom: 8 },
  bold: { color: BN.text, fontFamily: BN.uiBold },
  locationWarning: {
    backgroundColor: 'rgba(232,0,61,0.06)', borderRadius: 8,
    padding: 10, marginBottom: 18, width: '100%',
  },
  locationText: {
    fontFamily: BN.uiSemiBold, fontSize: 12, color: BN.crimson, textAlign: 'center',
  },
  actions: { width: '100%', gap: 8 },
  goBack: { padding: 8, alignItems: 'center' },
  goBackText: { fontFamily: BN.ui, fontSize: 14, color: BN.muted },
});
