import React from 'react';
import { useMascotStore } from '../../stores/mascotStore';

interface MascotAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  size = 'lg',
}) => {
  const { equipped, mood, bouncingSlot } = useMascotStore();

  const sizeClasses = {
    sm: 'w-40 h-48',
    md: 'w-64 h-72',
    lg: 'w-80 h-96',
  }[size];

  const topColor = equipped.top
    ? equipped.top.colors[0]?.toLowerCase().includes('white')
      ? '#F1F5F9'
      : equipped.top.colors[0]?.toLowerCase().includes('lavender')
      ? '#A78BFA'
      : equipped.top.colors[0]?.toLowerCase().includes('lime')
      ? '#CCFF00'
      : '#232733'
    : '#1E222D';

  const bottomColor = equipped.bottom
    ? equipped.bottom.colors[0]?.toLowerCase().includes('charcoal')
      ? '#262933'
      : equipped.bottom.colors[0]?.toLowerCase().includes('lime')
      ? '#CCFF00'
      : '#15171E'
    : '#181A22';

  const headColor = equipped.head ? '#CCFF00' : '#1E293B';

  const eyeColor = {
    hype: '#CCFF00',
    chill: '#38BDF8',
    cyber: '#00E5FF',
    battle: '#F43F5E',
  }[mood];

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses}`}>
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40 transition-colors duration-500"
        style={{ background: eyeColor }}
      />

      <svg
        viewBox="0 0 320 380"
        className="w-full h-full drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={eyeColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g id="layer-base">
          <path
            d="M 120 280 Q 70 310 60 250 Q 55 210 90 230"
            fill="none"
            stroke="#1E293B"
            strokeWidth="14"
            strokeLinecap="round"
            className="origin-[120px_280px] animate-[pulse_3s_ease-in-out_infinite]"
          />
          <circle cx="90" cy="230" r="8" fill={eyeColor} filter="url(#glow)" />

          <ellipse cx="120" cy="350" rx="22" ry="12" fill="#0D0E12" stroke={eyeColor} strokeWidth="2" />
          <ellipse cx="200" cy="350" rx="22" ry="12" fill="#0D0E12" stroke={eyeColor} strokeWidth="2" />
          <path d="M 100 354 L 142 354" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M 180 354 L 222 354" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" />
        </g>

        <g
          id="layer-bottom"
          className={`transition-all duration-300 ${
            bouncingSlot === 'bottom' ? 'scale-110 origin-bottom' : ''
          }`}
        >
          <path
            d="M 110 250 L 105 342 L 140 342 L 148 275 L 172 275 L 180 342 L 215 342 L 210 250 Z"
            fill={bottomColor}
            stroke="#2B303C"
            strokeWidth="3"
          />
          <rect x="96" y="275" width="16" height="24" rx="3" fill="#111318" stroke="#3A3F4D" strokeWidth="1.5" />
          <rect x="208" y="275" width="16" height="24" rx="3" fill="#111318" stroke="#3A3F4D" strokeWidth="1.5" />
          <path d="M 100 299 Q 120 320 115 330" fill="none" stroke="#CCFF00" strokeWidth="2" />
          {equipped.bottom && (
            <text x="160" y="315" fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
              CARGO-X
            </text>
          )}
        </g>

        <g
          id="layer-top"
          className={`transition-all duration-300 ${
            bouncingSlot === 'top' ? 'scale-110 origin-center' : ''
          }`}
        >
          <path
            d="M 90 160 L 70 235 L 110 240 L 112 265 L 208 265 L 210 240 L 250 235 L 230 160 Q 160 145 90 160 Z"
            fill={topColor}
            stroke="#2B303C"
            strokeWidth="3.5"
          />
          <path
            d="M 125 220 L 195 220 L 205 255 L 115 255 Z"
            fill="rgba(0,0,0,0.25)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          <line x1="145" y1="168" x2="145" y2="195" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="175" y1="168" x2="175" y2="190" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          {equipped.top?.images?.[0] ? (
            <g id="top-artwork-patch">
              <clipPath id="topPatchClip">
                <circle cx="160" cy="195" r="16" />
              </clipPath>
              <circle cx="160" cy="195" r="17.5" fill="#0A0A0C" stroke="#D4FF00" strokeWidth="2" />
              <image
                href={equipped.top.images[0]}
                x="142"
                y="177"
                width="36"
                height="36"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#topPatchClip)"
              />
              <circle cx="160" cy="195" r="16" fill="none" stroke="rgba(212, 255, 0, 0.4)" strokeWidth="1" />
            </g>
          ) : (
            <g id="top-default-patch">
              <circle cx="160" cy="195" r="14" fill="#0D0E12" stroke={eyeColor} strokeWidth="1.5" />
              <text x="160" y="199" fill={eyeColor} fontSize="11" fontWeight="bold" textAnchor="middle">
                FW
              </text>
            </g>
          )}
        </g>

        <g id="layer-head-base">
          <polygon points="100,120 70,50 125,85" fill="#1E293B" stroke="#334155" strokeWidth="3" />
          <polygon points="100,110 80,65 118,88" fill={eyeColor} opacity="0.4" />

          <polygon points="220,120 250,50 195,85" fill="#1E293B" stroke="#334155" strokeWidth="3" />
          <polygon points="220,110 240,65 202,88" fill={eyeColor} opacity="0.4" />

          <rect
            x="95"
            y="75"
            width="130"
            height="95"
            rx="45"
            fill="url(#bodyGrad)"
            stroke="#334155"
            strokeWidth="3"
          />

          <rect
            x="115"
            y="105"
            width="90"
            height="32"
            rx="16"
            fill="#05070A"
            stroke={eyeColor}
            strokeWidth="2.5"
            filter="url(#glow)"
          />

          {mood === 'hype' && (
            <>
              <text x="138" y="127" fill={eyeColor} fontSize="18" fontWeight="900" textAnchor="middle">★</text>
              <text x="182" y="127" fill={eyeColor} fontSize="18" fontWeight="900" textAnchor="middle">★</text>
            </>
          )}
          {mood === 'chill' && (
            <>
              <path d="M 128 122 Q 138 116 148 122" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 172 122 Q 182 116 192 122" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          )}
          {mood === 'cyber' && (
            <>
              <line x1="125" y1="121" x2="195" y2="121" stroke={eyeColor} strokeWidth="3" strokeDasharray="6 3" />
            </>
          )}
          {mood === 'battle' && (
            <>
              <path d="M 126 116 L 148 125" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" />
              <path d="M 194 116 L 172 125" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" />
            </>
          )}

          <polygon points="160,142 156,146 164,146" fill={eyeColor} />
          <line x1="95" y1="125" x2="110" y2="128" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="95" y1="135" x2="110" y2="135" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="210" y1="128" x2="225" y2="125" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="210" y1="135" x2="225" y2="135" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        </g>

        {equipped.head && (
          <g
            id="layer-headwear"
            className={`transition-all duration-300 ${
              bouncingSlot === 'head' ? 'scale-110 origin-top' : ''
            }`}
          >
            <path
              d="M 90 85 Q 160 30 230 85 L 225 105 Q 160 85 95 105 Z"
              fill={headColor}
              stroke="#111318"
              strokeWidth="3"
            />
            <path
              d="M 92 98 Q 160 85 228 98 L 225 110 Q 160 98 95 110 Z"
              fill="#181A22"
              stroke={eyeColor}
              strokeWidth="1.5"
            />
            <circle cx="160" cy="45" r="9" fill={headColor} />
            {equipped.head.images?.[0] && (
              <g id="headwear-art-badge">
                <clipPath id="headBadgeClip">
                  <circle cx="160" cy="78" r="14" />
                </clipPath>
                <circle cx="160" cy="78" r="15.5" fill="#0A0A0C" stroke="#D4FF00" strokeWidth="1.5" />
                <image
                  href={equipped.head.images[0]}
                  x="144"
                  y="62"
                  width="32"
                  height="32"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#headBadgeClip)"
                />
              </g>
            )}
          </g>
        )}

        {equipped.accessory && (
          <g
            id="layer-accessory"
            className="animate-[bounce_3s_ease-in-out_infinite] origin-center"
          >
            {/* Holographic energy orbit arc */}
            <path
              d="M 45 105 Q 25 175 50 245"
              stroke="#00E5FF"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              fill="none"
              opacity="0.8"
            />
            {/* Floating 3D Pop-Art Accessory Hologram Token */}
            <g transform="translate(30, 135)">
              <circle cx="32" cy="32" r="32" fill="#0A0A0C" stroke="#D4FF00" strokeWidth="2.5" filter="url(#glow)" />
              <clipPath id="accessoryOrbClip">
                <circle cx="32" cy="32" r="30" />
              </clipPath>
              {equipped.accessory.images?.[0] ? (
                <image
                  href={equipped.accessory.images[0]}
                  x="0"
                  y="0"
                  width="64"
                  height="64"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#accessoryOrbClip)"
                />
              ) : (
                <circle cx="32" cy="32" r="30" fill="#1E293B" />
              )}
              <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(212, 255, 0, 0.4)" strokeWidth="1.5" />
              <circle cx="56" cy="10" r="5" fill="#FF5722" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
