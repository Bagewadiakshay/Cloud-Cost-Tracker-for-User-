import { useState, useEffect } from "react";
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
  body {
    background: var(--bg);
    font-family: 'Syne', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`;

/* ── Background Grid ── */
const GridLines = () => (
  <svg className="cc-grid" viewBox="0 0 900 650"
    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    {[...Array(14)].map((_,i) => (
      <line key={`v${i}`} x1={i*68} y1="0" x2={i*68} y2="650"
        stroke="rgba(0,210,140,0.045)" strokeWidth="1"/>
    ))}
    {[...Array(11)].map((_,i) => (
      <line key={`h${i}`} x1="0" y1={i*65} x2="900" y2={i*65}
        stroke="rgba(0,210,140,0.045)" strokeWidth="1"/>
    ))}
    <circle cx="420" cy="325" r="200" fill="none"
      stroke="rgba(0,210,140,0.04)" strokeWidth="1"/>
    <circle cx="420" cy="325" r="340" fill="none"
      stroke="rgba(0,210,140,0.022)" strokeWidth="1"/>
  </svg>
);

/* ── Left Illustration ── */
const SignupIllustration = () => (
  <svg viewBox="0 0 420 340" fill="none"
    xmlns="http://www.w3.org/2000/svg" className="cc-illustration">

    <ellipse cx="210" cy="185" rx="155" ry="95" fill="rgba(0,210,140,0.055)"/>
    <ellipse cx="210" cy="165" rx="80" ry="55" fill="rgba(0,168,255,0.04)"/>

    {/* Central AWS hub */}
    <circle cx="210" cy="165" r="38"
      fill="rgba(11,25,40,0.95)" stroke="rgba(0,210,140,0.42)" strokeWidth="1.5"/>
    <circle cx="210" cy="165" r="26"
      fill="rgba(0,210,140,0.07)" stroke="rgba(0,210,140,0.22)" strokeWidth="1"/>
    <text x="210" y="171" textAnchor="middle" fill="rgba(0,210,140,0.92)"
      fontSize="12" fontFamily="'Space Mono',monospace" fontWeight="700">AWS</text>

    {/* Orbit ring dashed */}
    <ellipse cx="210" cy="165" rx="92" ry="92"
      fill="none" stroke="rgba(0,210,140,0.09)" strokeWidth="1" strokeDasharray="4 5"/>

    {/* Service nodes */}
    {[
      {x:210, y:68, label:"EC2", col:"rgba(0,210,140,0.85)"},
      {x:298, y:218, label:"S3",  col:"rgba(0,168,255,0.85)"},
      {x:122, y:218, label:"λ",   col:"rgba(0,210,140,0.75)"},
    ].map(({x,y,label,col}) => (
      <g key={label}>
        <line x1="210" y1="165" x2={x} y2={y}
          stroke="rgba(0,210,140,0.22)" strokeWidth="1" strokeDasharray="4 4"/>
        <circle cx={x} cy={y} r="22"
          fill="rgba(11,25,40,0.95)" stroke="rgba(0,210,140,0.32)" strokeWidth="1.5"/>
        <text x={x} y={y+5} textAnchor="middle" fill={col}
          fontSize="11" fontFamily="'Space Mono',monospace" fontWeight="700">{label}</text>
      </g>
    ))}

    {/* Metric badges top */}
    <rect x="28" y="52" width="92" height="44" rx="7"
      fill="rgba(11,25,40,0.92)" stroke="rgba(0,210,140,0.2)" strokeWidth="1"/>
    <text x="74" y="70" textAnchor="middle" fill="rgba(0,210,140,0.48)"
      fontSize="8" fontFamily="'Space Mono',monospace">MONTHLY</text>
    <text x="74" y="87" textAnchor="middle" fill="rgba(0,210,140,0.92)"
      fontSize="14" fontFamily="'Space Mono',monospace" fontWeight="700">$124.8</text>

    <rect x="300" y="50" width="92" height="44" rx="7"
      fill="rgba(11,25,40,0.92)" stroke="rgba(0,168,255,0.2)" strokeWidth="1"/>
    <text x="346" y="68" textAnchor="middle" fill="rgba(0,168,255,0.48)"
      fontSize="8" fontFamily="'Space Mono',monospace">SAVINGS</text>
    <text x="346" y="85" textAnchor="middle" fill="rgba(0,168,255,0.92)"
      fontSize="14" fontFamily="'Space Mono',monospace" fontWeight="700">38.2%</text>

    {/* Bar chart bottom */}
    <rect x="58" y="262" width="304" height="56" rx="8"
      fill="rgba(11,25,40,0.92)" stroke="rgba(0,210,140,0.13)" strokeWidth="1"/>
    {[18,26,16,32,22,36,24,40].map((h,i) => (
      <rect key={i} x={72+i*34} y={306-h} width="16" height={h} rx="2.5"
        fill={i===7 ? "rgba(0,210,140,0.72)" : i===5 ? "rgba(0,168,255,0.4)" : "rgba(0,210,140,0.2)"}/>
    ))}
    <text x="210" y="328" textAnchor="middle" fill="rgba(0,210,140,0.3)"
      fontSize="8" fontFamily="'Space Mono',monospace">
      COST TREND — LAST 8 MONTHS
    </text>

    {/* Orbiting dot */}
    <circle cx="210" cy="73" r="5" fill="rgba(0,210,140,0.65)"
      style={{animation:"cc-orbit 7s linear infinite", transformOrigin:"210px 165px"}}/>
  </svg>
);

/* ── Password Strength ── */
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

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName:"", lastName:"", email:"",
    company:"", password:"", confirm:"",
  });
  const [showPw,      setShowPw]      = useState(false);
  const [showCfm,     setShowCfm]     = useState(false);
  const [agree,       setAgree]       = useState(false);
  const [active,      setActive]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const [done,        setDone]        = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const set  = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const foc  = n => () => setActive(n);
  const blur = ()  => setActive(null);

  const strength  = getStrength(form.password);
  const pwMatch   = form.confirm && form.password === form.confirm;
  const pwBad     = form.confirm && form.password !== form.confirm;

  const canSubmit = agree && !pwBad && form.email && form.password
                    && form.firstName && form.confirm;

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    if (pwBad)  { setError("Passwords do not match."); return; }
 
    setLoading(true);
    // TODO: POST /api/auth/register
    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
  };

  const EyeBtn = ({ show, toggle }) => (
    <span className="cc-input-icon" onClick={toggle} style={{cursor:"pointer"}}>
      {show
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </span>
  );

  return (
    <>
      <style>{GLOBAL_STYLES}{`
        .cc-page {
          min-height: 100vh; display: flex; overflow: hidden; background: var(--bg);
        }

        /* ── LEFT ── */
        .cc-left {
          width: 42%; position: relative;
          display: flex; flex-direction: column;
          justify-content: center; align-items: flex-start;
          padding: 60px 50px; overflow: hidden;
          opacity: 0; transform: translateX(-28px);
          transition: opacity .85s ease, transform .85s ease;
        }
        .cc-left.on { opacity: 1; transform: none; }

        .cc-grid { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
        .cc-blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
        .cc-blob-1 { width: 300px; height: 300px; background: rgba(0,210,140,0.07); top: -70px; left: -80px; }
        .cc-blob-2 { width: 200px; height: 200px; background: rgba(0,168,255,0.05); bottom: 60px; right: 0; }

        .cc-logo {
          display: flex; align-items: center; gap: 13px; margin-bottom: 28px; z-index: 1;
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
          font-size: 33px; font-weight: 800; color: var(--text); line-height: 1.18;
          margin-bottom: 12px; z-index: 1;
          opacity: 0; transform: translateY(10px);
          transition: opacity .6s .4s ease, transform .6s .4s ease;
        }
        .cc-tagline.on { opacity: 1; transform: none; }
        .cc-tagline .hi { color: var(--accent); }

        .cc-sub {
          font-size: 12.5px; color: var(--text-muted); max-width: 295px;
          line-height: 1.8; font-family: 'Space Mono',monospace;
          z-index: 1; margin-bottom: 34px;
          opacity: 0; transition: opacity .6s .54s ease;
        }
        .cc-sub.on { opacity: 1; }

        .cc-illus-wrap {
          z-index: 1; width: 100%;
          opacity: 0; transform: translateY(14px);
          transition: opacity .75s .66s ease, transform .75s .66s ease;
        }
        .cc-illus-wrap.on { opacity: 1; transform: none; }
        .cc-illustration { width: 100%; max-width: 420px; display: block; }

        .cc-features {
          z-index: 1; margin-top: 22px; display: flex; flex-direction: column; gap: 10px;
          opacity: 0; transition: opacity .6s .88s ease;
        }
        .cc-features.on { opacity: 1; }
        .cc-feature {
          display: flex; align-items: center; gap: 10px;
          font-size: 12px; color: var(--text-muted);
          font-family: 'Space Mono',monospace;
        }
        .cc-feature-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          flex-shrink: 0; box-shadow: 0 0 8px var(--accent);
        }

        /* ── RIGHT ── */
        .cc-right {
          width: 58%; display: flex; align-items: center; justify-content: center;
          padding: 32px 44px; position: relative;
          opacity: 0; transform: translateX(28px);
          transition: opacity .85s .15s ease, transform .85s .15s ease;
        }
        .cc-right.on { opacity: 1; transform: none; }

        .cc-card {
          width: 100%; max-width: 500px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 22px; padding: 42px 40px;
          box-shadow: 0 0 80px rgba(0,0,0,0.55),
                      0 0 140px rgba(0,210,140,0.035),
                      inset 0 1px 0 rgba(255,255,255,0.03);
        }

        /* Step progress */
        .cc-steps {
          display: flex; align-items: center; gap: 8px; margin-bottom: 26px;
        }
        .cc-step-bar {
          flex: 1; height: 3px; border-radius: 2px;
          background: var(--border); transition: background .4s;
        }
        .cc-step-bar.done { background: var(--accent); }
        .cc-step-label {
          font-size: 10px; color: var(--text-muted);
          font-family: 'Space Mono',monospace; white-space: nowrap;
        }

        .cc-card-title { font-size: 26px; font-weight: 800; color: var(--text); margin-bottom: 5px; }
        .cc-card-sub { font-size: 12px; color: var(--text-muted); font-family: 'Space Mono',monospace; margin-bottom: 24px; }

        /* Google btn */
        .cc-google {
          width: 100%; padding: 12px;
          background: var(--surface2); border: 1px solid var(--border); border-radius: 11px;
          display: flex; align-items: center; justify-content: center; gap: 11px;
          cursor: pointer; transition: border-color .22s, background .22s;
          font-family: 'Syne',sans-serif; font-size: 13.5px; font-weight: 600;
          color: var(--text); margin-bottom: 20px;
        }
        .cc-google:hover { border-color: rgba(255,255,255,0.22); background: rgba(255,255,255,0.04); }

        .cc-divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
        }
        .cc-divider::before, .cc-divider::after { content:''; flex:1; height:1px; background:var(--border); }
        .cc-divider span {
          font-size: 10px; color: var(--text-muted);
          font-family: 'Space Mono',monospace;
          text-transform: uppercase; letter-spacing: .08em;
        }

        /* Two-col layout */
        .cc-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .cc-field { margin-bottom: 14px; }
        .cc-label {
          display: block; font-size: 10.5px; font-weight: 700;
          color: var(--text-muted); text-transform: uppercase;
          letter-spacing: .1em; margin-bottom: 7px;
          font-family: 'Space Mono',monospace; transition: color .2s;
        }
        .cc-label.on { color: var(--accent); }

        .cc-input-wrap {
          position: relative; border: 1px solid var(--border);
          border-radius: 11px; background: rgba(0,0,0,0.22);
          transition: border-color .22s, box-shadow .22s; overflow: hidden;
        }
        .cc-input-wrap.on      { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(0,210,140,0.08); }
        .cc-input-wrap.err     { border-color: rgba(255,90,90,0.55)!important; box-shadow: 0 0 0 3px rgba(255,90,90,0.07)!important; }
        .cc-input-wrap.ok-field { border-color: rgba(0,210,140,0.45); }

        .cc-input-line {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transform: scaleX(0); transform-origin: left;
          transition: transform .32s ease;
        }
        .cc-input-wrap.on .cc-input-line { transform: scaleX(1); }

        .cc-input {
          width: 100%; padding: 12px 42px 12px 15px;
          background: transparent; border: none; outline: none;
          font-family: 'Space Mono',monospace; font-size: 12px;
          color: var(--text); caret-color: var(--accent);
        }
        .cc-input::placeholder { color: rgba(200,230,218,0.25); }

        .cc-input-icon {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); display: flex; align-items: center;
          transition: color .2s;
        }
        .cc-input-icon:hover { color: var(--accent); }

        /* Strength */
        .cc-strength { margin-top: 7px; }
        .cc-s-bars { display: flex; gap: 4px; margin-bottom: 4px; }
        .cc-s-bar {
          flex: 1; height: 3px; border-radius: 2px;
          background: rgba(255,255,255,0.07); transition: background .3s;
        }
        .cc-s-label { font-size: 10px; font-family: 'Space Mono',monospace; color: var(--text-muted); }

        .cc-pw-hint { font-size: 10.5px; font-family: 'Space Mono',monospace; margin-top: 6px; }
        .cc-pw-hint.ok  { color: var(--success); }
        .cc-pw-hint.bad { color: var(--error); }

        /* Terms */
        .cc-terms-row {
          display: flex; align-items: flex-start; gap: 10px; margin: 16px 0;
        }
        .cc-checkbox {
          width: 17px; height: 17px; min-width: 17px;
          border: 1.5px solid var(--border); border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color .2s, background .2s;
          margin-top: 1px;
        }
        .cc-checkbox.on { border-color: var(--accent); background: var(--accent-dim); }
        .cc-terms-text {
          font-size: 11px; color: var(--text-muted);
          font-family: 'Space Mono',monospace; line-height: 1.65; cursor: pointer; user-select: none;
        }
        .cc-terms-text a { color: var(--accent); text-decoration: none; }
        .cc-terms-text a:hover { text-decoration: underline; }

        /* Error banner */
        .cc-error {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,90,90,0.08); border: 1px solid rgba(255,90,90,0.25);
          border-radius: 9px; padding: 10px 14px;
          font-size: 12px; color: var(--error);
          font-family: 'Space Mono',monospace; margin-bottom: 14px;
        }

        /* Submit */
        .cc-submit {
          width: 100%; padding: 13px;
          background: var(--accent); border: none; border-radius: 11px;
          font-family: 'Syne',sans-serif; font-size: 14.5px; font-weight: 700;
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
          width: 15px; height: 15px; border: 2px solid rgba(5,14,23,.28);
          border-top-color: #050e17; border-radius: 50%;
          animation: cc-spin .75s linear infinite;
        }
        @keyframes cc-spin { to { transform: rotate(360deg); } }

        .cc-bottom {
          text-align: center; margin-top: 20px;
          font-size: 12.5px; color: var(--text-muted);
          font-family: 'Space Mono',monospace;
        }
        .cc-bottom button {
          color: var(--accent); background: none; border: none;
          cursor: pointer; font-family: inherit; font-size: inherit;
          transition: opacity .2s;
        }
        .cc-bottom button:hover { opacity: .75; text-decoration: underline; }

        /* Success */
        .cc-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; padding: 24px; min-height: 420px;
        }
        .cc-success-ring {
          width: 76px; height: 76px; border-radius: 50%;
          background: var(--accent-dim); border: 2px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 26px; box-shadow: 0 0 44px rgba(0,210,140,0.28);
          animation: cc-pop .5s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes cc-pop { from { transform: scale(.35); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .cc-success-title { font-size: 25px; font-weight: 800; color: var(--text); margin-bottom: 10px; }
        .cc-success-sub {
          font-size: 12px; color: var(--text-muted); line-height: 1.8;
          font-family: 'Space Mono',monospace; margin-bottom: 32px;
        }
        .cc-success-btn {
          padding: 12px 36px;
          background: var(--accent); border: none; border-radius: 11px;
          font-family: 'Syne',sans-serif; font-size: 14px; font-weight: 700;
          color: #050e17; cursor: pointer;
          transition: box-shadow .3s, transform .2s;
        }
        .cc-success-btn:hover { box-shadow: 0 0 28px rgba(0,210,140,0.42); transform: translateY(-1px); }

        /* Orbit animation */
        @keyframes cc-orbit {
          from { transform: rotate(0deg) translateY(-92px) rotate(0deg); }
          to   { transform: rotate(360deg) translateY(-92px) rotate(-360deg); }
        }

        @media (max-width: 860px) {
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
            Join the <span className="hi">FinOps</span><br />revolution.
          </h2>

          <p className={`cc-sub ${mounted ? "on" : ""}`}>
            Connect your AWS account and<br />
            start optimising spend in minutes.
          </p>

          <div className={`cc-illus-wrap ${mounted ? "on" : ""}`}>
            <SignupIllustration />
          </div>

          <ul className={`cc-features ${mounted ? "on" : ""}`}>
            {[
              "Real-time EC2 & Lambda cost tracking",
              "CloudWatch metrics at a glance",
              "Automated savings recommendations",
            ].map((f,i) => (
              <li key={i} className="cc-feature">
                <div className="cc-feature-dot" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT ── */}
        <div className={`cc-right ${mounted ? "on" : ""}`}>
          <div className="cc-card">

            {done ? (
              /* ── SUCCESS ── */
              <div className="cc-success">
                <div className="cc-success-ring">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
                    stroke="#00d28c" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                </div>
                <h2 className="cc-success-title">Account created!</h2>
                <p className="cc-success-sub">
                  Welcome to CloudCost Tracker.<br/>
                  Verify your email, then connect<br/>
                  your AWS account to get started.
                </p>
                <button className="cc-success-btn"
                  onClick={() => navigate("/login")}>
                  Go to Sign In →
                </button>
              </div>
            ) : (
              /* ── FORM ── */
              <>
                {/* Step bar */}
                <div className="cc-steps">
                  {[1,2,3].map(i => (
                    <div key={i} className={`cc-step-bar ${i <= 2 ? "done" : ""}`} />
                  ))}
                  <span className="cc-step-label">Step 1 of 3</span>
                </div>

                <h1 className="cc-card-title">Create account</h1>
                <p className="cc-card-sub">// set up your FinOps workspace</p>

                {/* Google */}
                <button className="cc-google" type="button">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </button>

                <div className="cc-divider"><span>or fill in details</span></div>

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

                <form onSubmit={handleSubmit}>
                  {/* Name row */}
                  <div className="cc-two-col">
                    {[["firstName","First Name",""],["lastName","Last Name",""]].map(([k,l,p]) => (
                      <div key={k} className="cc-field">
                        <label className={`cc-label ${active===k ? "on" : ""}`}>{l}</label>
                        <div className={`cc-input-wrap ${active===k ? "on" : ""}`}>
                          <input className="cc-input" type="text" placeholder={p}
                            value={form[k]} onChange={set(k)}
                            onFocus={foc(k)} onBlur={blur}/>
                          <div className="cc-input-line"/>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Email */}
                  <div className="cc-field">
                    <label className={`cc-label ${active==="email" ? "on" : ""}`}>Work Email</label>
                    <div className={`cc-input-wrap ${active==="email" ? "on" : ""}`}>
                      <input className="cc-input" type="email" placeholder="you@company.com"
                        value={form.email} onChange={set("email")}
                        onFocus={foc("email")} onBlur={blur}/>
                      <span className="cc-input-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </span>
                      <div className="cc-input-line"/>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="cc-field">
                    <label className={`cc-label ${active==="company" ? "on" : ""}`}>Company / Organisation</label>
                    <div className={`cc-input-wrap ${active==="company" ? "on" : ""}`}>
                      <input className="cc-input" type="text" placeholder="Acme Corp"
                        value={form.company} onChange={set("company")}
                        onFocus={foc("company")} onBlur={blur}/>
                      <span className="cc-input-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="2" y="7" width="20" height="14" rx="2"/>
                          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                        </svg>
                      </span>
                      <div className="cc-input-line"/>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="cc-field">
                    <label className={`cc-label ${active==="pw" ? "on" : ""}`}>Password</label>
                    <div className={`cc-input-wrap ${active==="pw" ? "on" : ""}`}>
                      <input className="cc-input" type={showPw ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={form.password} onChange={set("password")}
                        onFocus={foc("pw")} onBlur={blur}/>
                      <EyeBtn show={showPw} toggle={() => setShowPw(p => !p)}/>
                      <div className="cc-input-line"/>
                    </div>
                    {form.password && (
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

                  {/* Confirm */}
                  <div className="cc-field">
                    <label className={`cc-label ${active==="cfm" ? "on" : ""}`}>Confirm Password</label>
                    <div className={`cc-input-wrap ${active==="cfm" ? "on" : ""} ${pwBad ? "err" : ""} ${pwMatch ? "ok-field" : ""}`}>
                      <input className="cc-input" type={showCfm ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={form.confirm} onChange={set("confirm")}
                        onFocus={foc("cfm")} onBlur={blur}/>
                      <EyeBtn show={showCfm} toggle={() => setShowCfm(p => !p)}/>
                      <div className="cc-input-line"/>
                    </div>
                    {pwBad   && <p className="cc-pw-hint bad">✗ Passwords do not match</p>}
                    {pwMatch && <p className="cc-pw-hint ok">✓ Passwords match</p>}
                  </div>

                 

                  <button className="cc-submit" type="submit" disabled={loading || !canSubmit}>
                    <div className="cc-shimmer"/>
                    {loading
                      ? <><div className="cc-spinner"/> Creating account...</>
                      : <>Create Account <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></>
                    }
                  </button>
                </form>

                <div className="cc-bottom">
                  Already have an account?{" "}
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
