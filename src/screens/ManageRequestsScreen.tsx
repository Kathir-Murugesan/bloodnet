import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN } from '../theme';
import { BNBloodBadge, BNTag, BNCard, BNAvatar, BNBottomNav, hospitalTabs } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageRequests'>;

const requests = [
  { g: 'O+',  u: 2, posted: '12 min ago', donors: 3 },
  { g: 'AB-', u: 1, posted: '1h ago',     donors: 0 },
  { g: 'O-',  u: 2, posted: '3h ago',     donors: 4 },
];

export function ManageRequestsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Requests</Text>
      </View>

      <View style={styles.tabBar}>
        {['All', 'Urgent', 'Scheduled', 'Closed'].map((t, i) => (
          <TouchableOpacity key={t} style={styles.tab}>
            <Text style={[styles.tabText, i === 1 && styles.tabTextActive]}>{t}</Text>
            {i === 1 && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {requests.map((r, i) => (
          <BNCard key={i} accent="urgent" padding={14}>
            <View style={styles.cardTop}>
              <View style={styles.cardBadges}>
                <BNBloodBadge group={r.g} />
                <BNTag color={BN.crimson} dot>Urgent</BNTag>
              </View>
              <Text style={styles.postedTime}>{r.posted}</Text>
            </View>
            <Text style={styles.unitsText}>{r.u} unit{r.u > 1 ? 's' : ''} needed</Text>
            <Text style={styles.donorsText}>{r.donors} donor{r.donors !== 1 ? 's' : ''} committed</Text>
            <View style={styles.cardFooter}>
              <View style={styles.avatarRow}>
                {Array.from({ length: Math.min(r.donors, 3) }).map((_, j) => (
                  <View key={j} style={[styles.avatarWrap, { marginLeft: j === 0 ? 0 : -8 }]}>
                    <BNAvatar initials={['RM', 'PK', 'SS', 'AT'][j]} size={24} />
                  </View>
                ))}
                {r.donors === 0 && (
                  <Text style={styles.noDonors}>No donors yet</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('RequestManage')}>
                <Text style={styles.manageLink}>Manage →</Text>
              </TouchableOpacity>
            </View>
          </BNCard>
        ))}
      </ScrollView>

      <BNBottomNav
        tabs={hospitalTabs()}
        active={2}
        onTabPress={(i) => {
          if (i === 0) navigation.navigate('HospitalApp');
          if (i === 1) navigation.navigate('PostRequest');
          if (i === 3) navigation.navigate('HospitalProfile');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: { backgroundColor: BN.burgundy, paddingBottom: 12, paddingHorizontal: 20 },
  headerTitle: { fontFamily: BN.uiBold, fontSize: 20, color: '#fff' },
  tabBar: {
    backgroundColor: BN.white, flexDirection: 'row',
    borderBottomWidth: 0.5, borderBottomColor: BN.divider, paddingHorizontal: 8,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', position: 'relative' },
  tabText: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.muted },
  tabTextActive: { color: BN.crimson },
  tabIndicator: { position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 2, backgroundColor: BN.crimson },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardBadges: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  postedTime: { fontFamily: BN.ui, fontSize: 11, color: BN.muted },
  unitsText: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.text },
  donorsText: { fontFamily: BN.ui, fontSize: 12, color: BN.muted, marginTop: 2 },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 12, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: BN.divider,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { borderWidth: 2, borderColor: BN.white, borderRadius: 12 },
  noDonors: { fontFamily: BN.uiSemiBold, fontSize: 12, color: BN.warn },
  manageLink: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.crimson },
});
