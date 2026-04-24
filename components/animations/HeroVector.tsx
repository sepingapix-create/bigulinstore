"use client";

export function HeroVector() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Main SVG canvas */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Red glow filter */}
          <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Subtle gradient for lines */}
          <linearGradient id="line-grad-red" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(220,38,38,0)" />
            <stop offset="50%" stopColor="rgba(220,38,38,0.6)" />
            <stop offset="100%" stopColor="rgba(220,38,38,0)" />
          </linearGradient>
          <linearGradient id="line-grad-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(234,179,8,0)" />
            <stop offset="50%" stopColor="rgba(234,179,8,0.4)" />
            <stop offset="100%" stopColor="rgba(234,179,8,0)" />
          </linearGradient>
          <radialGradient id="orb-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(220,38,38,0.3)" />
            <stop offset="100%" stopColor="rgba(220,38,38,0)" />
          </radialGradient>
          <radialGradient id="orb-accent" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(234,179,8,0.15)" />
            <stop offset="100%" stopColor="rgba(234,179,8,0)" />
          </radialGradient>
        </defs>

        {/* === BIG CENTRAL ORB === */}
        <ellipse cx="720" cy="400" rx="420" ry="260" fill="url(#orb-center)">
          <animate attributeName="rx" values="420;460;420" dur="6s" repeatCount="indefinite" />
          <animate attributeName="ry" values="260;290;260" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="6s" repeatCount="indefinite" />
        </ellipse>

        {/* === ACCENT ORB (gold, offset) === */}
        <ellipse cx="800" cy="380" rx="280" ry="180" fill="url(#orb-accent)">
          <animate attributeName="cx" values="800;750;800" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="8s" repeatCount="indefinite" />
        </ellipse>

        {/* === HORIZONTAL SCAN LINES === */}
        <rect x="0" y="398" width="1440" height="1" fill="url(#line-grad-red)" opacity="0.8">
          <animate attributeName="y" values="398;402;398" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="4s" repeatCount="indefinite" />
        </rect>
        <rect x="0" y="360" width="1440" height="1" fill="url(#line-grad-gold)" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="5s" repeatCount="indefinite" />
        </rect>
        <rect x="0" y="440" width="1440" height="1" fill="url(#line-grad-gold)" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="5s" begin="1s" repeatCount="indefinite" />
        </rect>

        {/* === CORNER ORNAMENTS (top-left) === */}
        <g opacity="0.35" filter="url(#glow-red)">
          <line x1="40" y1="40" x2="160" y2="40" stroke="#dc2626" strokeWidth="1" />
          <line x1="40" y1="40" x2="40" y2="160" stroke="#dc2626" strokeWidth="1" />
          <line x1="60" y1="40" x2="60" y2="80" stroke="#dc2626" strokeWidth="0.5" />
          <line x1="40" y1="60" x2="80" y2="60" stroke="#dc2626" strokeWidth="0.5" />
          <rect x="44" y="44" width="8" height="8" fill="none" stroke="#dc2626" strokeWidth="0.5">
            <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* === CORNER ORNAMENTS (top-right) === */}
        <g opacity="0.35" filter="url(#glow-red)">
          <line x1="1400" y1="40" x2="1280" y2="40" stroke="#dc2626" strokeWidth="1" />
          <line x1="1400" y1="40" x2="1400" y2="160" stroke="#dc2626" strokeWidth="1" />
          <line x1="1380" y1="40" x2="1380" y2="80" stroke="#dc2626" strokeWidth="0.5" />
          <line x1="1400" y1="60" x2="1360" y2="60" stroke="#dc2626" strokeWidth="0.5" />
          <rect x="1388" y="44" width="8" height="8" fill="none" stroke="#dc2626" strokeWidth="0.5">
            <animate attributeName="opacity" values="1;0.2;1" dur="3s" begin="1.5s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* === CORNER ORNAMENTS (bottom-left) === */}
        <g opacity="0.25" filter="url(#glow-gold)">
          <line x1="40" y1="760" x2="160" y2="760" stroke="#eab308" strokeWidth="1" />
          <line x1="40" y1="760" x2="40" y2="640" stroke="#eab308" strokeWidth="1" />
        </g>

        {/* === CORNER ORNAMENTS (bottom-right) === */}
        <g opacity="0.25" filter="url(#glow-gold)">
          <line x1="1400" y1="760" x2="1280" y2="760" stroke="#eab308" strokeWidth="1" />
          <line x1="1400" y1="760" x2="1400" y2="640" stroke="#eab308" strokeWidth="1" />
        </g>

        {/* === DIAGONAL GEOMETRIC LINES === */}
        <g opacity="0.12">
          <line x1="0" y1="200" x2="400" y2="0" stroke="#dc2626" strokeWidth="1" />
          <line x1="1440" y1="200" x2="1040" y2="0" stroke="#dc2626" strokeWidth="1" />
          <line x1="0" y1="600" x2="400" y2="800" stroke="#dc2626" strokeWidth="1" />
          <line x1="1440" y1="600" x2="1040" y2="800" stroke="#dc2626" strokeWidth="1" />
        </g>

        {/* === FLOATING PARTICLES === */}
        {/* Particle 1 */}
        <circle cx="200" cy="150" r="2" fill="#dc2626" filter="url(#glow-red)">
          <animate attributeName="cy" values="150;120;150" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="5s" repeatCount="indefinite" />
        </circle>

        {/* Particle 2 */}
        <circle cx="1240" cy="180" r="1.5" fill="#eab308" filter="url(#glow-gold)">
          <animate attributeName="cy" values="180;140;180" dur="7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="7s" repeatCount="indefinite" />
        </circle>

        {/* Particle 3 */}
        <circle cx="120" cy="500" r="2.5" fill="#dc2626" filter="url(#glow-red)">
          <animate attributeName="cy" values="500;470;500" dur="6s" begin="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.1;0.7" dur="6s" begin="2s" repeatCount="indefinite" />
        </circle>

        {/* Particle 4 */}
        <circle cx="1320" cy="520" r="2" fill="#dc2626" filter="url(#glow-red)">
          <animate attributeName="cy" values="520;490;520" dur="8s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="8s" begin="1s" repeatCount="indefinite" />
        </circle>

        {/* Particle 5 (gold) */}
        <circle cx="680" cy="80" r="3" fill="#eab308" filter="url(#glow-gold)">
          <animate attributeName="cy" values="80;55;80" dur="6s" begin="0.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="6s" begin="0.5s" repeatCount="indefinite" />
        </circle>

        {/* Particle 6 */}
        <circle cx="760" cy="720" r="2" fill="#dc2626" filter="url(#glow-red)">
          <animate attributeName="cy" values="720;700;720" dur="9s" begin="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="9s" begin="3s" repeatCount="indefinite" />
        </circle>

        {/* Particle 7 */}
        <circle cx="400" cy="650" r="1.5" fill="#eab308">
          <animate attributeName="cy" values="650;620;650" dur="7s" begin="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.05;0.4" dur="7s" begin="1.5s" repeatCount="indefinite" />
        </circle>

        {/* Particle 8 */}
        <circle cx="1060" cy="640" r="2" fill="#eab308">
          <animate attributeName="cy" values="640;615;640" dur="8s" begin="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="8s" begin="4s" repeatCount="indefinite" />
        </circle>

        {/* === PULSING RINGS around center === */}
        <circle cx="720" cy="400" r="180" fill="none" stroke="#dc2626" strokeWidth="0.5" opacity="0">
          <animate attributeName="r" values="180;320" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="720" cy="400" r="180" fill="none" stroke="#dc2626" strokeWidth="0.5" opacity="0">
          <animate attributeName="r" values="180;320" dur="4s" begin="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0" dur="4s" begin="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="720" cy="400" r="60" fill="none" stroke="#eab308" strokeWidth="0.5" opacity="0">
          <animate attributeName="r" values="60;200" dur="5s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0" dur="5s" begin="1s" repeatCount="indefinite" />
        </circle>

        {/* === SMALL DIAMOND ACCENTS === */}
        <g filter="url(#glow-red)">
          <polygon points="720,30 728,42 720,54 712,42" fill="none" stroke="#dc2626" strokeWidth="1" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite" />
          </polygon>
        </g>
        <g filter="url(#glow-gold)" opacity="0.4">
          <polygon points="720,746 726,755 720,764 714,755" fill="none" stroke="#eab308" strokeWidth="1">
            <animate attributeName="opacity" values="0.4;0.05;0.4" dur="4s" begin="2s" repeatCount="indefinite" />
          </polygon>
        </g>
      </svg>
    </div>
  );
}
