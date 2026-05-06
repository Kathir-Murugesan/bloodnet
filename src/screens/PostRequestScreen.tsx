import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNButton, BNBottomNav, PulseDot, hospitalTabs } from '../components';
import { BackIcon, MinusIcon, PlusIcon, CalendarIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'PostRequest'>;

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function PostRequestScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('O+');
  const [units, setUnits] = useState(2);
  const [urgency, setUrgency] = useState<'urgent' | 'scheduled'>('urgent');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Blood Request</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Blood group */}
        <View>
          <Text style={styles.sectionLabel}>BLOOD GROUP</Text>
          <View style={styles.bloodGrid}>
            {BLOOD_GROUPS.map((g) => (
              <TouchableOpacity
                key={g} onPress={() => setSelected(g)}
                style={[styles.bloodBtn, selected === g && styles.bloodBtnActive]}
              >
                <Text style={[styles.bloodBtnText, selected === g && styles.bloodBtnTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Units stepper */}
        <View>
          <Text style={styles.sectionLabel}>UNITS NEEDED</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setUnits(Math.max(1, units - 1))}
            >
              <MinusIcon color={BN.crimson} size={18} />
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{units}</Text>
            <TouchableOpacity
              style={[styles.stepperBtn, styles.stepperBtnActive]}
              onPress={() => setUnits(units + 1)}
            >
              <PlusIcon color="#fff" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Urgency toggle */}
        <View>
          <Text style={styles.sectionLabel}>URGENCY</Text>
          <View style={styles.urgencyRow}>
            <TouchableOpacity
              style={[styles.urgencyBtn, urgency === 'urgent' && styles.urgencyBtnActive]}
              onPress={() => setUrgency('urgent')}
            >
              {urgency === 'urgent' && <PulseDot color="#fff" size={7} />}
              <Text style={[styles.urgencyText, urgency === 'urgent' && styles.urgencyTextActive]}>Urgent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.urgencyBtn, urgency === 'scheduled' && styles.urgencyBtnScheduled]}
              onPress={() => setUrgency('scheduled')}
            >
              <CalendarIcon color={urgency === 'scheduled' ? BN.info : BN.muted} size={16} />
              <Text style={[styles.urgencyText, urgency === 'scheduled' && { color: BN.info }]}>Scheduled</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View>
          <Text style={styles.sectionLabel}>NOTES (OPTIONAL)</Text>
          <View style={styles.notesBox}>
            <TextInput
              multiline
              style={styles.notesInput}
              defaultValue="Trauma patient in ICU after road accident. Donors who can arrive within 60 minutes are urgently needed."
              placeholderTextColor={BN.muted}
            />
            <Text style={styles.charCount}>120 / 280</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <BNButton onPress={() => navigation.goBack()}>Post Request</BNButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: {
    backgroundColor: BN.burgundy, paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  headerTitle: { flex: 1, fontFamily: BN.uiBold, fontSize: 17, color: '#fff', textAlign: 'center', marginRight: 22 },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 20, paddingBottom: 100 },
  sectionLabel: {
    fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.muted,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
  },
  bloodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bloodBtn: {
    width: '23%', height: 44, borderRadius: 10,
    backgroundColor: BN.white, borderWidth: 1, borderColor: BN.divider,
    alignItems: 'center', justifyContent: 'center',
  },
  bloodBtnActive: { backgroundColor: BN.crimson, borderWidth: 0 },
  bloodBtnText: { fontFamily: BN.uiBold, fontSize: 14, color: BN.text },
  bloodBtnTextActive: { color: '#fff' },
  stepper: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: BN.white, borderWidth: 1, borderColor: BN.divider,
    borderRadius: 12, padding: 12,
  },
  stepperBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: BN.bg, alignItems: 'center', justifyContent: 'center',
  },
  stepperBtnActive: { backgroundColor: BN.crimson },
  stepperValue: { fontFamily: BN.display, fontSize: 36, color: BN.crimson },
  urgencyRow: {
    flexDirection: 'row', backgroundColor: BN.bg, padding: 4, borderRadius: 12, gap: 4,
  },
  urgencyBtn: {
    flex: 1, height: 48, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  urgencyBtnActive: { backgroundColor: BN.crimson },
  urgencyBtnScheduled: { backgroundColor: BN.white },
  urgencyText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.muted },
  urgencyTextActive: { color: '#fff' },
  notesBox: {
    backgroundColor: BN.white, borderWidth: 1, borderColor: BN.divider,
    borderRadius: 12, padding: 14, minHeight: 100,
  },
  notesInput: { fontFamily: BN.ui, fontSize: 14, color: BN.text, minHeight: 80 },
  charCount: { textAlign: 'right', fontFamily: BN.ui, fontSize: 11, color: BN.muted, marginTop: 8 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, backgroundColor: BN.white,
    borderTopWidth: 0.5, borderTopColor: BN.divider,
  },
});
