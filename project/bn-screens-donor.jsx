// Donor screens — Home Feed, Request Detail, Commitments, Live Map, Profile

const donorTabs = (active = 0) => [
{ label: 'Home', icon: (c) => Ico.home(c), badge: '3' },
{ label: 'Commitments', icon: (c) => Ico.calendar(c), badge: '2' },
{ label: 'Profile', icon: (c) => Ico.user(c) }];


// ── S-08 Donor Home Feed ──────────────────────────────────────────────
function S08_DonorHome() {
  return (
    <BNPhone>
      {/* Header */}
      <div style={{ background: BN.burgundy, paddingTop: 50, paddingBottom: 12, paddingLeft: 20, paddingRight: 20, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BNLogoMark size={32} />
          <div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>Good morning,</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Aarav</div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          {Ico.bell('#fff')}
          <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, background: BN.crimson, border: '1.5px solid #5A0020' }} />
        </div>
      </div>
      {/* Eligibility strip */}
      <div style={{ background: BN.success, color: '#fff', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
        {Ico.check('#fff', 16)} You are eligible to donate.
      </div>
      {/* Filter chips */}
      <div style={{ padding: '12px 20px', background: '#fff', display: 'flex', gap: 6, borderBottom: `0.5px solid ${BN.divider}`, overflowX: 'auto' }}>
        {[['Type', 'O+'], ['Within', '10 km'], ['Last donated', '90+ days']].map(([k, v]) =>
        <div key={k} style={{ flexShrink: 0, padding: '6px 10px', background: BN.bg, borderRadius: 100, border: `0.5px solid ${BN.divider}`, fontSize: 12 }}>
            <span style={{ color: BN.muted }}>{k} </span><span style={{ fontWeight: 700 }}>{v}</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: BN.crimson, letterSpacing: 0.8, marginTop: 4 }}>URGENT — ACT NOW</div>

        <BNCard accent="urgent" elevated padding={14}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>KEM Hospital</div>
            <BNTag color={BN.crimson} dot>Urgent</BNTag>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <BNBloodBadge group="O+" />
            <span style={{ background: BN.bg, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, color: BN.text }}>2 UNITS</span>
            <span style={{ background: BN.bg, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, color: BN.muted, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {Ico.pin(BN.muted, 11)} 1.4 km
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: `0.5px solid ${BN.divider}` }}>
            <div style={{ fontSize: 12, color: BN.muted }}>Posted 3 min ago</div>
            <div style={{ color: BN.crimson, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>View Request {Ico.chev(BN.crimson)}</div>
          </div>
        </BNCard>

        <BNCard accent="urgent" padding={14}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Tata Memorial</div>
            <BNTag color={BN.crimson} dot>Urgent</BNTag>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <BNBloodBadge group="O+" />
            <span style={{ background: BN.bg, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>1 UNIT</span>
            <span style={{ background: BN.bg, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, color: BN.muted, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {Ico.pin(BN.muted, 11)} 3.2 km
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: `0.5px solid ${BN.divider}` }}>
            <div style={{ fontSize: 12, color: BN.muted }}>Posted 18 min ago</div>
            <div style={{ color: BN.crimson, fontSize: 13, fontWeight: 600 }}>View Request →</div>
          </div>
        </BNCard>

        <div style={{ fontSize: 11, fontWeight: 700, color: BN.info, letterSpacing: 0.8, marginTop: 10 }}>SCHEDULED</div>

        <BNCard accent="scheduled" padding={14}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Lilavati Hospital</div>
            <div style={{ fontSize: 13, color: BN.muted }}>Jun 15 · 10:00 AM</div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <BNBloodBadge group="O+" />
            <span style={{ background: BN.bg, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>3 UNITS</span>
            <span style={{ background: BN.bg, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, color: BN.muted, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {Ico.pin(BN.muted, 11)} 5.1 km
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: `0.5px solid ${BN.divider}` }}>
            <div style={{ fontSize: 12, color: BN.muted }}>Appointment in 9 days</div>
            <div style={{ color: BN.crimson, fontSize: 13, fontWeight: 600 }}>View Request →</div>
          </div>
        </BNCard>

        <BNCard accent="scheduled" padding={14}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Hinduja Hospital</div>
            <div style={{ fontSize: 13, color: BN.muted }}>Jun 22 · 2:30 PM</div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <BNBloodBadge group="O+" />
            <span style={{ background: BN.bg, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>1 UNIT</span>
            <span style={{ background: BN.bg, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, color: BN.muted, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {Ico.pin(BN.muted, 11)} 4.7 km
            </span>
          </div>
        </BNCard>
      </div>
      <BNBottomNav tabs={donorTabs()} active={0} />
    </BNPhone>);

}

// ── S-09 Request Detail ───────────────────────────────────────────────
function S09_RequestDetail() {
  return (
    <BNPhone>
      <div style={{ background: BN.burgundy, paddingTop: 50, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
        {Ico.back('#fff')}
        <div style={{ flex: 1, fontWeight: 700, fontSize: 17, textAlign: 'center', marginRight: 24 }}>Blood Request</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 100 }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #FFE5EC 0%, #FFF5F7 100%)',
          border: `1px solid rgba(232,0,61,0.2)`, borderRadius: 16, padding: 18,
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.08 }}>
            <BNLogoMark size={140} fill={BN.crimson} />
          </div>
          <BNTag color={BN.crimson} dot>Urgent</BNTag>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <BNBloodBadge group="O+" size="lg" />
            <div>
              <div style={{ fontFamily: BN.display, fontSize: 36, fontWeight: 800, color: BN.crimson, lineHeight: 1 }}>2</div>
              <div style={{ fontSize: 12, color: BN.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Units Needed</div>
            </div>
          </div>
        </div>

        {/* Hospital */}
        <BNCard padding={14}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: BN.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {Ico.cross(BN.burgundy, 20)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 17 }}>KEM Hospital</span>
                {Ico.shieldCheck(BN.success, 16)}
              </div>
              <div style={{ fontSize: 13, color: BN.muted }}>Acharya Donde Marg, Parel</div>
              <div style={{ fontSize: 12, color: BN.muted, marginTop: 2 }}>1.4 km away</div>
            </div>
          </div>
        </BNCard>

        {/* Map */}
        <BNMap height={150} showHospital showSelf label="You are 1.4 km from this hospital" />

        {/* About */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6, color: BN.muted }}>About this request</div>
          <div style={{ fontSize: 14, lineHeight: 1.55, color: BN.text }}>
            Trauma patient admitted to ICU after a road accident. Requires immediate transfusion. Donors who can arrive within 60 minutes are urgently needed.
          </div>
        </div>

        {/* Requirements */}
        <div style={{ background: 'rgba(26,107,181,0.06)', border: `1px solid rgba(26,107,181,0.25)`, borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: BN.info, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>You qualify</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            {['Your blood type: O+', 'Last donated: Feb 2025 (eligible)', 'Distance: 1.4 km'].map((t, i) =>
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {Ico.check(BN.success, 14)} {t}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* CTA bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 32, background: '#fff', borderTop: `0.5px solid ${BN.divider}` }}>
        <div style={{ textAlign: 'center', color: BN.muted, fontSize: 14, marginBottom: 10 }}>Not Now</div>
        <BNButton>Accept This Request</BNButton>
      </div>
    </BNPhone>);

}

// ── S-09a Acceptance Confirmation Modal ────────────────────────────────
function S09a_ConfirmModal() {
  return (
    <BNPhone>
      {/* underlay */}
      <div style={{ position: 'absolute', inset: 0, background: BN.bg }}>
        <div style={{ background: BN.burgundy, height: 80 }} />
        <div style={{ padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, height: 120, marginBottom: 12 }} />
          <div style={{ background: '#fff', borderRadius: 12, height: 80 }} />
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,0,8,0.72)', backdropFilter: 'blur(2px)' }} />
      {/* Modal */}
      <div style={{
        position: 'absolute', left: 24, right: 24, top: '50%', transform: 'translateY(-50%)',
        background: '#fff', borderRadius: 20, padding: 24, textAlign: 'center'
      }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(232,0,61,0.1)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {Ico.drop(BN.crimson, 36)}
        </div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Confirm Your Commitment</div>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: BN.muted, marginBottom: 8 }}>
          By accepting, you are committing to donate <b style={{ color: BN.text }}>1 units of O+</b> at <b style={{ color: BN.text }}>KEM Hospital</b>.
        </div>
        <div style={{ fontSize: 12, color: BN.crimson, fontWeight: 600, marginBottom: 18, padding: 10, background: 'rgba(232,0,61,0.06)', borderRadius: 8 }}>
          Your location will be shared with the hospital immediately.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BNButton>Yes, I'll Donate</BNButton>
          <div style={{ color: BN.muted, fontSize: 14, padding: 8 }}>Go Back</div>
        </div>
      </div>
    </BNPhone>);

}

// ── S-10 My Commitments ───────────────────────────────────────────────
function S10_Commitments() {
  return (
    <BNPhone>
      <div style={{ background: BN.burgundy, paddingTop: 50, paddingBottom: 12, paddingLeft: 20, paddingRight: 20, color: '#fff' }}>
        <div style={{ fontWeight: 700, fontSize: 20 }}>My Commitments</div>
      </div>
      <div style={{ background: '#fff', display: 'flex', borderBottom: `0.5px solid ${BN.divider}` }}>
        {['Active', 'Upcoming', 'Completed'].map((t, i) =>
        <div key={t} style={{ flex: 1, padding: '14px 0', textAlign: 'center', fontSize: 14, fontWeight: 600,
          color: i === 0 ? BN.crimson : BN.muted,
          borderBottom: i === 0 ? `2px solid ${BN.crimson}` : 'none'
        }}>{t}</div>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* LIVE urgent */}
        <BNCard accent="urgent" elevated padding={14}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>KEM Hospital</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: BN.success, fontWeight: 700, fontSize: 11, letterSpacing: 0.6 }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: BN.success, animation: 'bnPulse 1.2s ease-in-out infinite' }} />
              LIVE
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <BNBloodBadge group="O+" />
            <span style={{ background: BN.bg, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>2 UNITS</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: BN.success, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {Ico.pin(BN.success, 12)} Sharing location · ETA 8 min
          </div>
          <div style={{ marginTop: 10, padding: '10px 14px', background: BN.crimson, color: '#fff', borderRadius: 10, textAlign: 'center', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {Ico.pin('#fff', 14)} Open Map
          </div>
        </BNCard>

        {/* Scheduled imminent */}
        <BNCard accent="scheduled" padding={14}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Lilavati Hospital</div>
              <div style={{ fontSize: 12, color: BN.muted, marginTop: 2 }}>Tomorrow · 10:00 AM</div>
            </div>
            <BNBloodBadge group="O+" />
          </div>
          <div style={{ marginTop: 12, padding: 10, background: 'rgba(26,107,181,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            {Ico.clock(BN.info, 16)}
            <div style={{ fontSize: 13, color: BN.info, fontWeight: 600 }}>Location sharing starts in 47 mins</div>
          </div>
        </BNCard>

        <BNCard accent="scheduled" padding={14}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Hinduja Hospital</div>
              <div style={{ fontSize: 12, color: BN.muted, marginTop: 2 }}>Jun 22 · 2:30 PM</div>
            </div>
            <BNTag color={BN.success}>✓ Committed</BNTag>
          </div>
        </BNCard>
      </div>
      <BNBottomNav tabs={donorTabs()} active={1} />
    </BNPhone>);

}

// ── S-11 Donor Live Location ──────────────────────────────────────────
function S11_LiveMap() {
  return (
    <BNPhone statusLight={false}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ width: '100%', height: '100%' }}>
          <BNMap height={812} showHospital showSelf />
        </div>
      </div>
      {/* top info card */}
      <div style={{ position: 'absolute', top: 50, left: 16, right: 16, background: 'rgba(26,0,8,0.85)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: 14, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>En route to</div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>KEM Hospital</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: BN.success, animation: 'bnPulse 1.2s ease-in-out infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>LIVE</span>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 10 }}>
            <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>ETA</div>
            <div style={{ fontFamily: BN.display, fontSize: 22, fontWeight: 800 }}>~8 min</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 10 }}>
            <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>Distance</div>
            <div style={{ fontFamily: BN.display, fontSize: 22, fontWeight: 800 }}>1.4 km</div>
          </div>
        </div>
      </div>
      {/* Bottom card */}
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16, background: '#fff', borderRadius: 16, padding: 14, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BNAvatar initials="AM" size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>You're sharing your location</div>
            <div style={{ fontSize: 12, color: BN.muted }}>Hospital is tracking your arrival</div>
          </div>
          <BNBloodBadge group="O+" />
        </div>
        <div style={{ marginTop: 12, padding: '12px 16px', border: `1.5px solid ${BN.crimsonDark}`, color: BN.crimsonDark, borderRadius: 12, textAlign: 'center', fontWeight: 600, fontSize: 14 }}>
          Stop Sharing Location
        </div>
      </div>
    </BNPhone>);

}

// ── S-12 Donor Profile ────────────────────────────────────────────────
function S12_DonorProfile() {
  return (
    <BNPhone>
      {/* Hero */}
      <div style={{ background: BN.gradient, paddingTop: 50, paddingBottom: 28, paddingLeft: 20, paddingRight: 20, color: '#fff', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 50, right: 16, width: 36, height: 36, borderRadius: 18, border: '1.5px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {Ico.edit('#fff', 16)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <BNAvatar initials="AM" size={72} />
          <div style={{ fontWeight: 700, fontSize: 20 }}>Aarav Mehta</div>
          <BNBloodBadge group="O+" size="md" />
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, marginTop: -16 }}>
        {/* Eligibility */}
        <BNCard accent="success" elevated padding={14}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(26,122,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {Ico.check(BN.success, 20)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: BN.success }}>You are eligible to donate</div>
              <div style={{ fontSize: 12, color: BN.muted, marginTop: 2 }}>Last donated: Feb 14, 2026</div>
            </div>
          </div>
        </BNCard>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
          { l: 'Donations', v: '7', c: BN.crimson },
          { l: 'Lives Impacted', v: '21', c: BN.burgundy },
          { l: 'Streak', v: '3', c: BN.warn, icon: true }].
          map((s) =>
          <div key={s.l} style={{ background: '#fff', borderRadius: 12, padding: 12, border: `0.5px solid ${BN.divider}`, textAlign: 'center' }}>
              <div style={{ fontFamily: BN.display, fontSize: 30, fontWeight: 800, color: s.c, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                {s.v}{s.icon && Ico.fire(BN.warn, 18)}
              </div>
              <div style={{ fontSize: 11, color: BN.muted, marginTop: 4, fontWeight: 600 }}>{s.l}</div>
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, padding: '0 4px' }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Donation History</div>
            <div style={{ color: BN.crimson, fontSize: 13, fontWeight: 600 }}>See All</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, border: `0.5px solid ${BN.divider}` }}>
            {[
            { h: 'KEM Hospital', d: 'Feb 14, 2026', u: '1' },
            { h: 'Lilavati Hospital', d: 'Nov 02, 2025', u: '2' },
            { h: 'Hinduja Hospital', d: 'Aug 17, 2025', u: '1' }].
            map((r, i, arr) =>
            <div key={i} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10, borderBottom: i < arr.length - 1 ? `0.5px solid ${BN.divider}` : 'none' }}>
                <BNBloodBadge group="O+" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.h}</div>
                  <div style={{ fontSize: 12, color: BN.muted }}>{r.d}</div>
                </div>
                <div style={{ fontSize: 13, color: BN.muted, fontWeight: 600 }}>{r.u} unit</div>
              </div>
            )}
          </div>
        </div>

        {/* Account */}
        <div style={{ background: '#fff', borderRadius: 12, border: `0.5px solid ${BN.divider}`, marginTop: 4 }}>
          {[
          { l: 'Edit Profile' },
          { l: 'Notification Preferences' },
          { l: 'Help & FAQ' },
          { l: 'Log Out', danger: true }].
          map((r, i, arr) =>
          <div key={r.l} style={{ padding: 14, display: 'flex', alignItems: 'center', borderBottom: i < arr.length - 1 ? `0.5px solid ${BN.divider}` : 'none' }}>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: r.danger ? BN.crimson : BN.text }}>{r.l}</div>
              {Ico.chev(BN.muted)}
            </div>
          )}
        </div>
      </div>
      <BNBottomNav tabs={donorTabs()} active={2} />
    </BNPhone>);

}

Object.assign(window, { S08_DonorHome, S09_RequestDetail, S09a_ConfirmModal, S10_Commitments, S11_LiveMap, S12_DonorProfile, donorTabs });