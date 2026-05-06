import React from 'react';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';

type IconProps = { color: string; size?: number };

export const HomeIcon = ({ color, size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2V11z" />
  </Svg>
);

export const CalendarIcon = ({ color, size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="5" width="18" height="16" rx="2" />
    <Path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" />
  </Svg>
);

export const UserIcon = ({ color, size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
  </Svg>
);

export const GridIcon = ({ color, size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="7" height="7" rx="1" />
    <Rect x="14" y="3" width="7" height="7" rx="1" />
    <Rect x="3" y="14" width="7" height="7" rx="1" />
    <Rect x="14" y="14" width="7" height="7" rx="1" />
  </Svg>
);

export const PlusCircleIcon = ({ color, size = 26, active = false }: IconProps & { active?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={active ? '#E8003D' : 'none'} stroke={active ? '#fff' : color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 8v8M8 12h8" />
  </Svg>
);

export const ClipboardIcon = ({ color, size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="6" y="4" width="12" height="18" rx="2" />
    <Path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1M9 11h6M9 15h6" />
  </Svg>
);

export const HospitalIcon = ({ color, size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 21V8l8-5 8 5v13M10 21v-5h4v5M12 9v4M10 11h4" />
  </Svg>
);

export const BellIcon = ({ color, size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4" />
  </Svg>
);

export const BackIcon = ({ color, size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

export const PinIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-7.5 8-13a8 8 0 10-16 0c0 5.5 8 13 8 13z" />
    <Circle cx="12" cy="9" r="3" />
  </Svg>
);

export const ClockIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

export const CheckIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12l5 5L20 7" />
  </Svg>
);

export const ShieldCheckIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2l8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6l8-4zM9 12l2 2 4-4" />
  </Svg>
);

export const DropIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2c0 6-7 9-7 14a7 7 0 0014 0c0-5-7-8-7-14z" />
  </Svg>
);

export const DropOutlineIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2c0 6-7 9-7 14a7 7 0 0014 0c0-5-7-8-7-14z" />
  </Svg>
);

export const CrossIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
  </Svg>
);

export const FireIcon = ({ color, size = 16 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2c1 5 6 6 6 12a6 6 0 01-12 0c0-3 2-4 2-7 1 1 2 2 2 4 1-3 0-6 2-9z" />
  </Svg>
);

export const MoreVIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="5" r="1.6" />
    <Circle cx="12" cy="12" r="1.6" />
    <Circle cx="12" cy="19" r="1.6" />
  </Svg>
);

export const PlusIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MinusIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <Path d="M5 12h14" />
  </Svg>
);

export const EyeIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

export const ShareIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v14" />
  </Svg>
);

export const EditIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </Svg>
);

export const SearchIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="7" />
    <Path d="M21 21l-4.3-4.3" />
  </Svg>
);

export const LogoutIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
  </Svg>
);

export const ChevronIcon = ({ color, size = 14 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export const CloseIcon = ({ color, size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <Path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const MapIcon = ({ color, size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" />
    <Path d="M9 4v13M15 7v13" />
  </Svg>
);
