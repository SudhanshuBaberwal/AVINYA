'use client';

import React from 'react';

interface BoatProps {
  className?: string;
  lanternColor?: string;
  size?: number;
}

export default function Boat({
  className = '',
  lanternColor = '#F5C542',
  size = 64,
}: BoatProps) {
  return (
    <div
      className={`relative select-none pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] ${className}`}
      style={{ width: size, height: size * 0.75 }}
    >
      <svg
        viewBox="0 0 100 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {/* Water Ripple Waves beneath hull */}
        <ellipse
          cx="50"
          cy="64"
          rx="38"
          ry="6"
          fill="none"
          stroke={lanternColor}
          strokeWidth="1.2"
          opacity="0.35"
          className="animate-pulse"
        />

        {/* Boat Wooden Hull */}
        <path
          d="M12 48C12 48 30 65 50 65C70 65 88 48 88 48L76 56C64 64 36 64 24 56L12 48Z"
          fill="#0E0E12"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <path
          d="M18 51C30 59 70 59 82 51"
          stroke={lanternColor}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Main Mast */}
        <line
          x1="50"
          y1="12"
          x2="50"
          y2="52"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Main Classical Sail */}
        <path
          d="M50 14C65 24 74 36 50 44C50 44 68 34 50 14Z"
          fill="#F2F2F0"
          fillOpacity="0.85"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />

        {/* Jib / Front Sail */}
        <path
          d="M48 18C36 28 30 38 48 42L48 18Z"
          fill="#E0E0E0"
          fillOpacity="0.65"
          stroke="#FFFFFF"
          strokeWidth="1"
        />

        {/* Bowsprit Pole */}
        <line
          x1="76"
          y1="50"
          x2="94"
          y2="42"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Guiding Ship Lantern at Bow */}
        <circle cx="94" cy="42" r="3.5" fill={lanternColor} />
        <circle
          cx="94"
          cy="42"
          r="8"
          fill={lanternColor}
          opacity="0.35"
          className="animate-pulse"
        />
        <circle
          cx="94"
          cy="42"
          r="14"
          fill={lanternColor}
          opacity="0.15"
        />
      </svg>
    </div>
  );
}
