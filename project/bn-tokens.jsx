// BloodNet design tokens & shared primitives

const BN = {
  crimson: '#E8003D',
  crimsonDark: '#B5002F',
  crimsonLight: '#FF1A54',
  burgundy: '#5A0020',
  burgundyMid: '#7A0030',
  burgundyDark: '#3D0015',
  bg: '#F7F0F2',
  white: '#FFFFFF',
  text: '#1A0008',
  muted: '#6B4050',
  divider: '#D4B8C0',
  info: '#1A6BB5',
  success: '#1A7A4A',
  warn: '#C47A00',
  gradient: 'linear-gradient(180deg, #E8003D 0%, #5A0020 100%)',
  display: '"Barlow Condensed", "Bebas Neue", Arial Black, sans-serif',
  ui: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

// ── Logo — uses the provided BloodNet logo image as-is ──────────────
const BN_LOGO_SRC = 'assets/bloodnet-logo.png';

function BNLogoMark({ size = 32, fill }) {
  // The provided logo is the full app icon. Render it as an image, square.
  // 'fill' prop is kept for API compatibility but unused — we use the logo as-is.
  return (
    <img
      src={BN_LOGO_SRC}
      alt="Blood Net"
      width={size}
      height={size}
      style={{ display: 'block', width: size, height: size, objectFit: 'contain', flexShrink: 0 }}
    />
  );
}

function BNAppIcon({ size = 88, radius = 20 }) {
  return (
    <img
      src={BN_LOGO_SRC}
      alt="Blood Net"
      width={size}
      height={size}
      style={{
        width: size, height: size, borderRadius: radius,
        display: 'block', objectFit: 'contain', flexShrink: 0,
        filter: 'drop-shadow(0 8px 16px rgba(90,0,32,0.28))',
      }}
    />
  );
}

// ── Blood group badge ───────────────────────────────────────────────────
function BNBloodBadge({ group, size = 'sm' }) {
  const rare = group === 'O-' || group === 'AB+';
  const rarer = group === 'A-' || group === 'B-' || group === 'AB-';
  const fill = rarer ? '#fff' : rare ? BN.burgundy : BN.crimson;
  const color = rarer ? BN.text : '#fff';
  const border = rarer ? `1px solid ${BN.divider}` : 'none';
  const fontSize = size === 'lg' ? 16 : size === 'md' ? 13 : 11;
  const px = size === 'lg' ? 14 : size === 'md' ? 12 : 10;
  const py = size === 'lg' ? 6 : size === 'md' ? 5 : 4;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: fill, color, border,
      padding: `${py}px ${px}px`, borderRadius: 100,
      fontFamily: BN.ui, fontWeight: 700, fontSize, letterSpacing: 0.5,
      textTransform: 'uppercase', lineHeight: 1,
    }}>{group}</span>
  );
}

// ── Tag (urgent/scheduled/info) ─────────────────────────────────────────
function BNTag({ children, color = BN.crimson, dot = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: color, color: '#fff',
      padding: '4px 10px', borderRadius: 100,
      fontFamily: BN.ui, fontWeight: 700, fontSize: 11, letterSpacing: 0.6,
      textTransform: 'uppercase', lineHeight: 1,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 3, background: '#fff', animation: 'bnPulse 1.2s ease-in-out infinite' }} />}
      {children}
    </span>
  );
}

// ── Header bar ──────────────────────────────────────────────────────────
function BNHeader({ title, subtitle, leading, trailing, dark = true, statusBar = true }) {
  return (
    <div style={{
      background: dark ? BN.burgundy : '#fff',
      color: dark ? '#fff' : BN.text,
      paddingTop: statusBar ? 50 : 16,
      paddingBottom: 14,
      paddingLeft: 16, paddingRight: 16,
      display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: dark ? 'none' : `1px solid ${BN.divider}`,
    }}>
      {leading || <div style={{ width: 24 }} />}
      <div style={{ flex: 1, textAlign: subtitle ? 'left' : 'center' }}>
        <div style={{ fontFamily: BN.ui, fontWeight: 700, fontSize: 17, letterSpacing: -0.2 }}>{title}</div>
        {subtitle && <div style={{ fontFamily: BN.ui, fontSize: 12, opacity: 0.75 }}>{subtitle}</div>}
      </div>
      {trailing || <div style={{ width: 24 }} />}
    </div>
  );
}

// ── Bottom nav ─────────────────────────────────────────────────────────
function BNBottomNav({ tabs, active }) {
  return (
    <div style={{
      background: BN.burgundy, height: 84, paddingBottom: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      borderTop: '0.5px solid rgba(255,255,255,0.06)',
    }}>
      {tabs.map((t, i) => {
        const isActive = i === active;
        const c = isActive ? '#fff' : 'rgba(255,255,255,0.45)';
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative', minWidth: 44 }}>
            <div style={{ color: c, position: 'relative' }}>
              {t.icon(c, isActive)}
              {t.badge && (
                <span style={{
                  position: 'absolute', top: -4, right: -8,
                  background: BN.crimson, color: '#fff', borderRadius: 100,
                  fontSize: 10, fontWeight: 700, padding: '1px 5px', minWidth: 16, textAlign: 'center',
                  border: `1.5px solid ${BN.burgundy}`, fontFamily: BN.ui,
                }}>{t.badge}</span>
              )}
            </div>
            <div style={{ fontFamily: BN.ui, fontSize: 10, fontWeight: 600, color: c, letterSpacing: 0.2 }}>{t.label}</div>
            {isActive && <div style={{ position: 'absolute', bottom: -2, width: 6, height: 6, borderRadius: 3, background: BN.crimson }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Icons (stroke, 2px, rounded) ───────────────────────────────────────
const Ico = {
  home: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2V11z"/></svg>,
  calendar: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/></svg>,
  user: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>,
  grid: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  plusCircle: (c, active) => <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? BN.crimson : 'none'} stroke={active ? '#fff' : c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>,
  clipboard: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="12" height="18" rx="2"/><path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1M9 11h6M9 15h6"/></svg>,
  hospital: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V8l8-5 8 5v13"/><path d="M10 21v-5h4v5M12 9v4M10 11h4"/></svg>,
  bell: (c, size = 22) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4"/></svg>,
  back: (c, size = 22) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,
  pin: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-7.5 8-13a8 8 0 10-16 0c0 5.5 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></svg>,
  clock: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  check: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>,
  shieldCheck: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6l8-4zM9 12l2 2 4-4"/></svg>,
  drop: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M12 2c0 6-7 9-7 14a7 7 0 0014 0c0-5-7-8-7-14z"/></svg>,
  dropOutline: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 6-7 9-7 14a7 7 0 0014 0c0-5-7-8-7-14z"/></svg>,
  cross: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/></svg>,
  fire: (c, size = 16) => <svg width={size} height={size} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M12 2c1 5 6 6 6 12a6 6 0 01-12 0c0-3 2-4 2-7 1 1 2 2 2 4 1-3 0-6 2-9z"/></svg>,
  moreV: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill={c}><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>,
  plus: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  minus: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14"/></svg>,
  eye: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>,
  share: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v14"/></svg>,
  edit: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>,
  search: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  logout: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/></svg>,
  chev: (c, size = 14) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  wifi: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M2 9a15 15 0 0120 0"/><circle cx="12" cy="20" r="1" fill={c}/></svg>,
  close: (c, size = 18) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>,
};

// ── Status bar (iOS) — minimalist for in-screen mocks ──────────────────
function BNStatusBar({ light = true }) {
  const c = light ? '#fff' : '#000';
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 44,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 24px', zIndex: 5, fontFamily: BN.ui,
    }}>
      <span style={{ color: c, fontWeight: 600, fontSize: 14 }}>9:41</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="16" height="10" viewBox="0 0 16 10"><rect x="0" y="6" width="2.5" height="4" rx="0.5" fill={c}/><rect x="4" y="4" width="2.5" height="6" rx="0.5" fill={c}/><rect x="8" y="2" width="2.5" height="8" rx="0.5" fill={c}/><rect x="12" y="0" width="2.5" height="10" rx="0.5" fill={c}/></svg>
        <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 3a6 6 0 014.2 1.7l1-1A7.5 7.5 0 007 1.5 7.5 7.5 0 001.8 3.7l1 1A6 6 0 017 3z" fill={c}/><circle cx="7" cy="8" r="1.2" fill={c}/></svg>
        <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0.5" y="0.5" width="19" height="10" rx="2.5" stroke={c} fill="none" opacity="0.4"/><rect x="2" y="2" width="16" height="7" rx="1.5" fill={c}/><rect x="20" y="3.5" width="1.5" height="4" rx="0.5" fill={c} opacity="0.6"/></svg>
      </div>
    </div>
  );
}

// Phone shell — 375 x 812 baseline, no notch (compact for canvas)
function BNPhone({ children, statusLight = true, statusBar = true }) {
  return (
    <div style={{
      width: 375, height: 812, position: 'relative', overflow: 'hidden',
      background: BN.bg, fontFamily: BN.ui, color: BN.text,
      display: 'flex', flexDirection: 'column',
    }}>
      {statusBar && <BNStatusBar light={statusLight} />}
      {children}
    </div>
  );
}

// ── Inputs / buttons ───────────────────────────────────────────────────
function BNInput({ label, value, placeholder, type, error, focused = false, trailing }) {
  return (
    <div>
      {label && <div style={{ fontSize: 12, color: BN.muted, fontWeight: 500, marginBottom: 6 }}>{label}</div>}
      <div style={{
        height: 52, border: `${focused ? 2 : 1}px solid ${error ? BN.crimson : focused ? BN.crimson : BN.divider}`,
        borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 14px',
        background: '#fff',
      }}>
        <div style={{ flex: 1, fontSize: 16, color: value ? BN.text : BN.muted, fontFamily: BN.ui }}>
          {value || placeholder}
        </div>
        {trailing}
      </div>
      {error && <div style={{ color: BN.crimson, fontSize: 13, marginTop: 6 }}>{error}</div>}
    </div>
  );
}

function BNButton({ children, variant = 'primary', icon, onClick }) {
  const styles = {
    primary: { background: BN.crimson, color: '#fff', border: 'none' },
    secondary: { background: '#fff', color: BN.crimson, border: `1.5px solid ${BN.crimson}` },
    destructive: { background: '#fff', color: BN.crimsonDark, border: `1.5px solid ${BN.crimsonDark}` },
    ghost: { background: 'transparent', color: BN.muted, border: 'none' },
    disabled: { background: BN.divider, color: '#fff', border: 'none' },
    success: { background: BN.success, color: '#fff', border: 'none' },
  };
  const s = styles[variant];
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 52, borderRadius: 14,
      fontFamily: BN.ui, fontWeight: 600, fontSize: 16,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      ...s,
    }}>
      {icon}
      {children}
    </button>
  );
}

// ── Card / surface ─────────────────────────────────────────────────────
function BNCard({ children, accent, elevated, padding = 16, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: `0.5px solid ${BN.divider}`,
      boxShadow: elevated ? '0 4px 20px rgba(90,0,32,0.12)' : 'none',
      overflow: 'hidden', position: 'relative',
      ...style,
    }}>
      {accent && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: accent === 'urgent' ? BN.crimson : accent === 'scheduled' ? BN.info : accent === 'closed' ? BN.divider : BN.success,
        }}>
          {accent === 'urgent' && (
            <span style={{
              position: 'absolute', top: 8, left: -3, width: 10, height: 10, borderRadius: 5,
              background: BN.crimson, animation: 'bnPulse 1.2s ease-in-out infinite',
              boxShadow: '0 0 0 2px #fff',
            }} />
          )}
        </div>
      )}
      <div style={{ padding, paddingLeft: accent ? padding + 4 : padding }}>{children}</div>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────
function BNAvatar({ initials, size = 40, committed }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2, background: BN.gradient,
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: BN.ui, fontWeight: 700, fontSize: size * 0.36, position: 'relative', flexShrink: 0,
    }}>
      {initials}
      {committed && (
        <div style={{
          position: 'absolute', right: -2, bottom: -2, width: size * 0.4, height: size * 0.4, borderRadius: '50%',
          background: BN.success, border: '2px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {Ico.check('#fff', size * 0.22)}
        </div>
      )}
    </div>
  );
}

// ── Map placeholder (light tile look with hospital + donor pins) ───────
function BNMap({ height = 180, donors = 0, dark = false, showHospital = true, showSelf = false, label }) {
  // Procedural light/dark map tile with road grid
  const bg = dark ? '#2a0a18' : '#EDE0E5';
  const stroke = dark ? 'rgba(255,255,255,0.08)' : 'rgba(90,0,32,0.07)';
  const water = dark ? '#1f0612' : '#DCC8CF';
  return (
    <div style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden', position: 'relative', background: bg }}>
      <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        <rect width="320" height="180" fill={bg}/>
        {/* river */}
        <path d="M-10 110 Q 60 80 130 100 T 330 70 L 330 130 Q 260 140 180 130 T -10 150 Z" fill={water} opacity="0.6"/>
        {/* roads */}
        {[20, 50, 90, 130, 160].map(y => <line key={y} x1="-10" y1={y} x2="330" y2={y + 6} stroke={stroke} strokeWidth="6"/>)}
        {[40, 90, 150, 200, 260].map(x => <line key={x} x1={x} y1="-10" x2={x + 8} y2="200" stroke={stroke} strokeWidth="5"/>)}
        {/* blocks */}
        {[[60,30,40,30],[110,30,30,40],[170,30,50,30],[210,80,40,40],[60,130,50,30],[160,140,60,30]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={dark ? 'rgba(255,255,255,0.025)' : 'rgba(90,0,32,0.04)'} rx="2"/>
        ))}
      </svg>
      {showHospital && (
        <div style={{ position: 'absolute', left: '60%', top: '40%' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18, background: BN.burgundy,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid #fff', boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
          }}>{Ico.cross('#fff', 16)}</div>
        </div>
      )}
      {showSelf && (
        <div style={{ position: 'absolute', left: '28%', top: '62%' }}>
          <div style={{ position: 'relative', width: 32, height: 32 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: BN.crimson, opacity: 0.3, animation: 'bnPing 2s ease-out infinite' }} />
            <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: BN.crimson, border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }} />
          </div>
        </div>
      )}
      {Array.from({ length: donors }).map((_, i) => {
        const positions = [['22%','30%','RM'], ['78%','62%','PK'], ['40%','75%','SS']];
        const [l, t, ini] = positions[i] || ['50%','50%','??'];
        return (
          <div key={i} style={{ position: 'absolute', left: l, top: t }}>
            <div style={{ position: 'relative', width: 36, height: 36 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: BN.crimson, opacity: 0.25, animation: 'bnPing 2s ease-out infinite' }} />
              <div style={{
                position: 'absolute', inset: 4, borderRadius: '50%', background: BN.gradient,
                color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
              }}>{ini}</div>
            </div>
          </div>
        );
      })}
      {label && (
        <div style={{
          position: 'absolute', bottom: 10, left: 10, right: 10, padding: '8px 12px',
          background: 'rgba(26,0,8,0.78)', color: '#fff', borderRadius: 10, fontSize: 12,
          backdropFilter: 'blur(8px)',
        }}>{label}</div>
      )}
    </div>
  );
}

// ── Global animations ──────────────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('bn-anim')) {
  const s = document.createElement('style');
  s.id = 'bn-anim';
  s.textContent = `
    @keyframes bnPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.6} }
    @keyframes bnPing  { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.6);opacity:0} }
    @keyframes bnDrop  { 0%{transform:translateY(-40px);opacity:0} 70%{transform:translateY(4px);opacity:1} 100%{transform:translateY(0);opacity:1} }
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Barlow+Condensed:wght@700;800;900&display=swap');
  `;
  document.head.appendChild(s);
  // also inject @import via link for reliability
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Barlow+Condensed:wght@700;800;900&display=swap';
  document.head.appendChild(l);
}

Object.assign(window, {
  BN, BNLogoMark, BNAppIcon, BNBloodBadge, BNTag, BNHeader, BNBottomNav, Ico,
  BNStatusBar, BNPhone, BNInput, BNButton, BNCard, BNAvatar, BNMap,
});
