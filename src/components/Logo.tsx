import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 38 }) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-xl shadow-md shadow-indigo-500/15 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[78%] h-[78%] drop-shadow-sm"
      >
        <defs>
          <linearGradient id="notebookCover" x1="6" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="pencilWood" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="pencilTip" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fef3c7" />
            <stop offset="1" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id="pencilEraser" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f43f5e" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* Notebook Cover Base (Kouvèti) */}
        <rect
          x="7"
          y="6"
          width="26"
          height="36"
          rx="4.5"
          fill="url(#notebookCover)"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Notebook Spine binding band */}
        <line
          x1="13.5"
          y1="6"
          x2="13.5"
          y2="42"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeDasharray="2 3"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Ruled Pages Interior Lines */}
        <line x1="18.5" y1="14" x2="28" y2="14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        <line x1="18.5" y1="20" x2="28" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        <line x1="18.5" y1="26" x2="25" y2="26" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

        {/* Integrated Slanted Pencil (Kreyon) */}
        <g transform="rotate(-36 32 26)">
          {/* Eraser */}
          <rect x="29" y="8" width="6" height="4" rx="1.5" fill="url(#pencilEraser)" />
          {/* Metal Ferrule band */}
          <rect x="29" y="12" width="6" height="2.2" fill="#cbd5e1" />
          {/* Pencil Main Body */}
          <rect x="29" y="14.2" width="6" height="15" fill="url(#pencilWood)" stroke="#d97706" strokeWidth="0.5" />
          {/* Lead pencil wood shoulder */}
          <polygon points="29,29.2 35,29.2 32,36" fill="url(#pencilTip)" stroke="#d97706" strokeWidth="0.5" />
          {/* Graphite Lead Point */}
          <polygon points="31,33.8 33,33.8 32,36" fill="#1e293b" />
        </g>
      </svg>
    </div>
  );
};
