import React from "react";

interface RobotMascotProps {
  className?: string;
  variant?: "hero" | "support" | "not-found";
  size?: number;
}

export default function RobotMascot({
  className = "",
  variant = "hero",
  size = 280,
}: RobotMascotProps) {
  if (variant === "not-found") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Soft background ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 via-teal-400/20 to-orange-500/10 rounded-full blur-3xl" />
        
        <svg
          width={size}
          height={size * 0.95}
          viewBox="0 0 320 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-2xl"
        >
          <defs>
            {/* Robot body gradients */}
            <linearGradient id="nf-head-grad" x1="60" y1="30" x2="260" y2="190" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.6" stopColor="#F1F5F9" />
              <stop offset="1" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="nf-visor-grad" x1="90" y1="80" x2="230" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B191E" />
              <stop offset="1" stopColor="#132B33" />
            </linearGradient>
            <linearGradient id="nf-ear-grad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#64748B" />
              <stop offset="1" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="nf-cable-grad" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#FF5A36" />
              <stop offset="0.5" stopColor="#FF8B66" />
              <stop offset="1" stopColor="#FF5A36" />
            </linearGradient>
            <filter id="nf-spark-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Antenna */}
          <path d="M160 45 L160 18" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="160" cy="14" r="7" fill="#FF5A36" className="animate-pulse" />
          <circle cx="160" cy="14" r="11" stroke="#FF5A36" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

          {/* Ears / Side audio domes */}
          <rect x="66" y="90" width="14" height="42" rx="7" fill="url(#nf-ear-grad)" />
          <rect x="240" y="90" width="14" height="42" rx="7" fill="url(#nf-ear-grad)" />
          <circle cx="73" cy="111" r="3" fill="#38BDF8" opacity="0.8" />
          <circle cx="247" cy="111" r="3" fill="#38BDF8" opacity="0.8" />

          {/* Head Outer Shell */}
          <rect
            x="76"
            y="42"
            width="168"
            height="136"
            rx="48"
            fill="url(#nf-head-grad)"
            stroke="#CBD5E1"
            strokeWidth="3"
          />

          {/* Screen Visor */}
          <rect
            x="96"
            y="66"
            width="128"
            height="86"
            rx="28"
            fill="url(#nf-visor-grad)"
            stroke="#1E293B"
            strokeWidth="2"
          />

          {/* Cute 404 Disoriented Digital Eyes */}
          {/* Left Eye: > or X */}
          <path d="M125 101 L141 113 L125 125" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right Eye: < or X */}
          <path d="M195 101 L179 113 L195 125" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Shy wavy mouth */}
          <path d="M152 132 Q160 128 168 132" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />

          {/* Neck piece */}
          <rect x="144" y="178" width="32" height="12" rx="4" fill="#64748B" />

          {/* Torso */}
          <path
            d="M110 190 C110 186 210 186 210 190 L224 250 C224 266 210 274 195 274 L125 274 C110 274 96 266 96 250 Z"
            fill="url(#nf-head-grad)"
            stroke="#CBD5E1"
            strokeWidth="3"
          />

          {/* Chest badge */}
          <rect x="140" y="210" width="40" height="24" rx="8" fill="#0B191E" />
          <path d="M154 222 L160 216 L166 222 L160 228 Z" fill="#FF5A36" />

          {/* Left Arm holding left cable plug */}
          <path d="M102 208 Q60 225 75 258" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" fill="none" />
          {/* Left Hand Plug */}
          <rect x="68" y="250" width="18" height="20" rx="4" fill="#1E293B" />
          <rect x="86" y="254" width="8" height="4" rx="1" fill="#94A3B8" />
          <rect x="86" y="262" width="8" height="4" rx="1" fill="#94A3B8" />

          {/* Right Arm holding right cable socket */}
          <path d="M218 208 Q260 225 245 258" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" fill="none" />
          {/* Right Hand Socket */}
          <rect x="234" y="250" width="18" height="20" rx="4" fill="#1E293B" />
          <rect x="226" y="254" width="8" height="4" rx="1" fill="#475569" />
          <rect x="226" y="262" width="8" height="4" rx="1" fill="#475569" />

          {/* Disconnected sparks between plugs */}
          <g filter="url(#nf-spark-glow)">
            <line x1="96" y1="260" x2="224" y2="260" stroke="#FF5A36" strokeWidth="2.5" strokeDasharray="6 8" className="animate-pulse" />
            {/* Spark burst stars */}
            <circle cx="160" cy="260" r="4" fill="#FFB703" />
            <path d="M160 252 L160 268 M152 260 L168 260" stroke="#FF5A36" strokeWidth="2" strokeLinecap="round" />
            <circle cx="135" cy="256" r="2.5" fill="#38BDF8" />
            <circle cx="185" cy="264" r="2.5" fill="#38BDF8" />
          </g>
        </svg>
      </div>
    );
  }

  // Hero Mascot
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Dynamic ambient rings */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-teal-200/40 via-cyan-100/30 to-orange-100/40 blur-2xl -z-10" />
      <div className="absolute w-[310px] h-[310px] rounded-full border border-teal-200/50 -z-10 animate-spin" style={{ animationDuration: "35s" }}>
        <div className="w-3 h-3 bg-teal-400 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-md shadow-teal-300" />
      </div>
      <div className="absolute w-[240px] h-[240px] rounded-full border border-orange-200/60 -z-10" />

      <svg
        width={size}
        height={size * 0.95}
        viewBox="0 0 320 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative drop-shadow-xl animate-float"
      >
        <defs>
          <linearGradient id="hero-head-grad" x1="60" y1="30" x2="260" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.65" stopColor="#F8FAFC" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="hero-visor-grad" x1="90" y1="80" x2="230" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A1E24" />
            <stop offset="1" stopColor="#133640" />
          </linearGradient>
          <linearGradient id="hero-glow-teal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#2DD4BF" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="eye-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Antenna */}
        <path d="M160 46 L160 20" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="160" cy="16" r="7" fill="#FF5A36" className="animate-pulse" />
        <circle cx="160" cy="16" r="13" stroke="#FF5A36" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

        {/* Side Headphone Domes */}
        <rect x="66" y="92" width="14" height="42" rx="7" fill="#475569" />
        <circle cx="73" cy="113" r="3.5" fill="#2DD4BF" />
        <rect x="240" y="92" width="14" height="42" rx="7" fill="#475569" />
        <circle cx="247" cy="113" r="3.5" fill="#2DD4BF" />

        {/* Head Shell */}
        <rect
          x="76"
          y="44"
          width="168"
          height="138"
          rx="48"
          fill="url(#hero-head-grad)"
          stroke="#CBD5E1"
          strokeWidth="3"
        />

        {/* Screen Visor */}
        <rect
          x="96"
          y="68"
          width="128"
          height="88"
          rx="28"
          fill="url(#hero-visor-grad)"
          stroke="#1E293B"
          strokeWidth="2"
        />

        {/* Friendly AI Eyes */}
        <g filter="url(#eye-glow)">
          {/* Left Eye */}
          <ellipse cx="132" cy="108" rx="14" ry="18" fill="url(#hero-glow-teal)" />
          <circle cx="136" cy="103" r="4.5" fill="#FFFFFF" />
          {/* Right Eye */}
          <ellipse cx="188" cy="108" rx="14" ry="18" fill="url(#hero-glow-teal)" />
          <circle cx="192" cy="103" r="4.5" fill="#FFFFFF" />
          {/* Subtle Smile */}
          <path d="M152 134 Q160 142 168 134" stroke="#2DD4BF" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        {/* Neck */}
        <rect x="144" y="180" width="32" height="12" rx="4" fill="#64748B" />

        {/* Torso */}
        <path
          d="M108 192 C108 188 212 188 212 192 L226 250 C226 266 212 274 196 274 L124 274 C108 274 94 266 94 250 Z"
          fill="url(#hero-head-grad)"
          stroke="#CBD5E1"
          strokeWidth="3"
        />

        {/* Chest Emblem */}
        <rect x="138" y="210" width="44" height="26" rx="8" fill="#0A1E24" />
        <path d="M154 223 L160 216 L166 223 L160 230 Z" fill="#FF5A36" />
        <circle cx="145" cy="223" r="2" fill="#2DD4BF" />
        <circle cx="175" cy="223" r="2" fill="#2DD4BF" />

        {/* Arms */}
        <path d="M102 208 Q78 226 84 252" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="84" cy="252" r="7" fill="#94A3B8" />
        <path d="M218 208 Q242 226 236 252" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="236" cy="252" r="7" fill="#94A3B8" />
      </svg>
    </div>
  );
}
