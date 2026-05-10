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

function buildMapPickerHtml(lat: number, lng: number): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>* { margin: 0; padding: 0; } #map { width: 100%; height: 100vh; } #hint { position:fixed;top:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.65);color:#fff;padding:6px 14px;border-radius:20px;font-size:13px;font-family:sans-serif;pointer-events:none; }</style>
</head>
<body>
  <div id="map"></div>
  <div id="hint">Tap anywhere to place hospital pin</div>
  <script>
    var map, marker;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: ${lat}, lng: ${lng} },
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true
      });
      marker = new google.maps.Marker({ map: null, draggable: true });
      marker.addListener('dragend', function() {
        var pos = marker.getPosition();
        window.ReactNativeWebView.postMessage(JSON.stringify({ lat: pos.lat(), lng: pos.lng() }));
      });
      map.addListener('click', function(e) {
        marker.setPosition(e.latLng);
        marker.setMap(map);
        document.getElementById('hint').style.display = 'none';
        window.ReactNativeWebView.postMessage(JSON.stringify({ lat: e.latLng.lat(), lng: e.latLng.lng() }));
      });
    }
  </script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCaxjxV0d17zYME-OR6xiLByrXJ-MFyiZ4&callback=initMap" async defer></script>
</body>
</html>`;
}

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

  // Hospital management state
  const [selectedHospital, setSelectedHospital] = useState<HospitalProfile | null>(null);
  const [showManage, setShowManage] = useState(false);
  const [showEditMap, setShowEditMap] = useState(false);
  const [editLat, setEditLat] = useState<number | null>(null);
  const [editLng, setEditLng] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, []);

  async function fetchHospitals() {
    const { data } = await supabaseAdmin.from('hospital_profiles').select('*').order('created_at', { ascending: false });
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
        await supabaseAdmin.from('hospital_profiles').update({
          latitude: hospLat,
          longitude: hospLng,
        }).eq('id', userId);
      }
      setHospName(''); setHospUsername(''); setHospPassword(''); setHospLat(null); setHospLng(null);
      await new Promise(resolve => setTimeout(resolve, 800));
      fetchHospitals();
    } finally {
      setCreating(false);
    }
  }

  async function handleEditLocation() {
    if (!selectedHospital) return;
    setEditLat(selectedHospital.latitude ?? null);
    setEditLng(selectedHospital.longitude ?? null);
    setShowManage(false);
    setShowEditMap(true);
  }

  async function handleSaveLocation() {
    if (!selectedHospital || editLat === null || editLng === null) return;
    setSaving(true);
    await supabaseAdmin.from('hospital_profiles').update({
      latitude: editLat,
      longitude: editLng,
    }).eq('id', selectedHospital.id);
    setSaving(false);
    setShowEditMap(false);
    setSelectedHospital(null);
    fetchHospitals();
  }

  async function handleDelete() {
    if (!selectedHospital) return;
    Alert.alert(
      'Delete Hospital',
      `Delete "${selectedHospital.hospital_name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setShowManage(false);
            await supabaseAdmin.from('hospital_profiles').delete().eq('id', selectedHospital.id);
            setSelectedHospital(null);
            fetchHospitals();
          },
        },
      ]
    );
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
                <TouchableOpacity onPress={() => { setSelectedHospital(h); setShowManage(true); }}>
                  <MoreVIcon color={BN.muted} size={18} />
                </TouchableOpacity>
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
              source={{ html: buildMapPickerHtml(hospLat ?? 19.076, hospLng ?? 72.877), baseUrl: 'https://localhost' }}
            />
          </View>
        </Modal>
      </Modal>

      {/* Management actions sheet */}
      <Modal visible={showManage} transparent animationType="slide" onRequestClose={() => setShowManage(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowManage(false)} />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 8 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{selectedHospital?.hospital_name}</Text>
            <View style={{ gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={styles.manageBtn} onPress={handleEditLocation}>
                <Text style={styles.manageBtnText}>📍  Update Location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.manageBtn, styles.manageBtnDanger]} onPress={handleDelete}>
                <Text style={[styles.manageBtnText, { color: BN.crimson }]}>🗑  Delete Hospital</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowManage(false)} style={{ alignItems: 'center', padding: 12 }}>
                <Text style={{ fontFamily: BN.ui, fontSize: 14, color: BN.muted }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit location map picker */}
      <Modal visible={showEditMap} animationType="slide" onRequestClose={() => setShowEditMap(false)}>
        <View style={{ flex: 1 }}>
          <View style={styles.mapPickerHeader}>
            <Text style={styles.mapPickerTitle}>
              {editLat && editLng
                ? `📍 (${editLat.toFixed(4)}, ${editLng.toFixed(4)})`
                : 'Tap to place hospital pin'}
            </Text>
            <TouchableOpacity
              style={[styles.mapPickerDone, saving && { opacity: 0.5 }]}
              onPress={handleSaveLocation}
              disabled={saving || editLat === null}
            >
              <Text style={styles.mapPickerDoneText}>{saving ? 'Saving…' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
          <WebView
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            style={{ flex: 1 }}
            source={{ html: buildMapPickerHtml(editLat ?? 19.076, editLng ?? 72.877), baseUrl: 'https://localhost' }}
            onMessage={(e) => {
              try {
                const { lat, lng } = JSON.parse(e.nativeEvent.data);
                setEditLat(lat);
                setEditLng(lng);
              } catch {}
            }}
          />
        </View>
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
  manageBtn: {
    padding: 16, borderRadius: 12, backgroundColor: BN.bg,
    borderWidth: 0.5, borderColor: BN.divider,
  },
  manageBtnDanger: { borderColor: 'rgba(232,0,61,0.3)', backgroundColor: 'rgba(232,0,61,0.04)' },
  manageBtnText: { fontFamily: BN.uiSemiBold, fontSize: 15, color: BN.text },
});
