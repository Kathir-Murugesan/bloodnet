import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { BN, shadow } from '../theme';
import { BNInput, BNButton } from '../components';
import { LogoutIcon, CrossIcon, MoreVIcon, PlusIcon, CloseIcon, EyeIcon } from '../icons';
import { supabase, supabaseAdmin, HospitalProfile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { WebView } from 'react-native-webview';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminPanel'>;

const mapPickerHtml = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
  <link rel="stylesheet" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/maps.css">
  <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/maps-web.min.js"></script>
  <style>* { margin: 0; padding: 0; } #map { width: 100%; height: 100vh; } #hint { position:fixed;top:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.65);color:#fff;padding:6px 14px;border-radius:20px;font-size:13px;font-family:sans-serif;pointer-events:none; }</style>
</head>
<body>
  <div id="map"></div>
  <div id="hint">Tap anywhere to place hospital pin</div>
  <script>
    var map = tt.map({ key: 'apy4IVOT24PyWLcNEKSpoiMc9DKfU5Rn', container: 'map', center: [72.877, 19.076], zoom: 11 });
    var marker = null;
    map.on('click', function(e) {
      var lat = e.lngLat.lat, lng = e.lngLat.lng;
      if (marker) marker.remove();
      marker = new tt.Marker({ color: '#e8003d', draggable: true }).setLngLat([lng, lat]).addTo(map);
      marker.on('dragend', function() {
        var p = marker.getLngLat();
        window.ReactNativeWebView.postMessage(JSON.stringify({ lat: p.lat, lng: p.lng }));
      });
      document.getElementById('hint').style.display = 'none';
      window.ReactNativeWebView.postMessage(JSON.stringify({ lat: lat, lng: lng }));
    });
  </script>
</body>
</html>`;

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function AdminPanelScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { signOutAdmin } = useAuth();
  const [hospitals, setHospitals] = useState<HospitalProfile[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [hospName, setHospName] = useState('');
  const [hospUsername, setHospUsername] = useState('');
  const [hospPassword, setHospPassword] = useState('');
  const [hospLat, setHospLat] = useState<number | null>(null);
  const [hospLng, setHospLng] = useState<number | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  async function fetchHospitals() {
    const { data } = await supabase.from('hospital_profiles').select('*').order('created_at', { ascending: false });
    if (data) setHospitals(data);
  }

  async function handleCreate() {
    if (!hospName.trim()) { setFormError('Hospital name is required.'); return; }
    if (!hospUsername.trim() || hospUsername.includes(' ')) { setFormError('Username must have no spaces.'); return; }
    if (hospPassword.length < 6) { setFormError('Password must be at least 6 characters.'); return; }
    setFormError('');
    setCreating(true);
    try {
      const email = `${hospUsername.trim().toLowerCase()}@bloodnet.internal`;
      const { data, error } = await supabaseAdmin.auth.signUp({
        email,
        password: hospPassword,
        options: {
          data: {
            role: 'hospital',
            hospital_name: hospName.trim(),
            username: hospUsername.trim().toLowerCase(),
          },
        },
      });
      if (error) {
        setFormError(error.message);
        return;
      }
      Alert.alert('Success', `Hospital "${hospName}" created.\nUsername: ${hospUsername}\nPassword: ${hospPassword}`);
      setShowCreate(false);
      const userId = data.user!.id;
      if (hospLat !== null && hospLng !== null) {
        await supabase.from('hospital_profiles').update({
          latitude: hospLat,
          longitude: hospLng,
        }).eq('id', userId);
      }
      setHospName(''); setHospUsername(''); setHospPassword(''); setHospLat(null); setHospLng(null);
      fetchHospitals();
    } finally {
      setCreating(false);
    }
  }

  function handleLogout() {
    signOutAdmin();
    navigation.replace('Splash');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <TouchableOpacity onPress={handleLogout}>
          <LogoutIcon color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          {[['Total', String(hospitals.length)], ['Active', String(hospitals.length)], ['This Mo.', '—']].map(([l, v]) => (
            <View key={l} style={[styles.statCard, shadow.card]}>
              <Text style={styles.statLabel}>{l}</Text>
              <Text style={styles.statValue}>{v}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Hospitals</Text>

        <View style={styles.listContainer}>
          {hospitals.length === 0 ? (
            <Text style={styles.emptyText}>No hospitals yet. Tap + to add one.</Text>
          ) : (
            hospitals.map((h, i) => (
              <View key={h.id} style={[styles.hospitalRow, i < hospitals.length - 1 && styles.rowBorder]}>
                <View style={styles.hospitalIcon}>
                  <CrossIcon color={BN.burgundy} size={16} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hospitalName}>{h.hospital_name}</Text>
                  <Text style={styles.hospitalUser}>{h.username}</Text>
                  <Text style={styles.hospitalDate}>Created {new Date(h.created_at).toLocaleDateString()}</Text>
                </View>
                <MoreVIcon color={BN.muted} size={18} />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)}>
        <PlusIcon color="#fff" size={24} />
      </TouchableOpacity>

      <Modal visible={showCreate} transparent animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowCreate(false)} />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 8 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>New Hospital</Text>
              <TouchableOpacity style={styles.sheetClose} onPress={() => setShowCreate(false)}>
                <CloseIcon color={BN.muted} size={16} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ gap: 12 }}>
              {formError ? <Text style={styles.formError}>{formError}</Text> : null}
              <BNInput label="Hospital Name" value={hospName} onChangeText={setHospName} placeholder="City General Hospital" />
              <BNInput label="Username" value={hospUsername} onChangeText={setHospUsername} placeholder="citygeneral" />
              {/* Location picker */}
              <View>
                <Text style={styles.fieldLabel}>Hospital Location</Text>
                <TouchableOpacity style={styles.mapPickerBtn} onPress={() => setShowMapPicker(true)}>
                  {hospLat && hospLng ? (
                    <Text style={styles.mapPickerSelected}>📍 Location selected ({hospLat.toFixed(4)}, {hospLng.toFixed(4)})</Text>
                  ) : (
                    <Text style={styles.mapPickerPlaceholder}>Tap to pick location on map</Text>
                  )}
                </TouchableOpacity>
              </View>
              <BNInput
                label="Password"
                value={hospPassword}
                onChangeText={setHospPassword}
                secureTextEntry={!showPw}
                trailing={
                  <TouchableOpacity onPress={() => setShowPw((v) => !v)}>
                    <EyeIcon color={BN.muted} />
                  </TouchableOpacity>
                }
              />
              <TouchableOpacity onPress={() => setHospPassword(generatePassword())}>
                <Text style={styles.generatePw}>↻ Generate Strong Password</Text>
              </TouchableOpacity>
            </ScrollView>
            <View style={{ marginTop: 16 }}>
              <BNButton onPress={handleCreate} loading={creating}>Save Hospital</BNButton>
            </View>
          </View>
        </View>
        <Modal visible={showMapPicker} animationType="slide" onRequestClose={() => setShowMapPicker(false)}>
          <View style={{ flex: 1 }}>
            <View style={styles.mapPickerHeader}>
              <Text style={styles.mapPickerTitle}>Tap to place hospital pin</Text>
              <TouchableOpacity onPress={() => setShowMapPicker(false)} style={styles.mapPickerDone}>
                <Text style={styles.mapPickerDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <WebView
              originWhitelist={['*']}
              javaScriptEnabled
              domStorageEnabled
              style={{ flex: 1 }}
              onMessage={(e) => {
                try {
                  const { lat, lng } = JSON.parse(e.nativeEvent.data);
                  setHospLat(lat);
                  setHospLng(lng);
                } catch {}
              }}
              source={{ html: mapPickerHtml }}
            />
          </View>
        </Modal>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BN.bg },
  header: { backgroundColor: BN.burgundyDark, paddingBottom: 14, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontFamily: BN.uiBold, fontSize: 18, color: '#fff' },
  content: { padding: 20, gap: 16 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, backgroundColor: BN.white, borderRadius: 10, padding: 12, borderWidth: 0.5, borderColor: BN.divider },
  statLabel: { fontFamily: BN.uiSemiBold, fontSize: 11, color: BN.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontFamily: BN.display, fontSize: 28, color: BN.crimson, lineHeight: 32, marginTop: 4 },
  sectionLabel: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  listContainer: { backgroundColor: BN.white, borderRadius: 10, borderWidth: 0.5, borderColor: BN.divider },
  emptyText: { fontFamily: BN.ui, fontSize: 14, color: BN.muted, padding: 20, textAlign: 'center' },
  hospitalRow: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: BN.divider },
  hospitalIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: BN.bg, alignItems: 'center', justifyContent: 'center' },
  hospitalName: { fontFamily: BN.uiSemiBold, fontSize: 14, color: BN.text },
  hospitalUser: { fontFamily: 'monospace', fontSize: 12, color: BN.muted },
  hospitalDate: { fontFamily: BN.ui, fontSize: 11, color: BN.muted, marginTop: 2 },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: BN.crimson, alignItems: 'center', justifyContent: 'center', shadowColor: BN.crimson, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(26,0,8,0.6)' },
  sheet: { backgroundColor: BN.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  sheetHandle: { width: 40, height: 4, backgroundColor: BN.divider, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontFamily: BN.uiBold, fontSize: 18, color: BN.text },
  sheetClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: BN.bg, alignItems: 'center', justifyContent: 'center' },
  formError: { fontFamily: BN.ui, fontSize: 13, color: BN.crimson, backgroundColor: 'rgba(232,0,61,0.08)', padding: 10, borderRadius: 8 },
  generatePw: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.crimson },
  fieldLabel: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.muted, marginBottom: 6 },
  mapPickerBtn: { borderWidth: 1, borderColor: BN.divider, borderRadius: 10, padding: 12, backgroundColor: BN.bg },
  mapPickerSelected: { fontFamily: BN.uiSemiBold, fontSize: 13, color: BN.success },
  mapPickerPlaceholder: { fontFamily: BN.ui, fontSize: 13, color: BN.muted },
  mapPickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: BN.burgundy },
  mapPickerTitle: { fontFamily: BN.uiSemiBold, fontSize: 15, color: '#fff' },
  mapPickerDone: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: BN.crimson, borderRadius: 8 },
  mapPickerDoneText: { fontFamily: BN.uiBold, fontSize: 14, color: '#fff' },
});
