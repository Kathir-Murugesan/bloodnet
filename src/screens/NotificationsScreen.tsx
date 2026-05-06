import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { PulseDot } from '../components';
import { BackIcon, DropOutlineIcon, CheckIcon, CalendarIcon, ClockIcon, ShieldCheckIcon } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const notifications = [
  {
    dot: BN.crimson, icon: (c: string) => <DropOutlineIcon color={c} size={18} />,
    t: 'Urgent: KEM Hospital needs O+', b: '1.4 km away. Tap to view.', time: '3m', unread: true,
  },
  {
    dot: BN.success, icon: (c: string) => <CheckIcon color={c} size={18} />,
    t: 'Thank you for committing', b: 'Your location is being shared with KEM Hospital.', time: '12m', unread: true,
  },
  {
    dot: BN.info, icon: (c: string) => <CalendarIcon color={c} size={18} />,
    t: 'Reminder: Donation tomorrow', b: '10:00 AM at Lilavati Hospital. See you there.', time: '2h', unread: false,
  },
  {
    dot: BN.crimson, icon: (c: string) => <DropOutlineIcon color={c} size={18} />,
    t: 'New request: Tata Memorial', b: 'O+ needed · 3.2 km away.', time: '5h', unread: false,
  },
  {
    dot: BN.warn, icon: (c: string) => <ClockIcon color={c} size={18} />,
    t: 'Eligibility approaching', b: 'You will be eligible to donate again in 7 days.', time: 'Yesterday', unread: false,
  },
  {
    dot: BN.success, icon: (c: string) => <ShieldCheckIcon color={c} size={18} />,
    t: 'Donation completed', b: 'Hinduja Hospital received your donation. Thank you.', time: '2d', unread: false,
  },
];

export function NotificationsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {notifications.map((n, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.item, n.unread && styles.itemUnread]}
            activeOpacity={0.7}
          >
            <View style={{ position: 'relative' }}>
              <View style={[styles.iconCircle, { backgroundColor: n.dot + '30' }]}>
                {n.icon(n.dot)}
              </View>
              {n.unread && <View style={[styles.unreadDot, { backgroundColor: n.dot }]} />}
            </View>
            <View style={styles.itemBody}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle} numberOfLines={2}>{n.t}</Text>
                <Text style={styles.itemTime}>{n.time}</Text>
              </View>
              <Text style={styles.itemSub} numberOfLines={2}>{n.b}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: {
    backgroundColor: BN.burgundy, paddingBottom: 14, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  headerTitle: { flex: 1, fontFamily: BN.uiBold, fontSize: 17, color: '#fff' },
  markRead: { fontFamily: BN.uiSemiBold, fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  item: {
    paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: BN.white,
    borderBottomWidth: 0.5, borderBottomColor: BN.divider,
  },
  itemUnread: { backgroundColor: BN.bg },
  iconCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute', top: 0, right: 0,
    width: 8, height: 8, borderRadius: 4,
    borderWidth: 1.5, borderColor: BN.white,
  },
  itemBody: { flex: 1 },
  itemHeader: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  itemTitle: { flex: 1, fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.text, lineHeight: 20 },
  itemTime: { fontFamily: BN.ui, fontSize: 11, color: BN.muted, flexShrink: 0 },
  itemSub: { fontFamily: BN.ui, fontSize: 13, color: BN.muted, marginTop: 2, lineHeight: 18 },
});
