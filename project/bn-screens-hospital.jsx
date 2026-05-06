// Hospital screens — Dashboard, Post Request, Manage, Request Detail, Profile

const hospitalTabs = (active = 0) => ([
  { label: 'Dashboard', icon: (c) => Ico.grid(c) },
  { label: 'Post', icon: (c, a) => Ico.plusCircle(c, a) },
  { label: 'Manage', icon: (c) => Ico.clipboard(c), badge: '4' },
  { label: 'Profile', icon: (c) => Ico.hospital(c) },
]);

// ── S-13 Hospital Dashboard ───────────────────────────────────────────
function S13_HospitalDashboard() {
  return (
    <BNPhone>
      <div style={{ background: BN.burgundy, paddingTop: 50, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BNLogoMark size={22} fill="#fff" />
          <div style={{ fontFamily: BN.display, fontWeight: 800, fontSize: 18, letterSpacing: 1.5 }}>BLOOD NET</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>{Ico.bell('#fff')}<div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, background: BN.crimson, border: '1.5px solid #5A0020' }} /></div>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>KEM</div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 14, color: BN.muted }}>Welcome back,</div>
          <div style={{ fontFamily: BN.ui, fontSize: 24, fontWeight: 700 }}>KEM Hospital</div>
        </div>

        {/* Metrics 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { l: 'Active Requests', v: '4', c: BN.crimson, ic: Ico.dropOutline },
            { l: 'Donors Committed', v: '11', c: BN.success, ic: Ico.user },
            { l: 'Urgent', v: '2', c: BN.crimson, ic: Ico.bell, pulse: true },
            { l: 'Units Secured', v: '23', c: BN.burgundy, ic: Ico.drop },
          ].map((m) => (
            <div key={m.l} style={{ background: '#fff', borderRadius: 12, padding: 14, border: `0.5px solid ${BN.divider}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: m.c + '14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.ic(m.c, 18)}
                </div>
                {m.pulse && <span style={{ width: 8, height: 8, borderRadius: 4, background: BN.crimson, animation: 'bnPulse 1.2s ease-in-out infinite' }} />}
              </div>
              <div style={{ fontFamily: BN.display, fontSize: 32, fontWeight: 800, color: m.c, lineHeight: 1, marginTop: 10 }}>{m.v}</div>
              <div style={{ fontSize: 12, color: BN.muted, fontWeight: 600, marginTop: 2 }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 4 }}>
          <div style={{ flexShrink: 0, padding: '10px 14px', background: BN.crimson, color: '#fff', borderRadius: 100, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {Ico.plus('#fff', 14)} Post Urgent
          </div>
          <div style={{ flexShrink: 0, padding: '10px 14px', background: BN.info, color: '#fff', borderRadius: 100, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {Ico.calendar('#fff', 14)} Schedule
          </div>
          <div style={{ flexShrink: 0, padding: '10px 14px', background: '#fff', color: BN.muted, borderRadius: 100, fontSize: 13, fontWeight: 600, border: `1px solid ${BN.divider}` }}>
            View All
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Active Requests</div>
          <div style={{ color: BN.crimson, fontSize: 13, fontWeight: 600 }}>Post New</div>
        </div>

        <BNCard accent="urgent" padding={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BNBloodBadge group="O+" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>2 units · Urgent</div>
              <div style={{ fontSize: 11, color: BN.muted }}>Posted 12 min ago</div>
            </div>
            <span style={{ background: 'rgba(26,122,74,0.12)', color: BN.success, padding: '3px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>3 committed</span>
          </div>
        </BNCard>

        <BNCard accent="urgent" padding={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BNBloodBadge group="AB-" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>1 unit · Urgent</div>
              <div style={{ fontSize: 11, color: BN.muted }}>Posted 1h ago</div>
            </div>
            <span style={{ background: 'rgba(196,122,0,0.12)', color: BN.warn, padding: '3px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>0 committed</span>
          </div>
        </BNCard>

        <BNCard accent="scheduled" padding={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BNBloodBadge group="A+" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>3 units · Jun 15, 10:00 AM</div>
              <div style={{ fontSize: 11, color: BN.muted }}>Posted 2 days ago</div>
            </div>
            <span style={{ background: 'rgba(26,122,74,0.12)', color: BN.success, padding: '3px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>5 committed</span>
          </div>
        </BNCard>
      </div>
      <BNBottomNav tabs={hospitalTabs()} active={0} />
    </BNPhone>
  );
}

// ── S-14 Post Blood Request ───────────────────────────────────────────
function S14_PostRequest() {
  const groups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
  const sel = 'O+';
  return (
    <BNPhone>
      <div style={{ background: BN.burgundy, paddingTop: 50, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
        {Ico.back('#fff')}
        <div style={{ flex: 1, fontWeight: 700, fontSize: 17, textAlign: 'center', marginRight: 24 }}>Post Blood Request</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 100 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: BN.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>Blood Group</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {groups.map(g => {
              const isSel = g === sel;
              return (
                <div key={g} style={{
                  height: 44, borderRadius: 10,
                  background: isSel ? BN.crimson : '#fff',
                  border: isSel ? 'none' : `1px solid ${BN.divider}`,
                  color: isSel ? '#fff' : BN.text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14,
                }}>{g}</div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: BN.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>Units Needed</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: `1px solid ${BN.divider}`, borderRadius: 12, padding: '12px 16px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: BN.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Ico.minus(BN.crimson, 18)}</div>
            <div style={{ fontFamily: BN.display, fontSize: 36, fontWeight: 800, color: BN.crimson }}>2</div>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: BN.crimson, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Ico.plus('#fff', 18)}</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: BN.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>Urgency</div>
          <div style={{ display: 'flex', gap: 0, background: BN.bg, padding: 4, borderRadius: 12 }}>
            <div style={{ flex: 1, height: 48, borderRadius: 10, background: BN.crimson, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 700, fontSize: 14 }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: '#fff', animation: 'bnPulse 1.2s ease-in-out infinite' }} /> Urgent
            </div>
            <div style={{ flex: 1, height: 48, borderRadius: 10, color: BN.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}>
              {Ico.calendar(BN.muted, 16)} Scheduled
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: BN.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>Notes (optional)</div>
          <div style={{ background: '#fff', border: `1px solid ${BN.divider}`, borderRadius: 12, padding: 14, minHeight: 100, fontSize: 14, color: BN.text }}>
            Trauma patient in ICU after road accident. Donors who can arrive within 60 minutes are urgently needed.
            <div style={{ textAlign: 'right', fontSize: 11, color: BN.muted, marginTop: 8 }}>120 / 280</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 32, background: '#fff', borderTop: `0.5px solid ${BN.divider}` }}>
        <BNButton>Post Request</BNButton>
      </div>
    </BNPhone>
  );
}

// ── S-15 Manage Requests ──────────────────────────────────────────────
function S15_ManageRequests() {
  return (
    <BNPhone>
      <div style={{ background: BN.burgundy, paddingTop: 50, paddingBottom: 12, paddingLeft: 20, paddingRight: 20, color: '#fff' }}>
        <div style={{ fontWeight: 700, fontSize: 20 }}>Manage Requests</div>
      </div>
      <div style={{ background: '#fff', display: 'flex', borderBottom: `0.5px solid ${BN.divider}`, padding: '0 8px' }}>
        {['All', 'Urgent', 'Scheduled', 'Closed'].map((t, i) => (
          <div key={t} style={{ flex: 1, padding: '14px 0', textAlign: 'center', fontSize: 13, fontWeight: 600,
            color: i === 1 ? BN.crimson : BN.muted,
            borderBottom: i === 1 ? `2px solid ${BN.crimson}` : 'none',
          }}>{t}</div>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { g: 'O+', u: 2, urg: true, posted: '12 min ago', donors: 3, note: '' },
          { g: 'AB-', u: 1, urg: true, posted: '1h ago', donors: 0, note: 'Rare type' },
          { g: 'O-', u: 2, urg: true, posted: '3h ago', donors: 4, note: '' },
        ].map((r, i) => (
          <BNCard key={i} accent="urgent" padding={14}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BNBloodBadge group={r.g} />
                <BNTag color={BN.crimson} dot>Urgent</BNTag>
              </div>
              <div style={{ fontSize: 11, color: BN.muted }}>{r.posted}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{r.u} unit{r.u > 1 ? 's' : ''} needed</div>
            <div style={{ fontSize: 12, color: BN.muted, marginTop: 2 }}>{r.donors} donor{r.donors !== 1 ? 's' : ''} committed</div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: `0.5px solid ${BN.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: -6 }}>
                {Array.from({ length: Math.min(r.donors, 3) }).map((_, j) => (
                  <div key={j} style={{ marginLeft: j === 0 ? 0 : -8, border: '2px solid #fff', borderRadius: 12 }}>
                    <BNAvatar initials={['RM','PK','SS','AT'][j]} size={24} />
                  </div>
                ))}
                {r.donors === 0 && <div style={{ fontSize: 12, color: BN.warn, fontWeight: 600 }}>No donors yet</div>}
              </div>
              <div style={{ color: BN.crimson, fontSize: 13, fontWeight: 600 }}>Manage →</div>
            </div>
          </BNCard>
        ))}
      </div>
      <BNBottomNav tabs={hospitalTabs()} active={2} />
    </BNPhone>
  );
}

// ── S-16 Individual Request Management ───────────────────────────────
function S16_RequestManage() {
  const donors = [
    { n: 'Rajan M.', i: 'RM', d: '2.1 km', eta: '8 min', live: true, time: '2 min ago' },
    { n: 'Priya K.', i: 'PK', d: '3.4 km', eta: '12 min', live: true, time: '5 min ago' },
    { n: 'Sneha S.', i: 'SS', d: '5.8 km', eta: '18 min', live: false, time: '14 min ago' },
  ];
  return (
    <BNPhone>
      <div style={{ background: BN.burgundy, paddingTop: 50, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
        {Ico.back('#fff')}
        <div style={{ flex: 1, fontWeight: 700, fontSize: 17 }}>O+ · Urgent</div>
        {Ico.share('#fff')}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 100 }}>
        {/* Summary */}
        <div style={{ background: 'linear-gradient(135deg, #FFE5EC 0%, #FFF5F7 100%)', border: `1px solid rgba(232,0,61,0.2)`, borderRadius: 14, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <BNTag color={BN.crimson} dot>Urgent</BNTag>
            <div style={{ fontSize: 12, color: BN.muted }}>Posted 12 min ago</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <BNBloodBadge group="O+" size="lg" />
            <div>
              <div style={{ fontFamily: BN.display, fontSize: 32, fontWeight: 800, color: BN.crimson, lineHeight: 1 }}>2 / 2</div>
              <div style={{ fontSize: 12, color: BN.muted, fontWeight: 600 }}>Units secured</div>
            </div>
          </div>
        </div>

        {/* Live map */}
        <div style={{ background: BN.burgundyDark, borderRadius: 14, padding: 12, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: BN.success, animation: 'bnPulse 1.2s ease-in-out infinite' }} />
              <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: 0.5 }}>LIVE TRACKING</span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Updated just now</div>
          </div>
          <BNMap height={180} dark donors={3} showHospital />
        </div>

        {/* Donors */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Committed Donors (3)</div>
          <div style={{ background: '#fff', borderRadius: 12, border: `0.5px solid ${BN.divider}` }}>
            {donors.map((d, i) => (
              <div key={i} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < donors.length - 1 ? `0.5px solid ${BN.divider}` : 'none' }}>
                <BNAvatar initials={d.i} size={40} committed />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{d.n}</span>
                    <BNBloodBadge group="O+" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    {d.live && <span style={{ width: 6, height: 6, borderRadius: 3, background: BN.success, animation: 'bnPulse 1.2s ease-in-out infinite' }} />}
                    <span style={{ fontSize: 12, color: BN.muted }}>{d.d} · ETA {d.eta} · {d.time}</span>
                  </div>
                </div>
                {Ico.chev(BN.muted)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 32, background: '#fff', borderTop: `0.5px solid ${BN.divider}` }}>
        <div style={{ padding: '14px 0', textAlign: 'center', border: `1.5px solid ${BN.crimsonDark}`, color: BN.crimsonDark, borderRadius: 14, fontWeight: 600, fontSize: 15 }}>
          Close Request
        </div>
      </div>
    </BNPhone>
  );
}

// ── S-17 Hospital Profile ─────────────────────────────────────────────
function S17_HospitalProfile() {
  return (
    <BNPhone>
      <div style={{ background: BN.gradient, paddingTop: 50, paddingBottom: 24, paddingLeft: 20, paddingRight: 20, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: 30, border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {Ico.cross('#fff', 32)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 22 }}>KEM Hospital</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.18)', padding: '3px 8px', borderRadius: 100, marginTop: 4 }}>
              {Ico.shieldCheck('#fff', 12)}<span style={{ fontSize: 11, fontWeight: 600 }}>Verified by Blood Net</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, opacity: 0.85 }}>Acharya Donde Marg, Parel, Mumbai 400012</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14, marginTop: -14 }}>
        <BNCard padding={14}>
          {[
            ['Phone', '+91 22 2410 7000'],
            ['Email', 'requests@kem.org'],
            ['Website', 'kem.edu'],
          ].map(([k, v], i, arr) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < arr.length - 1 ? `0.5px solid ${BN.divider}` : 'none' }}>
              <div style={{ fontSize: 13, color: BN.muted }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </BNCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            { l: 'Requests', v: '142', c: BN.crimson },
            { l: 'Committed', v: '486', c: BN.success },
            { l: 'Units', v: '623', c: BN.burgundy },
          ].map((s) => (
            <div key={s.l} style={{ background: '#fff', borderRadius: 12, padding: 12, border: `0.5px solid ${BN.divider}`, textAlign: 'center' }}>
              <div style={{ fontFamily: BN.display, fontSize: 26, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: BN.muted, marginTop: 4, fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: `0.5px solid ${BN.divider}` }}>
          {['Edit Hospital Info', 'Change Password', 'Notification Preferences', 'Help & FAQ'].map((r, i, arr) => (
            <div key={r} style={{ padding: 14, display: 'flex', alignItems: 'center', borderBottom: i < arr.length - 1 ? `0.5px solid ${BN.divider}` : 'none' }}>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{r}</div>
              {Ico.chev(BN.muted)}
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 12, border: `0.5px solid ${BN.divider}` }}>
          <div style={{ padding: 14, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: BN.crimson }}>Log Out</div>
            {Ico.chev(BN.crimson)}
          </div>
        </div>
      </div>
      <BNBottomNav tabs={hospitalTabs()} active={3} />
    </BNPhone>
  );
}

// ── S-18 Notification Center ──────────────────────────────────────────
function S18_Notifications() {
  const items = [
    { dot: BN.crimson, icon: Ico.dropOutline, t: 'Urgent: KEM Hospital needs O+', b: '1.4 km away. Tap to view.', time: '3m', unread: true },
    { dot: BN.success, icon: Ico.check, t: 'Thank you for committing', b: 'Your location is being shared with KEM Hospital.', time: '12m', unread: true },
    { dot: BN.info, icon: Ico.calendar, t: 'Reminder: Donation tomorrow', b: '10:00 AM at Lilavati Hospital. See you there.', time: '2h', unread: false },
    { dot: BN.crimson, icon: Ico.dropOutline, t: 'New request: Tata Memorial', b: 'O+ needed · 3.2 km away.', time: '5h', unread: false },
    { dot: BN.warn, icon: Ico.clock, t: 'Eligibility approaching', b: 'You will be eligible to donate again in 7 days.', time: 'Yesterday', unread: false },
    { dot: BN.success, icon: Ico.shieldCheck, t: 'Donation completed', b: 'Hinduja Hospital received your donation. Thank you.', time: '2d', unread: false },
  ];
  return (
    <BNPhone>
      <div style={{ background: BN.burgundy, paddingTop: 50, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
        {Ico.back('#fff')}
        <div style={{ flex: 1, fontWeight: 700, fontSize: 17 }}>Notifications</div>
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85 }}>Mark All Read</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {items.map((n, i) => (
          <div key={i} style={{
            padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
            background: n.unread ? BN.bg : '#fff',
            borderBottom: `0.5px solid ${BN.divider}`,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: n.dot + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
              {n.icon(n.dot, 18)}
              {n.unread && <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, background: n.dot, border: '1.5px solid #fff' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{n.t}</div>
                <div style={{ fontSize: 11, color: BN.muted, flexShrink: 0 }}>{n.time}</div>
              </div>
              <div style={{ fontSize: 13, color: BN.muted, marginTop: 2, lineHeight: 1.4 }}>{n.b}</div>
            </div>
          </div>
        ))}
      </div>
    </BNPhone>
  );
}

// ── Bonus: Sign-up success ────────────────────────────────────────────
function S03b_SignUpSuccess() {
  return (
    <BNPhone>
      <div style={{ position: 'absolute', inset: 0, background: BN.bg }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: 32, textAlign: 'center', width: '100%', boxShadow: '0 20px 60px rgba(90,0,32,0.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, animation: 'bnDrop 600ms ease-out' }}>
            <BNAppIcon size={88} radius={22} />
          </div>
          <div style={{ width: 60, height: 60, borderRadius: 30, background: BN.success, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Ico.check('#fff', 36)}
          </div>
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Welcome to Blood Net!</div>
          <div style={{ fontSize: 14, color: BN.muted, lineHeight: 1.5, marginBottom: 24 }}>
            Your first request will appear as soon as one matches your blood type nearby.
          </div>
          <BNButton>Go to Home</BNButton>
        </div>
      </div>
    </BNPhone>
  );
}

Object.assign(window, { S13_HospitalDashboard, S14_PostRequest, S15_ManageRequests, S16_RequestManage, S17_HospitalProfile, S18_Notifications, S03b_SignUpSuccess, hospitalTabs });
