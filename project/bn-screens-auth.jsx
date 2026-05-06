// Authentication screens — Splash, Donor Sign Up, Login, Hospital Login, Admin

// ── S-01 Splash ────────────────────────────────────────────────────────
function S01_Splash() {
  return (
    <BNPhone statusLight>
      <div style={{
        position: 'absolute', inset: 0, background: BN.gradient,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <BNLogoMark size={120} fill="#fff" />
          <div style={{
            fontFamily: BN.display, fontSize: 44, fontWeight: 800, color: '#fff',
            letterSpacing: 3, lineHeight: 1, marginTop: 4,
          }}>BLOOD NET</div>
          <div style={{ fontFamily: BN.ui, fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
            Every drop counts.
          </div>
        </div>
        <div style={{ paddingBottom: 50, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button style={{
            width: '100%', height: 52, borderRadius: 14, background: '#fff', color: BN.crimson,
            border: 'none', fontFamily: BN.ui, fontWeight: 600, fontSize: 16,
          }}>I am a Donor</button>
          <button style={{
            width: '100%', height: 52, borderRadius: 14, background: 'transparent', color: '#fff',
            border: '1.5px solid #fff', fontFamily: BN.ui, fontWeight: 600, fontSize: 16,
          }}>I am a Hospital</button>
        </div>
      </div>
    </BNPhone>
  );
}

// ── S-02 Donor Sign Up Step 1 ──────────────────────────────────────────
function S02_SignUpStep1() {
  const groups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
  const selected = 'O+';
  return (
    <BNPhone>
      <div style={{ background: BN.burgundy, paddingTop: 50, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {Ico.back('#fff')}
          <div style={{ fontWeight: 600, fontSize: 17 }}>Create Account</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: BN.crimson }} />
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)' }} />
        </div>
        <div style={{ fontSize: 12, marginTop: 8, opacity: 0.8 }}>Step 1 of 2 · Personal Info</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <BNInput label="Full Name" value="Aarav Mehta" />
        <BNInput label="Age" value="28" />
        <div>
          <div style={{ fontSize: 12, color: BN.muted, fontWeight: 500, marginBottom: 8 }}>Blood Group</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {groups.map(g => {
              const sel = g === selected;
              return (
                <div key={g} style={{
                  height: 40, borderRadius: 100,
                  background: sel ? BN.crimson : '#fff',
                  border: sel ? 'none' : `1px solid ${BN.divider}`,
                  color: sel ? '#fff' : BN.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13, letterSpacing: 0.4,
                }}>{g}</div>
              );
            })}
          </div>
        </div>
        <BNInput label="Phone Number" value="+91 98765 43210" />
        <BNInput label="Email Address" value="aarav.m@gmail.com" />
        <BNInput label="Password" value="••••••••••" trailing={Ico.eye(BN.muted)} />
        <BNInput label="Confirm Password" value="••••••••••" trailing={Ico.eye(BN.muted)} />
      </div>
      <div style={{ padding: 20, paddingBottom: 28, borderTop: `0.5px solid ${BN.divider}`, background: '#fff' }}>
        <div style={{ textAlign: 'center', fontSize: 14, color: BN.muted, marginBottom: 12 }}>
          Already have an account? <span style={{ color: BN.crimson, fontWeight: 600 }}>Sign In</span>
        </div>
        <BNButton>Continue</BNButton>
      </div>
    </BNPhone>
  );
}

// ── S-03 Donor Sign Up Step 2 ──────────────────────────────────────────
function S03_SignUpStep2() {
  return (
    <BNPhone>
      <div style={{ background: BN.burgundy, paddingTop: 50, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {Ico.back('#fff')}
          <div style={{ fontWeight: 600, fontSize: 17 }}>Create Account</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: BN.crimson }} />
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: BN.crimson }} />
        </div>
        <div style={{ fontSize: 12, marginTop: 8, opacity: 0.8 }}>Step 2 of 2 · Location & History</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BNInput label="Your Location" value="Bandra West, Mumbai" trailing={Ico.pin(BN.crimson)} />

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Have you donated blood before?</div>
          <div style={{ display: 'flex', gap: 8, background: BN.bg, padding: 4, borderRadius: 12 }}>
            <div style={{ flex: 1, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: BN.muted }}>Yes</div>
            <div style={{ flex: 1, height: 44, borderRadius: 10, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: BN.text }}>No</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(26,122,74,0.08)', border: `1px solid rgba(26,122,74,0.3)`,
          borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: BN.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {Ico.check('#fff', 18)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: BN.success }}>You're immediately eligible to donate!</div>
            <div style={{ fontSize: 12, color: BN.muted, marginTop: 2 }}>We'll notify you of nearby requests right away.</div>
          </div>
        </div>

        <div style={{
          background: '#fff', border: `0.5px solid ${BN.divider}`, borderRadius: 12, padding: 14,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          {Ico.shieldCheck(BN.info, 22)}
          <div style={{ fontSize: 13, color: BN.muted, lineHeight: 1.5 }}>
            Your data is encrypted and only shared with hospitals when you accept a request.
          </div>
        </div>
      </div>
      <div style={{ padding: 20, paddingBottom: 28, borderTop: `0.5px solid ${BN.divider}`, background: '#fff' }}>
        <BNButton>Create My Account</BNButton>
      </div>
    </BNPhone>
  );
}

// ── S-04 Donor Login ──────────────────────────────────────────────────
function S04_DonorLogin() {
  return (
    <BNPhone statusLight={false}>
      <div style={{ flex: 1, padding: 20, paddingTop: 70, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <BNAppIcon size={64} radius={16} />
          <div style={{ fontFamily: BN.display, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: BN.burgundy, marginTop: 6 }}>BLOOD NET</div>
        </div>
        <div style={{ fontFamily: BN.ui, fontWeight: 700, fontSize: 28, color: BN.text, marginBottom: 6 }}>Welcome Back</div>
        <div style={{ fontSize: 14, color: BN.muted, marginBottom: 28 }}>Sign in to continue saving lives.</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BNInput label="Email Address" value="aarav.m@gmail.com" />
          <div>
            <BNInput label="Password" value="••••••••••" trailing={Ico.eye(BN.muted)} />
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <span style={{ color: BN.crimson, fontWeight: 600, fontSize: 14 }}>Forgot Password?</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <BNButton>Sign In</BNButton>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center', fontSize: 14, color: BN.muted, paddingBottom: 28 }}>
          New to Blood Net? <span style={{ color: BN.crimson, fontWeight: 600 }}>Create Account</span>
        </div>
      </div>
    </BNPhone>
  );
}

// ── S-05 Hospital Login ────────────────────────────────────────────────
function S05_HospitalLogin() {
  return (
    <BNPhone statusLight={false}>
      <div style={{ flex: 1, padding: 20, paddingTop: 70, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 32 }}>
          <BNAppIcon size={64} radius={16} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <div style={{ fontFamily: BN.display, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: BN.burgundy }}>BLOOD NET</div>
            {Ico.cross(BN.burgundy, 18)}
          </div>
        </div>
        <div style={{ fontFamily: BN.ui, fontWeight: 700, fontSize: 28, color: BN.text }}>Welcome Back</div>
        <div style={{ fontSize: 14, color: BN.muted, marginTop: 4, marginBottom: 28 }}>Hospital Portal</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BNInput label="Username" value="kemhospital" />
          <BNInput label="Password" value="••••••••••" error="Those credentials don't match. Please try again." trailing={Ico.eye(BN.muted)} />
        </div>

        <div style={{ marginTop: 28 }}>
          <BNButton>Sign In</BNButton>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center', fontSize: 13, color: BN.muted, fontStyle: 'italic', paddingBottom: 28 }}>
          Contact Blood Net Admin for access
        </div>
      </div>
    </BNPhone>
  );
}

// ── S-06 Admin Hospital Manager ────────────────────────────────────────
function S06_AdminPanel() {
  const hospitals = [
    { name: 'KEM Hospital', user: 'kemhospital', date: 'Apr 12, 2026' },
    { name: 'Lilavati Medical', user: 'lilavati_med', date: 'Apr 02, 2026' },
    { name: 'Tata Memorial', user: 'tatamem', date: 'Mar 28, 2026' },
    { name: 'Nanavati Super Specialty', user: 'nanavati_ss', date: 'Mar 19, 2026' },
    { name: 'Wockhardt Hospitals', user: 'wockhardt', date: 'Mar 11, 2026' },
    { name: 'Hinduja Hospital', user: 'hinduja_h', date: 'Feb 27, 2026' },
  ];
  return (
    <BNPhone>
      <div style={{ background: BN.burgundyDark, paddingTop: 50, paddingBottom: 14, paddingLeft: 20, paddingRight: 20, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Admin Panel</div>
        {Ico.logout('rgba(255,255,255,0.7)')}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[['Total','24'],['Active','18'],['This Mo.','3']].map(([l,v]) => (
            <div key={l} style={{ background: '#fff', borderRadius: 10, padding: 12, border: `0.5px solid ${BN.divider}` }}>
              <div style={{ fontSize: 11, color: BN.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{l}</div>
              <div style={{ fontFamily: BN.display, fontSize: 28, fontWeight: 800, color: BN.crimson, lineHeight: 1, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, color: BN.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 4 }}>Hospitals</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {hospitals.map((h, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, padding: 14, border: `0.5px solid ${BN.divider}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: BN.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Ico.cross(BN.burgundy, 16)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{h.name}</div>
                <div style={{ fontSize: 12, color: BN.muted, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{h.user}</div>
                <div style={{ fontSize: 11, color: BN.muted, marginTop: 2 }}>Created {h.date}</div>
              </div>
              {Ico.moreV(BN.muted, 18)}
            </div>
          ))}
        </div>
      </div>
      {/* FAB */}
      <div style={{ position: 'absolute', right: 20, bottom: 30 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 28, background: BN.crimson,
          boxShadow: '0 6px 20px rgba(232,0,61,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Ico.plus('#fff', 24)}</div>
      </div>
    </BNPhone>
  );
}

// ── S-07 Admin Create Hospital (sheet) ─────────────────────────────────
function S07_AdminCreate() {
  return (
    <BNPhone>
      {/* dimmed underlay */}
      <div style={{ position: 'absolute', inset: 0, background: BN.burgundyDark, opacity: 1 }}>
        <div style={{ paddingTop: 50, paddingLeft: 20, color: '#fff', fontWeight: 700, fontSize: 18 }}>Admin Panel</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,0,8,0.6)' }} />

      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 20, paddingBottom: 28, maxHeight: '78%', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ width: 40, height: 4, background: BN.divider, borderRadius: 2, margin: '0 auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>New Hospital</div>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: BN.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Ico.close(BN.muted, 16)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          <BNInput label="Hospital Name" value="Breach Candy Hospital" />
          <BNInput label="Hospital Address" value="60A Bhulabhai Desai Road, Mumbai 400026" />
          <BNInput label="Contact Phone" value="+91 22 2367 1888" />
          <BNInput label="Username" value="breachcandy" />
          <BNInput label="Password" value="X7$mqK9pLn2v" trailing={Ico.eye(BN.muted)} />
          <div style={{ color: BN.crimson, fontSize: 13, fontWeight: 600 }}>↻ Generate Strong Password</div>
        </div>
        <div style={{ marginTop: 16 }}>
          <BNButton>Save Hospital</BNButton>
        </div>
      </div>
    </BNPhone>
  );
}

Object.assign(window, { S01_Splash, S02_SignUpStep1, S03_SignUpStep2, S04_DonorLogin, S05_HospitalLogin, S06_AdminPanel, S07_AdminCreate });
