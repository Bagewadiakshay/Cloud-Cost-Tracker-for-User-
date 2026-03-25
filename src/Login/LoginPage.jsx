import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ── Shared CSS Variables & Base Styles ── */
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

/* ── Background Grid SVG ── */
const GridLines = () => (
  <svg className="cc-grid" viewBox="0 0 900 650"
    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    {[...Array(14)].map((_, i) => (
      <line key={`v${i}`} x1={i * 68} y1="0" x2={i * 68} y2="650"
        stroke="rgba(0,210,140,0.045)" strokeWidth="1" />
    ))}
    {[...Array(11)].map((_, i) => (
      <line key={`h${i}`} x1="0" y1={i * 65} x2="900" y2={i * 65}
        stroke="rgba(0,210,140,0.045)" strokeWidth="1" />
    ))}
    <circle cx="420" cy="325" r="200" fill="none"
      stroke="rgba(0,210,140,0.04)" strokeWidth="1" />
    <circle cx="420" cy="325" r="320" fill="none"
      stroke="rgba(0,210,140,0.025)" strokeWidth="1" />
    <circle cx="420" cy="325" r="440" fill="none"
      stroke="rgba(0,210,140,0.015)" strokeWidth="1" />
  </svg>
);

/* ── Left Panel Illustration ── */
const CloudIllustration = () => (
  <svg viewBox="0 0 440 360" fill="none"
    xmlns="http://www.w3.org/2000/svg" className="cc-illustration">

    {/* ambient glow */}
    <ellipse cx="220" cy="210" rx="170" ry="110"
      fill="rgba(0,210,140,0.06)" />
    <ellipse cx="220" cy="160" rx="110" ry="70"
      fill="rgba(0,168,255,0.04)" />

    {/* server rack base */}
    <rect x="120" y="210" width="180" height="115" rx="9"
      fill="rgba(11,25,40,0.95)" stroke="rgba(0,210,140,0.28)" strokeWidth="1.5" />

    {/* server rows */}
    {[0,1,2,3].map(i => (
      <g key={i}>
        <rect x="133" y={223 + i * 24} width="154" height="16" rx="3"
          fill="rgba(0,210,140,0.06)" stroke="rgba(0,210,140,0.18)" strokeWidth="1" />
        <circle cx="272" cy={231 + i * 24} r="3.5"
          fill={i === 0 ? "#00d28c" : i === 2 ? "#00a8ff" : "rgba(0,210,140,0.25)"} />
        <circle cx="260" cy={231 + i * 24} r="3.5"
          fill={i === 1 ? "#00d28c" : "rgba(0,210,140,0.18)"} />
        <rect x="144" y={227 + i * 24} width="72" height="2.5" rx="1.5"
          fill="rgba(0,210,140,0.15)" />
        <rect x="144" y={232 + i * 24} width="48" height="2" rx="1"
          fill="rgba(0,210,140,0.09)" />
      </g>
    ))}

    {/* main cloud body */}
    <ellipse cx="220" cy="140" rx="118" ry="58"
      fill="rgba(11,25,40,0.92)" stroke="rgba(0,210,140,0.38)" strokeWidth="1.5" />
    <ellipse cx="162" cy="124" rx="58" ry="42"
      fill="rgba(11,25,40,0.92)" stroke="rgba(0,210,140,0.28)" strokeWidth="1.5" />
    <ellipse cx="276" cy="129" rx="54" ry="40"
      fill="rgba(11,25,40,0.92)" stroke="rgba(0,210,140,0.28)" strokeWidth="1.5" />

    {/* cloud inner nodes */}
    {[[196,128],[220,118],[244,128],[220,144]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="5.5"
        fill={i===1 ? "rgba(0,210,140,0.85)" : "rgba(0,210,140,0.45)"} />
    ))}
    <line x1="196" y1="128" x2="220" y2="118"
      stroke="rgba(0,210,140,0.45)" strokeWidth="1.2" />
    <line x1="220" y1="118" x2="244" y2="128"
      stroke="rgba(0,210,140,0.45)" strokeWidth="1.2" />
    <line x1="196" y1="128" x2="244" y2="128"
      stroke="rgba(0,210,140,0.25)" strokeWidth="1" />
    <line x1="220" y1="128" x2="220" y2="144"
      stroke="rgba(0,210,140,0.45)" strokeWidth="1.2" />

    {/* connect lines cloud → rack */}
    {[185, 220, 255].map((x, i) => (
      <line key={i} x1={x} y1={198 + (i===1?0:4)} x2={x} y2="210"
        stroke={i===1 ? "rgba(0,210,140,0.55)" : "rgba(0,210,140,0.25)"}
        strokeWidth={i===1 ? "1.5" : "1"}
        strokeDasharray="4 3" />
    ))}

    {/* AWS badge */}
    <rect x="160" y="68" width="120" height="32" rx="7"
      fill="rgba(0,210,140,0.1)" stroke="rgba(0,210,140,0.32)" strokeWidth="1" />
    <text x="220" y="89" textAnchor="middle"
      fill="rgba(0,210,140,0.92)" fontSize="12"
      fontFamily="'Space Mono',monospace" fontWeight="700">☁ AWS CLOUD</text>

    {/* floating badges */}
    <rect x="44" y="155" width="76" height="26" rx="6"
      fill="rgba(11,25,40,0.9)" stroke="rgba(0,210,140,0.22)" strokeWidth="1" />
    <text x="82" y="172" textAnchor="middle"
      fill="rgba(0,210,140,0.75)" fontSize="10"
      fontFamily="'Space Mono',monospace">$0.042/hr</text>

    <rect x="318" y="152" width="76" height="26" rx="6"
      fill="rgba(11,25,40,0.9)" stroke="rgba(0,168,255,0.22)" strokeWidth="1" />
    <text x="356" y="169" textAnchor="middle"
      fill="rgba(0,168,255,0.75)" fontSize="10"
      fontFamily="'Space Mono',monospace">LAMBDA</text>

    {/* pulse at rack bottom */}
    <circle cx="220" cy="265" r="18" fill="rgba(0,210,140,0.07)"
      style={{animation:"cc-pulse 2.8s ease-in-out infinite"}} />
    <circle cx="220" cy="265" r="7" fill="rgba(0,210,140,0.38)" />

    {/* mini bar chart */}
    <g transform="translate(60,290)">
      <rect width="160" height="46" rx="7"
        fill="rgba(11,25,40,0.9)" stroke="rgba(0,210,140,0.12)" strokeWidth="1" />
      {[16,24,18,30,22,34,26,38].map((h,i) => (
        <rect key={i} x={10+i*18} y={38-h} width="10" height={h} rx="2"
          fill={i===7 ? "rgba(0,210,140,0.7)" : "rgba(0,210,140,0.2)"} />
      ))}
    </g>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [remember, setRemember]   = useState(false);
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [active, setActive]       = useState(null);
  const [mounted, setMounted]     = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    // TODO: POST /api/auth/login
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard"); // replace with your dashboard route
    }, 2000);
  };

  return (
    <>
      <style>{GLOBAL_STYLES}{`
        .cc-page {
          min-height: 100vh; display: flex; overflow: hidden;
          background: var(--bg);
        }

        /* ── LEFT ── */
        .cc-left {
          width: 46%; position: relative;
          display: flex; flex-direction: column;
          justify-content: center; align-items: flex-start;
          padding: 64px 56px; overflow: hidden;
          opacity: 0; transform: translateX(-28px);
          transition: opacity .85s ease, transform .85s ease;
        }
        .cc-left.on { opacity: 1; transform: none; }

        .cc-grid {
          position: absolute; inset: 0;
          width: 100%; height: 100%; pointer-events: none;
        }
        .cc-blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none;
        }
        .cc-blob-1 { width: 340px; height: 340px; background: rgba(0,210,140,0.07); top: -90px; left: -80px; }
        .cc-blob-2 { width: 220px; height: 220px; background: rgba(0,168,255,0.05); bottom: 50px; right: -30px; }

        .cc-logo {
          display: flex; align-items: center; gap: 13px;
          margin-bottom: 34px; z-index: 1;
          opacity: 0; transform: translateY(10px);
          transition: opacity .6s .28s ease, transform .6s .28s ease;
        }
        .cc-logo.on { opacity: 1; transform: none; }
        .cc-logo-icon {
          width: 46px; height: 46px;
          background: var(--accent-dim); border: 1.5px solid var(--accent);
          border-radius: 11px; display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono',monospace; font-size: 16px; font-weight: 700;
          color: var(--accent); box-shadow: 0 0 22px rgba(0,210,140,0.22);
        }
        .cc-logo-text {
          font-family: 'Space Mono',monospace; font-size: 12.5px; font-weight: 700;
          color: var(--text); letter-spacing: .05em; line-height: 1.35;
        }
        .cc-logo-text em { color: var(--accent); font-style: normal; }

        .cc-tagline {
          font-size: 38px; font-weight: 800; color: var(--text);
          line-height: 1.15; margin-bottom: 14px; z-index: 1;
          opacity: 0; transform: translateY(10px);
          transition: opacity .6s .42s ease, transform .6s .42s ease;
        }
        .cc-tagline.on { opacity: 1; transform: none; }
        .cc-tagline .hi { color: var(--accent); }

        .cc-sub {
          font-size: 13px; color: var(--text-muted); max-width: 310px;
          line-height: 1.8; font-family: 'Space Mono',monospace;
          z-index: 1; margin-bottom: 38px;
          opacity: 0; transition: opacity .6s .56s ease;
        }
        .cc-sub.on { opacity: 1; }

        .cc-illus-wrap {
          z-index: 1; width: 100%;
          opacity: 0; transform: translateY(14px);
          transition: opacity .75s .68s ease, transform .75s .68s ease;
        }
        .cc-illus-wrap.on { opacity: 1; transform: none; }
        .cc-illustration { width: 100%; max-width: 440px; display: block; }

        .cc-stats {
          display: flex; gap: 0; z-index: 1; margin-top: 22px;
          border: 1px solid var(--border); border-radius: 12px;
          overflow: hidden;
          opacity: 0; transition: opacity .6s .9s ease;
        }
        .cc-stats.on { opacity: 1; }
        .cc-stat {
          display: flex; flex-direction: column;
          padding: 12px 20px; background: var(--surface2);
          flex: 1; text-align: center;
        }
        .cc-stat + .cc-stat { border-left: 1px solid var(--border); }
        .cc-stat-val {
          font-family: 'Space Mono',monospace; font-size: 19px;
          font-weight: 700; color: var(--accent);
        }
        .cc-stat-lbl {
          font-size: 9.5px; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: .08em; margin-top: 3px;
        }

        /* ── RIGHT ── */
        .cc-right {
          width: 54%; display: flex; align-items: center;
          justify-content: center; padding: 40px 44px;
          position: relative;
          opacity: 0; transform: translateX(28px);
          transition: opacity .85s .15s ease, transform .85s .15s ease;
        }
        .cc-right.on { opacity: 1; transform: none; }

        .cc-card {
          width: 100%; max-width: 460px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 22px; padding: 46px 42px;
          box-shadow: 0 0 80px rgba(0,0,0,0.55),
                      0 0 140px rgba(0,210,140,0.035),
                      inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .cc-card-head { margin-bottom: 28px; }
        .cc-card-title {
          font-size: 27px; font-weight: 800; color: var(--text);
          margin-bottom: 5px;
        }
        .cc-card-sub {
          font-size: 12px; color: var(--text-muted);
          font-family: 'Space Mono',monospace;
        }

        /* Google btn */
        .cc-google {
          width: 100%; padding: 13px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center; gap: 11px;
          cursor: pointer; transition: border-color .22s, background .22s, box-shadow .22s;
          font-family: 'Syne',sans-serif; font-size: 14px; font-weight: 600;
          color: var(--text); margin-bottom: 22px;
        }
        .cc-google:hover {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.04);
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
        }

        /* divider */
        .cc-divider {
          display: flex; align-items: center; gap: 13px; margin-bottom: 22px;
        }
        .cc-divider::before, .cc-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }
        .cc-divider span {
          font-size: 10.5px; color: var(--text-muted);
          font-family: 'Space Mono',monospace;
          text-transform: uppercase; letter-spacing: .08em;
        }

        /* fields */
        .cc-field { margin-bottom: 16px; }
        .cc-label {
          display: block; font-size: 10.5px; font-weight: 700;
          color: var(--text-muted); text-transform: uppercase;
          letter-spacing: .1em; margin-bottom: 8px;
          font-family: 'Space Mono',monospace;
          transition: color .2s;
        }
        .cc-label.on { color: var(--accent); }

        .cc-input-wrap {
          position: relative; border: 1px solid var(--border);
          border-radius: 11px; background: rgba(0,0,0,0.22);
          transition: border-color .22s, box-shadow .22s; overflow: hidden;
        }
        .cc-input-wrap.on {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(0,210,140,0.08);
        }
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
        .cc-input::placeholder { color: rgba(200,230,218,0.26); }

        .cc-input-icon {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); display: flex; align-items: center;
          cursor: pointer; transition: color .2s;
        }
        .cc-input-icon:hover { color: var(--accent); }

        /* row */
        .cc-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 26px;
        }
        .cc-check-label {
          display: flex; align-items: center; gap: 9px;
          cursor: pointer; font-size: 12px; color: var(--text-muted);
          font-family: 'Space Mono',monospace; user-select: none;
        }
        .cc-checkbox {
          width: 17px; height: 17px; flex-shrink: 0;
          border: 1.5px solid var(--border); border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          transition: border-color .2s, background .2s;
        }
        .cc-checkbox.on {
          border-color: var(--accent); background: var(--accent-dim);
        }
        .cc-forgot {
          font-size: 12px; color: var(--accent);
          font-family: 'Space Mono',monospace;
          background: none; border: none; cursor: pointer;
          opacity: .8; transition: opacity .2s;
          text-decoration: none;
        }
        .cc-forgot:hover { opacity: 1; text-decoration: underline; }

        /* error */
        .cc-error {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,90,90,0.08); border: 1px solid rgba(255,90,90,0.25);
          border-radius: 9px; padding: 10px 14px;
          font-size: 12px; color: var(--error);
          font-family: 'Space Mono',monospace;
          margin-bottom: 16px;
        }

        /* submit */
        .cc-submit {
          width: 100%; padding: 14px;
          background: var(--accent); border: none; border-radius: 11px;
          font-family: 'Syne',sans-serif; font-size: 15px; font-weight: 700;
          color: #050e17; cursor: pointer;
          position: relative; overflow: hidden;
          transition: box-shadow .3s, transform .2s;
          display: flex; align-items: center; justify-content: center; gap: 9px;
        }
        .cc-submit:hover:not(:disabled) {
          box-shadow: 0 0 34px rgba(0,210,140,0.42);
          transform: translateY(-1px);
        }
        .cc-submit:active:not(:disabled) { transform: none; }
        .cc-submit:disabled { opacity: .55; cursor: not-allowed; }
        .cc-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.22) 50%,transparent 60%);
          transform: translateX(-100%); animation: cc-shimmer 2.8s infinite;
        }
        @keyframes cc-shimmer { to { transform: translateX(210%); } }

        .cc-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(5,14,23,.28);
          border-top-color: #050e17;
          border-radius: 50%; animation: cc-spin .75s linear infinite;
        }
        @keyframes cc-spin { to { transform: rotate(360deg); } }

        /* bottom link */
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

        /* pulse */
        @keyframes cc-pulse {
          0%,100% { r: 18; opacity: .07; }
          50%      { r: 28; opacity: .03; }
        }

        /* responsive */
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
            <div className="cc-logo-text">
              CLOUD<em>COST</em><br />TRACKER
            </div>
          </div>

          <h2 className={`cc-tagline ${mounted ? "on" : ""}`}>
            Control your<br /><span className="hi">AWS spend</span><br />intelligently.
          </h2>

          <p className={`cc-sub ${mounted ? "on" : ""}`}>
            Real-time FinOps visibility across<br />
            EC2, Lambda, S3 & CloudWatch.
          </p>

          <div className={`cc-illus-wrap ${mounted ? "on" : ""}`}>
            <CloudIllustration />
          </div>

          <div className={`cc-stats ${mounted ? "on" : ""}`}>
            {[["$0","Wasted"],["99.9%","Uptime"],["~38%","Savings"]].map(([v,l]) => (
              <div key={l} className="cc-stat">
                <span className="cc-stat-val">{v}</span>
                <span className="cc-stat-lbl">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className={`cc-right ${mounted ? "on" : ""}`}>
          <div className="cc-card">
            <div className="cc-card-head">
              <h1 className="cc-card-title">Welcome back</h1>
              <p className="cc-card-sub">// sign in to your dashboard</p>
            </div>

            {/* Google */}
            <button className="cc-google" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="cc-divider"><span>or</span></div>

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
              {/* Email */}
              <div className="cc-field">
                <label className={`cc-label ${active==="email" ? "on" : ""}`}>
                  Email Address
                </label>
                <div className={`cc-input-wrap ${active==="email" ? "on" : ""}`}>
                  <input className="cc-input" type="email"
                    placeholder="you@company.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={() => setActive("email")}
                    onBlur={() => setActive(null)} autoComplete="email" />
                  <span className="cc-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <div className="cc-input-line" />
                </div>
              </div>

              {/* Password */}
              <div className="cc-field">
                <label className={`cc-label ${active==="pw" ? "on" : ""}`}>
                  Password
                </label>
                <div className={`cc-input-wrap ${active==="pw" ? "on" : ""}`}>
                  <input className="cc-input"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onFocus={() => setActive("pw")}
                    onBlur={() => setActive(null)} autoComplete="current-password" />
                  <span className="cc-input-icon" onClick={() => setShowPw(p => !p)}>
                    {showPw
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </span>
                  <div className="cc-input-line" />
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="cc-row">
                <label className="cc-check-label"
                  onClick={() => setRemember(p => !p)}>
                  <div className={`cc-checkbox ${remember ? "on" : ""}`}>
                    {remember && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
                        stroke="#00d28c" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2,6 5,9 10,3"/>
                      </svg>
                    )}
                  </div>
                  Remember me
                </label>
                <button type="button" className="cc-forgot"
                  onClick={() => navigate("/forgot-password")}>
                  Forgot password?
                </button>
              </div>

              <button className="cc-submit" type="submit" disabled={loading}>
                <div className="cc-shimmer" />
                {loading
                  ? <><div className="cc-spinner" /> Authenticating...</>
                  : <>Sign In <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></>
                }
              </button>
            </form>

            <div className="cc-bottom">
              No account?{" "}
              <button onClick={() => navigate("/signup")}>
                Create one free →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
