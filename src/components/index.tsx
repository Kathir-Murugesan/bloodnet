import React, { useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, Image, ScrollView, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Path, Line, Circle, G } from 'react-native-svg';
import { BN, shadow } from '../theme';
import {
  CheckIcon, CrossIcon, PinIcon, DropIcon,
  PlusCircleIcon, ClipboardIcon, HospitalIcon, CalendarIcon, HomeIcon, UserIcon,
  BellIcon, GridIcon,
} from '../icons';
import { TomTomMap } from './TomTomMap';

// ── Logo ──────────────────────────────────────────────────────────────────────
const logoSrc = require('../../assets/bloodnet-logo.png');

export function BNLogoMark({ size = 32 }: { size?: number }) {
  return (
    <Image
      source={logoSrc}
      style={{ width: size, height: size, resizeMode: 'contain' }}
    />
  );
}

export function BNAppIcon({ size = 88, radius = 20 }: { size?: number; radius?: number }) {
  return (
    <Image
      source={logoSrc}
      style={{
        width: size, height: size, borderRadius: radius,
        ...shadow.elevated,
      }}
    />
  );
}

// ── Pulse dot (animated) ─────────────────────────────────────────────────────
export function PulseDot({ color, size = 8 }: { color: string; size?: number }) {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1.4, duration: 600, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View
      style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color,
        transform: [{ scale: anim }],
      }}
    />
  );
}

// ── Blood group badge ─────────────────────────────────────────────────────────
type BadgeSize = 'sm' | 'md' | 'lg';
export function BNBloodBadge({ group, size = 'sm' }: { group: string; size?: BadgeSize }) {
  const rare = group === 'O-' || group === 'AB+';
  const rarer = group === 'A-' || group === 'B-' || group === 'AB-';
  const fill = rarer ? BN.white : rare ? BN.burgundy : BN.crimson;
  const color = rarer ? BN.text : '#fff';
  const fontSize = size === 'lg' ? 16 : size === 'md' ? 13 : 11;
  const px = size === 'lg' ? 14 : size === 'md' ? 12 : 10;
  const py = size === 'lg' ? 6 : size === 'md' ? 5 : 4;
  return (
    <View style={{
      backgroundColor: fill,
      paddingHorizontal: px, paddingVertical: py,
      borderRadius: 100,
      borderWidth: rarer ? 1 : 0,
      borderColor: rarer ? BN.divider : 'transparent',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ color, fontFamily: BN.uiBold, fontSize, letterSpacing: 0.5 }}>{group}</Text>
    </View>
  );
}

// ── Tag ───────────────────────────────────────────────────────────────────────
export function BNTag({ children, color = BN.crimson, dot = false }: { children: string; color?: string; dot?: boolean }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: color, paddingHorizontal: 10, paddingVertical: 4,
      borderRadius: 100,
    }}>
      {dot && <PulseDot color="#fff" size={6} />}
      <Text style={{ color: '#fff', fontFamily: BN.uiBold, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' }}>{children}</Text>
    </View>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
export function BNAvatar({ initials, size = 40, committed = false }: { initials: string; size?: number; committed?: boolean }) {
  return (
    <View style={{ position: 'relative' }}>
      <LinearGradient
        colors={BN.gradientColors}
        style={{
          width: size, height: size, borderRadius: size / 2,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontFamily: BN.uiBold, fontSize: size * 0.36 }}>{initials}</Text>
      </LinearGradient>
      {committed && (
        <View style={{
          position: 'absolute', right: -2, bottom: -2,
          width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2,
          backgroundColor: BN.success, borderWidth: 2, borderColor: '#fff',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckIcon color="#fff" size={size * 0.22} />
        </View>
      )}
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
type AccentType = 'urgent' | 'scheduled' | 'success' | 'closed';
interface BNCardProps {
  children: React.ReactNode;
  accent?: AccentType;
  elevated?: boolean;
  padding?: number;
  style?: object;
}
export function BNCard({ children, accent, elevated = false, padding = 16, style }: BNCardProps) {
  const accentColor = accent === 'urgent' ? BN.crimson
    : accent === 'scheduled' ? BN.info
    : accent === 'success' ? BN.success
    : BN.divider;

  return (
    <View style={[
      {
        backgroundColor: BN.white,
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: BN.divider,
        overflow: 'hidden',
      },
      elevated ? shadow.elevated : shadow.card,
      style,
    ]}>
      {accent && (
        <View style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          backgroundColor: accentColor,
        }}>
          {accent === 'urgent' && (
            <View style={{ position: 'absolute', top: 8, left: -3 }}>
              <PulseDot color={BN.crimson} size={10} />
            </View>
          )}
        </View>
      )}
      <View style={{ padding, paddingLeft: accent ? padding + 4 : padding }}>
        {children}
      </View>
    </View>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface BNInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  focused?: boolean;
  trailing?: React.ReactNode;
  onChangeText?: (text: string) => void;
}
export function BNInput({ label, value, placeholder, secureTextEntry, error, focused = false, trailing, onChangeText }: BNInputProps) {
  return (
    <View>
      {label && <Text style={{ fontSize: 12, color: BN.muted, fontFamily: BN.uiMedium, marginBottom: 6 }}>{label}</Text>}
      <View style={{
        height: 52,
        borderWidth: focused ? 2 : 1,
        borderColor: error ? BN.crimson : focused ? BN.crimson : BN.divider,
        borderRadius: 10,
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 14,
        backgroundColor: BN.white,
      }}>
        <TextInput
          style={{ flex: 1, fontSize: 16, color: value ? BN.text : BN.muted, fontFamily: BN.ui }}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={BN.muted}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
        />
        {trailing}
      </View>
      {error && <Text style={{ color: BN.crimson, fontSize: 13, marginTop: 6, fontFamily: BN.ui }}>{error}</Text>}
    </View>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'disabled' | 'success';
interface BNButtonProps {
  children: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}
export function BNButton({ children, variant = 'primary', icon, onPress, loading = false, disabled = false }: BNButtonProps) {
  const styleMap: Record<ButtonVariant, { bg: string; color: string; borderColor?: string }> = {
    primary: { bg: BN.crimson, color: '#fff' },
    secondary: { bg: '#fff', color: BN.crimson, borderColor: BN.crimson },
    destructive: { bg: '#fff', color: BN.crimsonDark, borderColor: BN.crimsonDark },
    ghost: { bg: 'transparent', color: BN.muted },
    disabled: { bg: BN.divider, color: '#fff' },
    success: { bg: BN.success, color: '#fff' },
  };
  const effectiveVariant = (disabled || loading) ? 'disabled' : variant;
  const s = styleMap[effectiveVariant];
  return (
    <TouchableOpacity
      onPress={loading || disabled ? undefined : onPress}
      style={{
        height: 52, borderRadius: 14,
        backgroundColor: s.bg,
        borderWidth: s.borderColor ? 1.5 : 0,
        borderColor: s.borderColor,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: disabled && !loading ? 0.6 : 1,
      }}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color="#fff" size="small" />
        : <>{icon}<Text style={{ fontFamily: BN.uiSemiBold, fontSize: 16, color: s.color }}>{children}</Text></>}
    </TouchableOpacity>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
interface BNHeaderProps {
  title?: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  dark?: boolean;
  topInset?: number;
}
export function BNHeader({ title, subtitle, leading, trailing, dark = true, topInset = 0 }: BNHeaderProps) {
  return (
    <View style={{
      backgroundColor: dark ? BN.burgundy : BN.white,
      paddingTop: topInset + 16,
      paddingBottom: 14,
      paddingHorizontal: 16,
      flexDirection: 'row', alignItems: 'center', gap: 12,
      borderBottomWidth: dark ? 0 : 0.5,
      borderBottomColor: BN.divider,
    }}>
      {leading ?? <View style={{ width: 24 }} />}
      <View style={{ flex: 1, alignItems: subtitle ? 'flex-start' : 'center' }}>
        <Text style={{ fontFamily: BN.uiBold, fontSize: 17, letterSpacing: -0.2, color: dark ? '#fff' : BN.text }}>{title}</Text>
        {subtitle && <Text style={{ fontFamily: BN.ui, fontSize: 12, color: dark ? 'rgba(255,255,255,0.75)' : BN.muted, marginTop: 1 }}>{subtitle}</Text>}
      </View>
      {trailing ?? <View style={{ width: 24 }} />}
    </View>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────
interface TabItem {
  label: string;
  icon: (color: string, active?: boolean) => React.ReactNode;
  badge?: string;
}
interface BNBottomNavProps {
  tabs: TabItem[];
  active: number;
  onTabPress?: (index: number) => void;
}
export function BNBottomNav({ tabs, active, onTabPress }: BNBottomNavProps) {
  return (
    <View style={{
      backgroundColor: BN.burgundy,
      height: 84,
      paddingBottom: 20,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
      borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.06)',
    }}>
      {tabs.map((t, i) => {
        const isActive = i === active;
        const c = isActive ? '#fff' : 'rgba(255,255,255,0.45)';
        return (
          <TouchableOpacity
            key={i}
            onPress={() => onTabPress?.(i)}
            style={{ alignItems: 'center', gap: 4, minWidth: 44, position: 'relative' }}
            activeOpacity={0.7}
          >
            <View style={{ position: 'relative' }}>
              {t.icon(c, isActive)}
              {t.badge && (
                <View style={{
                  position: 'absolute', top: -4, right: -8,
                  backgroundColor: BN.crimson, borderRadius: 100,
                  paddingHorizontal: 5, paddingVertical: 1,
                  minWidth: 16, alignItems: 'center',
                  borderWidth: 1.5, borderColor: BN.burgundy,
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontFamily: BN.uiBold }}>{t.badge}</Text>
                </View>
              )}
            </View>
            <Text style={{ fontFamily: BN.uiSemiBold, fontSize: 10, color: c, letterSpacing: 0.2 }}>{t.label}</Text>
            {isActive && (
              <View style={{
                position: 'absolute', bottom: -2,
                width: 6, height: 6, borderRadius: 3, backgroundColor: BN.crimson,
              }} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Map ───────────────────────────────────────────────────────────────────────
interface BNMapProps {
  height?: number;
  donors?: number;
  dark?: boolean;
  showHospital?: boolean;
  showSelf?: boolean;
  label?: string;
  // New: real coordinates
  hospitalLat?: number;
  hospitalLng?: number;
  donorLat?: number;
  donorLng?: number;
}
export function BNMap({ height = 180, donors = 0, dark = false, showHospital = true, showSelf = false, label, hospitalLat, hospitalLng, donorLat, donorLng }: BNMapProps) {
  if (hospitalLat && hospitalLng) {
    return (
      <View style={{ borderRadius: 12, overflow: 'hidden' }}>
        <TomTomMap
          height={height}
          centerLat={hospitalLat}
          centerLng={hospitalLng}
          hospitalLat={hospitalLat}
          hospitalLng={hospitalLng}
          donorLat={donorLat}
          donorLng={donorLng}
          showRoute={!!(donorLat && donorLng)}
        />
        {label ? (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6 }}>
            <Text style={{ color: '#fff', fontSize: 11, fontFamily: BN.uiSemiBold, textAlign: 'center' }}>{label}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  const bg = dark ? '#2a0a18' : '#EDE0E5';
  const strokeColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(90,0,32,0.07)';
  const water = dark ? '#1f0612' : '#DCC8CF';
  const pingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pingAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const donorPositions = [
    { left: '22%', top: '30%', initials: 'RM' },
    { left: '78%', top: '62%', initials: 'PK' },
    { left: '40%', top: '75%', initials: 'SS' },
  ];

  return (
    <View style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden', backgroundColor: bg, position: 'relative' }}>
      <Svg width="100%" height={height} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Rect width="320" height="180" fill={bg} />
        <Path d="M-10 110 Q 60 80 130 100 T 330 70 L 330 130 Q 260 140 180 130 T -10 150 Z" fill={water} opacity="0.6" />
        {[20, 50, 90, 130, 160].map((y) => (
          <Line key={y} x1="-10" y1={y} x2="330" y2={y + 6} stroke={strokeColor} strokeWidth="6" />
        ))}
        {[40, 90, 150, 200, 260].map((x) => (
          <Line key={x} x1={x} y1="-10" x2={x + 8} y2="200" stroke={strokeColor} strokeWidth="5" />
        ))}
        {[[60,30,40,30],[110,30,30,40],[170,30,50,30],[210,80,40,40],[60,130,50,30],[160,140,60,30]].map(([x,y,w,h],i) => (
          <Rect key={i} x={x} y={y} width={w} height={h}
            fill={dark ? 'rgba(255,255,255,0.025)' : 'rgba(90,0,32,0.04)'} rx="2" />
        ))}
      </Svg>

      {showHospital && (
        <View style={{ position: 'absolute', left: '60%', top: '40%' }}>
          <View style={{
            width: 36, height: 36, borderRadius: 18, backgroundColor: BN.burgundy,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 3, borderColor: '#fff',
            shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
          }}>
            <CrossIcon color="#fff" size={16} />
          </View>
        </View>
      )}

      {showSelf && (
        <View style={{ position: 'absolute', left: '28%', top: '62%' }}>
          <Animated.View style={{
            position: 'absolute', width: 32, height: 32, borderRadius: 16,
            backgroundColor: BN.crimson, opacity: 0.3,
            transform: [{ scale: pingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }],
          }} />
          <View style={{
            width: 16, height: 16, borderRadius: 8, backgroundColor: BN.crimson,
            borderWidth: 3, borderColor: '#fff', margin: 8,
            shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
          }} />
        </View>
      )}

      {Array.from({ length: Math.min(donors, 3) }).map((_, i) => {
        const pos = donorPositions[i];
        return (
          <View key={i} style={{ position: 'absolute', left: pos.left as any, top: pos.top as any }}>
            <Animated.View style={{
              position: 'absolute', width: 36, height: 36, borderRadius: 18,
              backgroundColor: BN.crimson, opacity: 0.25,
              transform: [{ scale: pingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }],
            }} />
            <LinearGradient
              colors={BN.gradientColors}
              style={{
                width: 28, height: 28, borderRadius: 14,
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: '#fff', margin: 4,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 10, fontFamily: BN.uiBold }}>{pos.initials}</Text>
            </LinearGradient>
          </View>
        );
      })}

      {label && (
        <View style={{
          position: 'absolute', bottom: 10, left: 10, right: 10,
          paddingHorizontal: 12, paddingVertical: 8,
          backgroundColor: 'rgba(26,0,8,0.78)', borderRadius: 10,
        }}>
          <Text style={{ color: '#fff', fontSize: 12, fontFamily: BN.ui }}>{label}</Text>
        </View>
      )}
    </View>
  );
}

// ── Donor bottom tabs ─────────────────────────────────────────────────────────
export const donorTabs = (notifCount = 3, commitCount = 2): TabItem[] => [
  { label: 'Home', icon: (c) => <HomeIcon color={c} />, badge: String(notifCount) },
  { label: 'Commitments', icon: (c) => <CalendarIcon color={c} />, badge: String(commitCount) },
  { label: 'Profile', icon: (c) => <UserIcon color={c} /> },
];

// ── Hospital bottom tabs ──────────────────────────────────────────────────────
export const hospitalTabs = (manageCount = 4): TabItem[] => [
  { label: 'Dashboard', icon: (c) => <GridIcon color={c} /> },
  { label: 'Post', icon: (c, a) => <PlusCircleIcon color={c} active={a} /> },
  { label: 'Manage', icon: (c) => <ClipboardIcon color={c} />, badge: String(manageCount) },
  { label: 'Profile', icon: (c) => <HospitalIcon color={c} /> },
];
