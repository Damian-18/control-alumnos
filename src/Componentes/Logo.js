import React from 'react';

export default function Logo({ title = 'Instituto San Miguel' }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      role="img"
      aria-label={title}
      focusable="false"
    >
      <defs>
        <linearGradient id="ismg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3498db" />
          <stop offset="1" stopColor="#2c3e50" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="13" fill="url(#ismg)" />
      {/* Birrete simple */}
      <path
        d="M14 7.5L22.2 11.2L14 14.9L5.8 11.2L14 7.5Z"
        fill="#ffffff"
        opacity="0.95"
      />
      <path
        d="M9.3 13v3.4c0 1.5 2.2 2.7 4.7 2.7s4.7-1.2 4.7-2.7V13"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M22.2 11.2v4.4"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="22.2" cy="16.8" r="1" fill="#ffffff" />
    </svg>
  );
}
