import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  BarlowCondensed_700Bold,
  BarlowCondensed_800ExtraBold,
  BarlowCondensed_900Black,
} from '@expo-google-fonts/barlow-condensed';

// Register background location task at startup
import './src/lib/locationTask';

import { AuthProvider } from './src/contexts/AuthContext';
import type { RootStackParamList } from './src/types/navigation';

// Auth screens
import { SplashScreen as BNSplash } from './src/screens/SplashScreen';
import { DonorLoginScreen } from './src/screens/DonorLoginScreen';
import { HospitalLoginScreen } from './src/screens/HospitalLoginScreen';
import { SignUpStep1Screen } from './src/screens/SignUpStep1Screen';
import { SignUpStep2Screen } from './src/screens/SignUpStep2Screen';
import { SignUpSuccessScreen } from './src/screens/SignUpSuccessScreen';
import { AdminPanelScreen } from './src/screens/AdminPanelScreen';

// Donor screens
import { DonorHomeScreen } from './src/screens/DonorHomeScreen';
import { RequestDetailScreen } from './src/screens/RequestDetailScreen';
import { ConfirmModalScreen } from './src/screens/ConfirmModalScreen';
import { CommitmentsScreen } from './src/screens/CommitmentsScreen';
import { LiveMapScreen } from './src/screens/LiveMapScreen';
import { DonorProfileScreen } from './src/screens/DonorProfileScreen';

// Hospital screens
import { HospitalDashboardScreen } from './src/screens/HospitalDashboardScreen';
import { PostRequestScreen } from './src/screens/PostRequestScreen';
import { ManageRequestsScreen } from './src/screens/ManageRequestsScreen';
import { RequestManageScreen } from './src/screens/RequestManageScreen';
import { HospitalProfileScreen } from './src/screens/HospitalProfileScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          DMSans_400Regular,
          DMSans_500Medium,
          DMSans_700Bold,
          BarlowCondensed_700Bold,
          BarlowCondensed_800ExtraBold,
          BarlowCondensed_900Black,
        });
      } catch (e) {
        console.warn('Font loading error:', e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
          >
            {/* ── Auth ────────────────────────────────────────────── */}
            <Stack.Screen name="Splash" component={BNSplash} />
            <Stack.Screen name="DonorLogin" component={DonorLoginScreen} />
            <Stack.Screen name="HospitalLogin" component={HospitalLoginScreen} />
            <Stack.Screen name="SignUpStep1" component={SignUpStep1Screen} />
            <Stack.Screen name="SignUpStep2" component={SignUpStep2Screen} />
            <Stack.Screen name="SignUpSuccess" component={SignUpSuccessScreen} />
            <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
            {/* AdminCreate is rendered as a Modal inside AdminPanelScreen */}

            {/* ── Donor ───────────────────────────────────────────── */}
            <Stack.Screen name="DonorApp" component={DonorHomeScreen} />
            <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
            <Stack.Screen
              name="ConfirmModal"
              component={ConfirmModalScreen}
              options={{ presentation: 'transparentModal', animation: 'fade' }}
            />
            <Stack.Screen name="Commitments" component={CommitmentsScreen} />
            <Stack.Screen name="LiveMap" component={LiveMapScreen} />
            <Stack.Screen name="DonorProfile" component={DonorProfileScreen} />

            {/* ── Hospital ────────────────────────────────────────── */}
            <Stack.Screen name="HospitalApp" component={HospitalDashboardScreen} />
            <Stack.Screen name="PostRequest" component={PostRequestScreen} />
            <Stack.Screen name="ManageRequests" component={ManageRequestsScreen} />
            <Stack.Screen name="RequestManage" component={RequestManageScreen} />
            <Stack.Screen name="HospitalProfile" component={HospitalProfileScreen} />

            {/* ── Cross-cutting ────────────────────────────────────── */}
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
