import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ── Shared CSS Variables ── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #050e17;
    --surface:      #0b1928;
    --surface2:     #0f2135;
    --surface3:     #162840;
    --accent:       #00d28c;
    --accent-dim:   rgba(0,210,140,0.12);
    --accent-glow:  rgba(0,210,140,0.3);
    --accent2:      #00a8ff;
    --text:         #dff0ea;
    --text-muted:   rgba(200,230,218,0.48);
    --border:       rgba(0,210,140,0.15);
    --border-focus: rgba(0,210,140,0.55);
    --error:        #ff5a5a;
    --success:      #00d28c;
  }

  html, body { height: 100%; }
  body { background: var(--bg); font-family: 'Syne', sans-serif; -webkit-font-smoothing: antialiased; }
`;

/* ── Background Grid ── */
const GridLines = () => (
  <svg className="cc-grid" viewBox="0 0 900 650"
    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    {[...Array(14)].map((_,i) => (
      <line key={`v${i}`} x1={i*68} y1="0" x2={i*68} y2="650"
        stroke="rgba(0,210,140,0.04)" strokeWidth="1"/>
    ))}
    {[...Array(11)].map((_,i) => (
      <line key={`h${i}`} x1="0" y1={i*65} x2="900" y2={i*65}
        stroke="rgba(0,210,140,0.04)" strokeWidth="1"/>
    ))}
    <circle cx="420" cy="325" r="200" fill="none" stroke="rgba(0,210,140,0.035)" strokeWidth="1"/>
    <circle cx="420" cy="325" r="340" fill="none" stroke="rgba(0,210,140,0.02)" strokeWidth="1"/>
  </svg>
);

/* ── Lock / Key Illustration ── */
const SecurityIllustration = () => (
  <svg viewBox="0 0 400 340" fill="none"
    xmlns="http://www.w3.org/2000/svg" className="cc-illustration">

    <ellipse cx="200" cy="195" rx="145" ry="90" fill="rgba(0,210,140,0.055)"/>

    {/* Lock body */}
    <rect x="136" y="175" width="128" height="110" rx="14"
      fill="rgba(11,25,40,0.96)" stroke="rgba(0,210,140,0.42)" strokeWidth="1.8"/>

    {/* Lock shackle */}
    <path d="M162 175 V142 a38 38 0 0 1 76 0 V175"
      stroke="rgba(0,210,140,0.5)" strokeWidth="8"
      strokeLinecap="round" fill="none"/>

    {/* Keyhole outer */}
    <circle cx="200" cy="222" r="18"
      fill="rgba(0,210,140,0.1)" stroke="rgba(0,210,140,0.4)" strokeWidth="1.5"/>
    {/* Keyhole slot */}
    <rect x="196" y="222" width="8" height="22" rx="4"
      fill="rgba(0,210,140,0.35)"/>
    {/* Keyhole circle */}
    <circle cx="200" cy="220" r="7" fill="rgba(0,210,140,0.5)"/>

    {/* Shield behind lock */}
    <path d="M200 80 L248 102 V150 C248 178 226 196 200 206 C174 196 152 178 152 150 V102 Z"
      fill="rgba(0,210,140,0.05)" stroke="rgba(0,210,140,0.2)" strokeWidth="1.2"/>

    {/* Orbit dots */}
    {[
      {cx:200, cy:80,  r:5, col:"rgba(0,210,140,0.7)"},
      {cx:290, cy:230, r:4, col:"rgba(0,168,255,0.6)"},
      {cx:110, cy:220, r:4, col:"rgba(0,210,140,0.5)"},
    ].map(({cx,cy,r,col},i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={col}/>
    ))}

    {/* Dashed orbit ring */}
    <ellipse cx="200" cy="200" rx="115" ry="115"
      fill="none" stroke="rgba(0,210,140,0.08)" strokeWidth="1" strokeDasharray="5 6"/>

    {/* Floating "email sent" badge */}
    <rect x="38" y="130" width="100" height="44" rx="8"
      fill="rgba(11,25,40,0.94)" stroke="rgba(0,210,140,0.22)" strokeWidth="1"/>
    <text x="88" y="149" textAnchor="middle" fill="rgba(0,210,140,0.5)"
      fontSize="8" fontFamily="'Space Mono',monospace">RESET LINK</text>
    <text x="88" y="165" textAnchor="middle" fill="rgba(0,210,140,0.88)"
      fontSize="12" fontFamily="'Space Mono',monospace" fontWeight="700">SECURE</text>

    {/* Floating "2FA" badge */}
    <rect x="262" y="128" width="100" height="44" rx="8"
      fill="rgba(11,25,40,0.94)" stroke="rgba(0,168,255,0.22)" strokeWidth="1"/>
    <text x="312" y="147" textAnchor="middle" fill="rgba(0,168,255,0.5)"
      fontSize="8" fontFamily="'Space Mono',monospace">VERIFIED</text>
    <text x="312" y="163" textAnchor="middle" fill="rgba(0,168,255,0.88)"
      fontSize="12" fontFamily="'Space Mono',monospace" fontWeight="700">OTP ✓</text>

    {/* Bottom bar */}
    <rect x="60" y="298" width="280" height="30" rx="7"
      fill="rgba(11,25,40,0.92)" stroke="rgba(0,210,140,0.12)" strokeWidth="1"/>
    <rect x="70" y="307" width="56" height="12" rx="3" fill="rgba(0,210,140,0.55)"/>
    <rect x="134" y="307" width="36" height="12" rx="3" fill="rgba(0,210,140,0.2)"/>
    <rect x="178" y="307" width="48" height="12" rx="3" fill="rgba(0,210,140,0.15)"/>
    <text x="200" y="340" textAnchor="middle" fill="rgba(0,210,140,0.28)"
      fontSize="8" fontFamily="'Space Mono',monospace">END-TO-END ENCRYPTED RECOVERY</text>

    {/* Animated pulse on lock */}
    <circle cx="200" cy="230" r="20" fill="rgba(0,210,140,0.06)"
      style={{animation:"cc-pulse 3s ease-in-out infinite"}}/>
  </svg>
);

/* ── OTP Input ── */
const OtpInput = ({ value, onChange }) => {
  const refs = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];
  const digits = value.split("").concat(Array(6).fill("")).slice(0,6);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = digits.map((d,j) => j===i ? "" : d).join("");
      onChange(next);
      if (i > 0) refs[i-1].current?.focus();
    } else if (/^[0-9]$/.test(e.key)) {
      const next = digits.map((d,j) => j===i ? e.key : d).join("").slice(0,6);
      onChange(next);
      if (i < 5) refs[i+1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    onChange(pasted);
    refs[Math.min(pasted.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="cc-otp-wrap">
      {digits.map((d, i) => (
        <input key={i} ref={refs[i]}
          className={`cc-otp-cell ${d ? "filled" : ""}`}
          type="text" inputMode="numeric"
          maxLength={1} value={d}
          onChange={() => {}}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
        />
      ))}
    </div>
  );
};

/* ── Main Component ── */
export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // STEP: "email" → "otp" → "reset" → "done"
  const [step,     setStep]     = useState("email");
  const [email,    setEmail]    = useState("");
  const [otp,      setOtp]      = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCfm,  setShowCfm]  = useState(false);
  const [active,   setActive]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [mounted,  setMounted]  = useState(false);
  const [timer,    setTimer]    = useState(60);
  const [canResend,setCanResend]= useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  /* countdown resend */
  useEffect(() => {
    if (step !== "otp") return;
    setTimer(60); setCanResend(false);
    const id = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(id); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  const getStrength = pw => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const S_LABELS = ["","Weak","Fair","Good","Strong"];
  const S_COLORS = ["","#ff5a5a","#f0a500","#4fc3f7","#00d28c"];
  const strength = getStrength(password);
  const pwMatch  = confirm && password === confirm;
  const pwBad    = confirm && password !== confirm;

  const handleEmailSubmit = e => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true);
    // TODO: POST /api/auth/forgot-password
    setTimeout(() => { setLoading(false); setStep("otp"); }, 1600);
  };

  const handleOtpSubmit = e => {
    e.preventDefault();
    setError("");
    if (otp.length < 6) { setError("Enter the complete 6-digit code."); return; }
    setLoading(true);
    // TODO: POST /api/auth/verify-otp
    setTimeout(() => { setLoading(false); setStep("reset"); }, 1600);
  };

  const handleResetSubmit = e => {
    e.preventDefault();
    setError("");
    if (pwBad)           { setError("Passwords do not match."); return; }
    if (strength < 2)    { setError("Please choose a stronger password."); return; }
    setLoading(true);
    // TODO: POST /api/auth/reset-password
    setTimeout(() => { setLoading(false); setStep("done"); }, 1800);
  };

  const stepMeta = {
    email: { title: "Reset password",     sub: "// enter your registered email",       prog: 1 },
    otp:   { title: "Check your inbox",   sub: "// enter the 6-digit verification code", prog: 2 },
    reset: { title: "New password",       sub: "// set a strong new password",           prog: 3 },
    done:  { title: "All done!",          sub: "",                                        prog: 4 },
  };
  const meta = stepMeta[step];

  return (
    <>
      <style>{GLOBAL_STYLES}{`
        .cc-page {
          min-height: 100vh; display: flex;
          overflow: hidden; background: var(--bg);
        }

        /* ── LEFT ── */
        .cc-left {
          width: 44%; position: relative;
          display: flex; flex-direction: column;
          justify-content: center; align-items: flex-start;
          padding: 64px 52px; overflow: hidden;
          opacity: 0; transform: translateX(-28px);
          transition: opacity .85s ease, transform .85s ease;
        }
        .cc-left.on { opacity: 1; transform: none; }

        .cc-grid { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
        .cc-blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
        .cc-blob-1 { width: 320px; height: 320px; background: rgba(0,210,140,0.065); top: -80px; left: -80px; }
        .cc-blob-2 { width: 200px; height: 200px; background: rgba(0,168,255,0.05); bottom: 60px; right: 0; }

        .cc-logo {
          display: flex; align-items: center; gap: 13px; margin-bottom: 30px; z-index: 1;
          opacity: 0; transform: translateY(10px);
          transition: opacity .6s .25s ease, transform .6s .25s ease;
        }
        .cc-logo.on { opacity: 1; transform: none; }
        .cc-logo-icon {
          width: 44px; height: 44px; background: var(--accent-dim);
          border: 1.5px solid var(--accent); border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono',monospace; font-size: 16px; font-weight: 700;
          color: var(--accent); box-shadow: 0 0 22px rgba(0,210,140,0.22);
        }
        .cc-logo-text {
          font-family: 'Space Mono',monospace; font-size: 12.5px; font-weight: 700;
          color: var(--text); letter-spacing: .05em; line-height: 1.35;
        }
        .cc-logo-text em { color: var(--accent); font-style: normal; }

        .cc-tagline {
          font-size: 34px; font-weight: 800; color: var(--text); line-height: 1.18;
          margin-bottom: 14px; z-index: 1;
          opacity: 0; transform: translateY(10px);
          transition: opacity .6s .4s ease, transform .6s .4s ease;
        }
        .cc-tagline.on { opacity: 1; transform: none; }
        .cc-tagline .hi { color: var(--accent); }

        .cc-sub {
          font-size: 12.5px; color: var(--text-muted); max-width: 300px;
          line-height: 1.8; font-family: 'Space Mono',monospace;
          z-index: 1; margin-bottom: 36px;
          opacity: 0; transition: opacity .6s .54s ease;
        }
        .cc-sub.on { opacity: 1; }

        .cc-illus-wrap {
          z-index: 1; width: 100%;
          opacity: 0; transform: translateY(14px);
          transition: opacity .75s .66s ease, transform .75s .66s ease;
        }
        .cc-illus-wrap.on { opacity: 1; transform: none; }
        .cc-illustration { width: 100%; max-width: 400px; display: block; }

        .cc-security-list {
          z-index: 1; margin-top: 22px; display: flex; flex-direction: column; gap: 10px;
          opacity: 0; transition: opacity .6s .88s ease;
        }
        .cc-security-list.on { opacity: 1; }
        .cc-sec-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 12px; color: var(--text-muted); font-family: 'Space Mono',monospace;
        }
        .cc-sec-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          flex-shrink: 0; box-shadow: 0 0 8px var(--accent);
        }

        /* ── RIGHT ── */
        .cc-right {
          width: 56%; display: flex; align-items: center; justify-content: center;
          padding: 40px 44px; position: relative;
          opacity: 0; transform: translateX(28px);
          transition: opacity .85s .15s ease, transform .85s .15s ease;
        }
        .cc-right.on { opacity: 1; transform: none; }

        .cc-card {
          width: 100%; max-width: 460px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 22px; padding: 46px 42px;
          box-shadow: 0 0 80px rgba(0,0,0,0.55),
                      0 0 140px rgba(0,210,140,0.035),
                      inset 0 1px 0 rgba(255,255,255,0.03);
        }

        /* Progress */
        .cc-progress {
          display: flex; gap: 7px; margin-bottom: 28px;
        }
        .cc-prog-step {
          flex: 1; height: 4px; border-radius: 2px;
          background: var(--border); transition: background .4s, box-shadow .4s;
          position: relative; overflow: hidden;
        }
        .cc-prog-step.done { background: var(--accent); box-shadow: 0 0 8px rgba(0,210,140,0.35); }
        .cc-prog-step.active {
          background: var(--border);
        }
        .cc-prog-step.active::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          animation: cc-prog-fill .8s ease forwards;
        }
        @keyframes cc-prog-fill { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); } }

        .cc-card-title { font-size: 26px; font-weight: 800; color: var(--text); margin-bottom: 5px; }
        .cc-card-sub { font-size: 12px; color: var(--text-muted); font-family: 'Space Mono',monospace; margin-bottom: 28px; }

        /* Back button */
        .cc-back {
          display: flex; align-items: center; gap: 7px;
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); font-family: 'Space Mono',monospace;
          font-size: 11.5px; padding: 0; margin-bottom: 22px;
          transition: color .2s;
        }
        .cc-back:hover { color: var(--accent); }

        /* Fields */
        .cc-field { margin-bottom: 18px; }
        .cc-label {
          display: block; font-size: 10.5px; font-weight: 700;
          color: var(--text-muted); text-transform: uppercase;
          letter-spacing: .1em; margin-bottom: 8px;
          font-family: 'Space Mono',monospace; transition: color .2s;
        }
        .cc-label.on { color: var(--accent); }

        .cc-input-wrap {
          position: relative; border: 1px solid var(--border);
          border-radius: 11px; background: rgba(0,0,0,0.22);
          transition: border-color .22s, box-shadow .22s; overflow: hidden;
        }
        .cc-input-wrap.on    { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(0,210,140,0.08); }
        .cc-input-wrap.err   { border-color: rgba(255,90,90,0.5)!important; box-shadow: 0 0 0 3px rgba(255,90,90,0.07)!important; }
        .cc-input-wrap.ok-f  { border-color: rgba(0,210,140,0.45); }

        .cc-input-line {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transform: scaleX(0); transform-origin: left;
          transition: transform .32s ease;
        }
        .cc-input-wrap.on .cc-input-line { transform: scaleX(1); }

        .cc-input {
          width: 100%; padding: 13px 44px 13px 15px;
          background: transparent; border: none; outline: none;
          font-family: 'Space Mono',monospace; font-size: 12.5px;
          color: var(--text); caret-color: var(--accent);
        }
        .cc-input::placeholder { color: rgba(200,230,218,0.25); }

        .cc-input-icon {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); display: flex; align-items: center;
          cursor: pointer; transition: color .2s;
        }
        .cc-input-icon:hover { color: var(--accent); }

        /* Email hint */
        .cc-email-hint {
          display: flex; align-items: flex-start; gap: 9px;
          background: rgba(0,210,140,0.06); border: 1px solid rgba(0,210,140,0.2);
          border-radius: 10px; padding: 12px 14px;
          margin-bottom: 22px;
          font-size: 11.5px; color: var(--text-muted);
          font-family: 'Space Mono',monospace; line-height: 1.65;
        }
        .cc-email-hint svg { flex-shrink: 0; margin-top: 1px; }
        .cc-email-val { color: var(--accent); font-weight: 700; }

        /* OTP inputs */
        .cc-otp-wrap {
          display: flex; gap: 10px; justify-content: center;
          margin-bottom: 8px;
        }
        .cc-otp-cell {
          width: 52px; height: 58px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 12px; text-align: center;
          font-family: 'Space Mono',monospace; font-size: 22px; font-weight: 700;
          color: var(--text); outline: none; caret-color: var(--accent);
          transition: border-color .22s, box-shadow .22s, background .22s;
        }
        .cc-otp-cell:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(0,210,140,0.1);
          background: rgba(0,210,140,0.05);
        }
        .cc-otp-cell.filled {
          border-color: rgba(0,210,140,0.4);
          color: var(--accent);
        }

        .cc-resend-row {
          text-align: center; font-size: 12px; color: var(--text-muted);
          font-family: 'Space Mono',monospace; margin-bottom: 22px;
        }
        .cc-resend-btn {
          background: none; border: none; cursor: pointer;
          color: var(--accent); font-family: inherit; font-size: inherit;
          transition: opacity .2s; padding: 0;
        }
        .cc-resend-btn:disabled { color: var(--text-muted); cursor: default; opacity: .6; }
        .cc-resend-btn:not(:disabled):hover { opacity: .75; text-decoration: underline; }

        /* Password strength */
        .cc-strength { margin-top: 8px; }
        .cc-s-bars { display: flex; gap: 4px; margin-bottom: 4px; }
        .cc-s-bar {
          flex: 1; height: 3px; border-radius: 2px;
          background: rgba(255,255,255,0.07); transition: background .3s;
        }
        .cc-s-label { font-size: 10px; font-family: 'Space Mono',monospace; color: var(--text-muted); }
        .cc-pw-hint { font-size: 10.5px; font-family: 'Space Mono',monospace; margin-top: 6px; }
        .cc-pw-hint.ok  { color: var(--success); }
        .cc-pw-hint.bad { color: var(--error); }

        /* Error */
        .cc-error {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,90,90,0.08); border: 1px solid rgba(255,90,90,0.25);
          border-radius: 9px; padding: 10px 14px;
          font-size: 12px; color: var(--error);
          font-family: 'Space Mono',monospace; margin-bottom: 16px;
        }

        /* Submit */
        .cc-submit {
          width: 100%; padding: 14px;
          background: var(--accent); border: none; border-radius: 11px;
          font-family: 'Syne',sans-serif; font-size: 15px; font-weight: 700;
          color: #050e17; cursor: pointer;
          position: relative; overflow: hidden;
          transition: box-shadow .3s, transform .2s;
          display: flex; align-items: center; justify-content: center; gap: 9px;
        }
        .cc-submit:hover:not(:disabled) { box-shadow: 0 0 34px rgba(0,210,140,0.42); transform: translateY(-1px); }
        .cc-submit:active:not(:disabled) { transform: none; }
        .cc-submit:disabled { opacity: .5; cursor: not-allowed; }
        .cc-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.22) 50%,transparent 60%);
          transform: translateX(-100%); animation: cc-shimmer 2.8s infinite;
        }
        @keyframes cc-shimmer { to { transform: translateX(210%); } }
        .cc-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(5,14,23,.28);
          border-top-color: #050e17; border-radius: 50%;
          animation: cc-spin .75s linear infinite;
        }
        @keyframes cc-spin { to { transform: rotate(360deg); } }

        .cc-bottom {
          text-align: center; margin-top: 22px;
          font-size: 12.5px; color: var(--text-muted);
          font-family: 'Space Mono',monospace;
        }
        .cc-bottom button {
          color: var(--accent); background: none; border: none;
          cursor: pointer; font-family: inherit; font-size: inherit;
          transition: opacity .2s;
        }
        .cc-bottom button:hover { opacity: .75; text-decoration: underline; }

        /* Done screen */
        .cc-done {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; padding: 20px; min-height: 380px;
        }
        .cc-done-ring {
          width: 78px; height: 78px; border-radius: 50%;
          background: var(--accent-dim); border: 2px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 26px; box-shadow: 0 0 44px rgba(0,210,140,0.28);
          animation: cc-pop .5s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes cc-pop { from { transform: scale(.35); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .cc-done-title { font-size: 26px; font-weight: 800; color: var(--text); margin-bottom: 10px; }
        .cc-done-sub {
          font-size: 12px; color: var(--text-muted); font-family: 'Space Mono',monospace;
          line-height: 1.8; margin-bottom: 34px;
        }
        .cc-done-btn {
          padding: 13px 38px;
          background: var(--accent); border: none; border-radius: 11px;
          font-family: 'Syne',sans-serif; font-size: 14px; font-weight: 700;
          color: #050e17; cursor: pointer;
          transition: box-shadow .3s, transform .2s;
        }
        .cc-done-btn:hover { box-shadow: 0 0 28px rgba(0,210,140,0.42); transform: translateY(-1px); }

        /* Pulse animation */
        @keyframes cc-pulse {
          0%,100% { r: 20; opacity: .06; }
          50%      { r: 30; opacity: .03; }
        }

        @media (max-width: 840px) {
          .cc-left { display: none; }
          .cc-right { width: 100%; padding: 24px; }
        }
      `}</style>

      <div className="cc-page">
        {/* ── LEFT ── */}
        <div className={`cc-left ${mounted ? "on" : ""}`}>
          <div className="cc-blob cc-blob-1" />
          <div className="cc-blob cc-blob-2" />
          <GridLines />

          <div className={`cc-logo ${mounted ? "on" : ""}`}>
            <div className="cc-logo-icon">₵</div>
            <div className="cc-logo-text">CLOUD<em>COST</em><br />TRACKER</div>
          </div>

          <h2 className={`cc-tagline ${mounted ? "on" : ""}`}>
            Secure<br />account <span className="hi">recovery</span><br />in 3 steps.
          </h2>

          <p className={`cc-sub ${mounted ? "on" : ""}`}>
            We'll send a one-time code<br />
            to verify it's really you.
          </p>

          <div className={`cc-illus-wrap ${mounted ? "on" : ""}`}>
            <SecurityIllustration />
          </div>

          <ul className={`cc-security-list ${mounted ? "on" : ""}`}>
            {[
              "256-bit encrypted recovery link",
              "OTP expires in 10 minutes",
              "Password strength enforced",
            ].map((f,i) => (
              <li key={i} className="cc-sec-item">
                <div className="cc-sec-dot" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT ── */}
        <div className={`cc-right ${mounted ? "on" : ""}`}>
          <div className="cc-card">

            {/* ─── STEP: DONE ─── */}
            {step === "done" ? (
              <div className="cc-done">
                <div className="cc-done-ring">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                    stroke="#00d28c" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                </div>
                <h2 className="cc-done-title">Password reset!</h2>
                <p className="cc-done-sub">
                  Your password has been updated<br />
                  successfully. Sign in with your<br />
                  new credentials.
                </p>
                <button className="cc-done-btn" onClick={() => navigate("/login")}>
                  Back to Sign In →
                </button>
              </div>
            ) : (
              <>
                {/* Progress bar */}
                <div className="cc-progress">
                  {[1,2,3].map(i => {
                    const progMap = { email:1, otp:2, reset:3 };
                    const cur = progMap[step];
                    return (
                      <div key={i}
                        className={`cc-prog-step ${i < cur ? "done" : i === cur ? "active" : ""}`}/>
                    );
                  })}
                </div>

                <h1 className="cc-card-title">{meta.title}</h1>
                <p className="cc-card-sub">{meta.sub}</p>

                {/* Back button (not on step 1) */}
                {step !== "email" && step !== "done" && (
                  <button className="cc-back"
                    onClick={() => {
                      setError("");
                      if (step === "otp")   setStep("email");
                      if (step === "reset") setStep("otp");
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <polyline points="15,18 9,12 15,6"/>
                    </svg>
                    Go back
                  </button>
                )}

                {error && (
                  <div className="cc-error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                {/* ─── STEP: EMAIL ─── */}
                {step === "email" && (
                  <form onSubmit={handleEmailSubmit}>
                    <div className="cc-field">
                      <label className={`cc-label ${active==="email" ? "on" : ""}`}>
                        Email Address
                      </label>
                      <div className={`cc-input-wrap ${active==="email" ? "on" : ""}`}>
                        <input className="cc-input" type="email"
                          placeholder="you@company.com"
                          value={email} onChange={e => setEmail(e.target.value)}
                          onFocus={() => setActive("email")}
                          onBlur={() => setActive(null)} autoComplete="email"/>
                        <span className="cc-input-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                        </span>
                        <div className="cc-input-line"/>
                      </div>
                    </div>

                    <button className="cc-submit" type="submit" disabled={loading || !email}>
                      <div className="cc-shimmer"/>
                      {loading
                        ? <><div className="cc-spinner"/> Sending code...</>
                        : <>Send Reset Code <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></>
                      }
                    </button>
                  </form>
                )}

                {/* ─── STEP: OTP ─── */}
                {step === "otp" && (
                  <form onSubmit={handleOtpSubmit}>
                    {/* Where we sent it */}
                    <div className="cc-email-hint">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(0,210,140,0.7)" strokeWidth="1.8">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <span>
                        Code sent to{" "}
                        <span className="cc-email-val">{email}</span>
                        . Check spam if you don't see it.
                      </span>
                    </div>

                    <div className="cc-field">
                      <label className="cc-label">6-Digit Code</label>
                      <OtpInput value={otp} onChange={setOtp}/>
                    </div>

                    <div className="cc-resend-row">
                      {canResend
                        ? <>Didn't get it?{" "}
                            <button type="button" className="cc-resend-btn"
                              onClick={() => {
                                setOtp("");
                                setTimer(60); setCanResend(false);
                                // TODO: resend OTP call
                              }}>
                              Resend code
                            </button>
                          </>
                        : <>Resend in <strong style={{color:"var(--accent)"}}>{timer}s</strong></>
                      }
                    </div>

                    <button className="cc-submit" type="submit"
                      disabled={loading || otp.length < 6}>
                      <div className="cc-shimmer"/>
                      {loading
                        ? <><div className="cc-spinner"/> Verifying...</>
                        : <>Verify Code <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></>
                      }
                    </button>
                  </form>
                )}

                {/* ─── STEP: RESET ─── */}
                {step === "reset" && (
                  <form onSubmit={handleResetSubmit}>
                    {/* New Password */}
                    <div className="cc-field">
                      <label className={`cc-label ${active==="pw" ? "on" : ""}`}>
                        New Password
                      </label>
                      <div className={`cc-input-wrap ${active==="pw" ? "on" : ""}`}>
                        <input className="cc-input" type={showPw ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          value={password} onChange={e => setPassword(e.target.value)}
                          onFocus={() => setActive("pw")}
                          onBlur={() => setActive(null)}/>
                        <span className="cc-input-icon" onClick={() => setShowPw(p=>!p)}>
                          {showPw
                            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </span>
                        <div className="cc-input-line"/>
                      </div>
                      {password && (
                        <div className="cc-strength">
                          <div className="cc-s-bars">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="cc-s-bar"
                                style={{background: i<=strength ? S_COLORS[strength] : undefined}}/>
                            ))}
                          </div>
                          <span className="cc-s-label" style={{color: S_COLORS[strength]}}>
                            {S_LABELS[strength]} password
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="cc-field">
                      <label className={`cc-label ${active==="cfm" ? "on" : ""}`}>
                        Confirm Password
                      </label>
                      <div className={`cc-input-wrap ${active==="cfm" ? "on" : ""} ${pwBad ? "err" : ""} ${pwMatch ? "ok-f" : ""}`}>
                        <input className="cc-input" type={showCfm ? "text" : "password"}
                          placeholder="Re-enter password"
                          value={confirm} onChange={e => setConfirm(e.target.value)}
                          onFocus={() => setActive("cfm")}
                          onBlur={() => setActive(null)}/>
                        <span className="cc-input-icon" onClick={() => setShowCfm(p=>!p)}>
                          {showCfm
                            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </span>
                        <div className="cc-input-line"/>
                      </div>
                      {pwBad   && <p className="cc-pw-hint bad">✗ Passwords do not match</p>}
                      {pwMatch && <p className="cc-pw-hint ok">✓ Passwords match</p>}
                    </div>

                    <button className="cc-submit" type="submit"
                      disabled={loading || !password || !confirm || pwBad || strength < 2}>
                      <div className="cc-shimmer"/>
                      {loading
                        ? <><div className="cc-spinner"/> Resetting...</>
                        : <>Reset Password <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></>
                      }
                    </button>
                  </form>
                )}

                <div className="cc-bottom">
                  Remember it now?{" "}
                  <button onClick={() => navigate("/login")}>Sign in →</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
