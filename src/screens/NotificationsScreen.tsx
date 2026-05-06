import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BackIcon, DropOutlineIcon, CheckIcon, CalendarIcon, ClockIcon } from '../icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { timeAgo } from '../lib/distance';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

interface NotifItem {
  id: string;
  type: 'new_request' | 'committed' | 'reminder' | 'fulfilled';
  title: string;
  body: string;
  created_at: string;
  read: boolean;
  request_id?: string;
}

function NotifIcon({ type }: { type: NotifItem['type'] }) {
  switch (type) {
    case 'new_request': return <DropOutlineIcon color={BN.crimson} size={18} />;
    case 'committed': return <CheckIcon color={BN.success} size={18} />;
    case 'reminder': return <CalendarIcon color={BN.info} size={18} />;
    case 'fulfilled': return <ClockIcon color={BN.muted} size={18} />;
  }
}

function dotColor(type: NotifItem['type']): string {
  switch (type) {
    case 'new_request': return BN.crimson;
    case 'committed': return BN.success;
    case 'reminder': return BN.info;
    case 'fulfilled': return BN.muted;
  }
}

export function NotificationsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { donorProfile, hospitalProfile, role } = useAuth();
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(true);

  const buildDonorNotifs = useCallback(async (): Promise<NotifItem[]> => {
    if (!donorProfile) return [];
    const items: NotifItem[] = [];

    // Recent active requests matching donor's blood group
    const { data: requests } = await supabase
      .from('blood_requests')
      .select('*, hospital:hospital_profiles(hospital_name)')
      .eq('blood_group', donorProfile.blood_group)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5);

    (requests ?? []).forEach((r) => {
      items.push({
        id: `req-${r.id}`,
        type: 'new_request',
        title: `${r.urgency === 'urgent' ? 'Urgent' : 'Scheduled'}: ${(r as any).hospital?.hospital_name ?? 'Hospital'} needs ${r.blood_group}`,
        body: `${r.units_needed} unit${r.units_needed > 1 ? 's' : ''} needed · Tap to view`,
        created_at: r.created_at,
        read: false,
        request_id: r.id,
      });
    });

    // Donor's own commitments
    const { data: commits } = await supabase
      .from('request_commitments')
      .select('*, request:blood_requests(blood_group, hospital:hospital_profiles(hospital_name))')
      .eq('donor_id', donorProfile.id)
      .eq('status', 'committed')
      .order('committed_at', { ascending: false })
      .limit(5);

    (commits ?? []).forEach((c) => {
      const req = (c as any).request;
      items.push({
        id: `commit-${c.id}`,
        type: 'committed',
        title: 'Thank you for committing',
        body: `${req?.hospital?.hospital_name ?? 'Hospital'} has been notified. Your location will be shared.`,
        created_at: c.committed_at ?? c.created_at,
        read: true,
      });
    });

    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [donorProfile]);

  const buildHospitalNotifs = useCallback(async (): Promise<NotifItem[]> => {
    if (!hospitalProfile) return [];
    const items: NotifItem[] = [];

    // New donors committed to hospital's requests
    const { data: myRequests } = await supabase
      .from('blood_requests')
      .select('id, blood_group')
      .eq('hospital_id', hospitalProfile.id)
      .eq('status', 'active');

    if (myRequests && myRequests.length > 0) {
      const reqIds = myRequests.map((r) => r.id);
      const { data: commits } = await supabase
        .from('request_commitments')
        .select('*, donor:donor_profiles(full_name), request:blood_requests(blood_group)')
        .in('request_id', reqIds)
        .eq('status', 'committed')
        .order('committed_at', { ascending: false })
        .limit(10);

      (commits ?? []).forEach((c) => {
        const donorName = (c as any).donor?.full_name ?? 'A donor';
        const bg = (c as any).request?.blood_group ?? '';
        items.push({
          id: `hosp-commit-${c.id}`,
          type: 'committed',
          title: `${donorName} committed to donate`,
          body: `${bg} blood · Check live location in Manage Requests`,
          created_at: c.committed_at ?? c.created_at,
          read: false,
          request_id: c.request_id,
        });
      });
    }

    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [hospitalProfile]);

  useEffect(() => {
    async function load() {
      const items = role === 'donor' ? await buildDonorNotifs() : await buildHospitalNotifs();
      setNotifications(items);
      setLoading(false);
    }
    load();
  }, [role, buildDonorNotifs, buildHospitalNotifs]);

  function handlePress(item: NotifItem) {
    if (item.request_id) {
      if (role === 'donor') {
        navigation.navigate('RequestDetail', { requestId: item.request_id });
      } else {
        navigation.navigate('RequestManage', { requestId: item.request_id });
      }
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={BN.crimson} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>All caught up</Text>
          <Text style={styles.emptySub}>New notifications will appear here.</Text>
        </View>
      ) : (
        <ScrollView style={styles.body}>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.notifRow, !item.read && styles.notifRowUnread]}
              onPress={() => handlePress(item)}
              activeOpacity={item.request_id ? 0.7 : 1}
            >
              <View style={[styles.iconCircle, { backgroundColor: dotColor(item.type) + '22' }]}>
                <NotifIcon type={item.type} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifBody}>{item.body}</Text>
                <Text style={styles.notifTime}>{timeAgo(item.created_at)}</Text>
              </View>
              {!item.read && <View style={[styles.unreadDot, { backgroundColor: dotColor(item.type) }]} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyTitle: { fontFamily: BN.uiSemiBold, fontSize: 16, color: BN.text },
  emptySub: { fontFamily: BN.ui, fontSize: 13, color: BN.muted },
  body: { flex: 1 },
  notifRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 16, borderBottomWidth: 0.5, borderBottomColor: BN.divider,
    backgroundColor: BN.white,
  },
  notifRowUnread: { backgroundColor: 'rgba(232,0,61,0.03)' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.text, lineHeight: 18 },
  notifBody: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, lineHeight: 17, marginTop: 2 },
  notifTime: { fontFamily: BN.ui, fontSize: 11, color: BN.muted, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
});
