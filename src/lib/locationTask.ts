import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOCATION_TASK = 'bloodnet-location-tracking';
const COMMITMENT_KEY = '@bloodnet_active_commitment';

// Must be defined at module top-level before any usage
TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
  if (error || !data?.locations?.length) return;
  const loc: Location.LocationObject = data.locations[0];
  const commitmentId = await AsyncStorage.getItem(COMMITMENT_KEY);
  if (!commitmentId) return;

  // Dynamic import to avoid circular deps
  const { supabase } = await import('./supabase');
  await supabase
    .from('request_commitments')
    .update({
      current_latitude: loc.coords.latitude,
      current_longitude: loc.coords.longitude,
      location_updated_at: new Date().toISOString(),
    })
    .eq('id', commitmentId);
});

export async function startLocationTracking(commitmentId: string): Promise<void> {
  await AsyncStorage.setItem(COMMITMENT_KEY, commitmentId);

  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== 'granted') return;

  const already = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK).catch(() => false);
  if (already) return;

  const bg = await Location.requestBackgroundPermissionsAsync();

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 30_000,
    distanceInterval: 50,
    ...(bg.status === 'granted'
      ? {
          foregroundService: {
            notificationTitle: 'Blood Net – Tracking Active',
            notificationBody: 'Your location is being shared with the hospital.',
            notificationColor: '#E8003D',
          },
        }
      : {}),
  });
}

export async function stopLocationTracking(): Promise<void> {
  await AsyncStorage.removeItem(COMMITMENT_KEY);
  const running = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK).catch(() => false);
  if (running) await Location.stopLocationUpdatesAsync(LOCATION_TASK);
}

export async function pushLocationOnce(commitmentId: string): Promise<void> {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== 'granted') return;
  const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const { supabase } = await import('./supabase');
  await supabase
    .from('request_commitments')
    .update({
      current_latitude: loc.coords.latitude,
      current_longitude: loc.coords.longitude,
      location_updated_at: new Date().toISOString(),
    })
    .eq('id', commitmentId);
}
