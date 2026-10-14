import React, { useState, useRef, useEffect } from 'react';

interface MotherCareLogoProps {
  className?: string;
  size?: number; // size in px
  showText?: boolean;
  onAdminTrigger?: () => void;
  customLogoUrl?: string;
}

export const MotherCareLogo: React.FC<MotherCareLogoProps> = ({
  className = '',
  size = 56,
  showText = true,
  onAdminTrigger,
  customLogoUrl,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [showTapHint, setShowTapHint] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!onAdminTrigger) return;
    
    // Prevent default navigation if wrapped in link
    e.stopPropagation();

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (newCount >= 3 && newCount < 6) {
      setShowTapHint(true);
    }

    if (newCount >= 6) {
      // Secret 6-click target reached!
      setClickCount(0);
      setShowTapHint(false);
      onAdminTrigger();
      return;
    }

    // Reset clicks after 3.5 seconds of inactivity
    timerRef.current = setTimeout(() => {
      setClickCount(0);
      setShowTapHint(false);
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      onClick={handleClick}
      role={onAdminTrigger ? 'button' : undefined}
      title="Mother Care"
      className={`relative inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
    >
      {/* Visual Logo Circle / Emblem */}
      <div 
        className="relative rounded-full transition-transform duration-200 active:scale-95 group-hover:scale-105 shrink-0 shadow-sm"
        style={{ width: size, height: size }}
      >
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt="Mother Care Logo"
            className="w-full h-full object-cover rounded-full border-2 border-teal-600"
          />
        ) : (
          /* High Precision Vector Recreation of the exact user-uploaded Mother Care Emblem */
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full filter drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* White Circular Background */}
            <circle cx="250" cy="250" r="240" fill="#FFFFFF" />

            {/* Outer Teal Rings */}
            <circle cx="250" cy="250" r="236" stroke="#0A8080" strokeWidth="11" />
            <circle cx="250" cy="250" r="222" stroke="#0A8080" strokeWidth="3" />

            {/* Medical Cross with ECG Badge on the Right */}
            <g transform="translate(330, 160)">
              {/* Pink curved arc accent */}
              <circle cx="45" cy="45" r="42" stroke="#F472B6" strokeWidth="4" strokeDasharray="180 50" fill="none" transform="rotate(-40 45 45)" />
              {/* Teal Medical Cross */}
              <rect x="33" y="15" width="24" height="60" rx="7" fill="#0A8080" />
              <rect x="15" y="33" width="60" height="24" rx="7" fill="#0A8080" />
              {/* ECG Heartbeat Line through Cross */}
              <path
                d="M17 45 H33 L38 32 L44 58 L50 35 L54 48 L58 45 H73"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Mother and Child Silhouette */}
            <g transform="translate(0, -10)">
              {/* Mother Silhouette & Flowing Hair */}
              <path
                d="M 235 105 
                   C 195 105 145 135 125 180 
                   C 105 225 108 275 145 320 
                   C 175 355 220 375 270 365 
                   C 235 372 195 365 165 345 
                   C 130 320 120 280 125 240 
                   C 130 200 155 155 195 130 
                   C 215 117 245 112 268 116 
                   C 285 119 297 127 302 135 
                   C 280 135 240 148 215 170 
                   C 185 197 175 230 180 265 
                   C 183 250 190 230 202 215 
                   C 218 195 242 185 268 185 
                   C 290 185 305 195 305 210 
                   C 305 220 298 226 290 228 
                   C 280 230 270 223 268 217 
                   C 266 212 268 206 273 204 
                   C 265 204 250 212 245 225 
                   C 240 240 248 260 260 275 
                   C 255 272 250 268 245 260 
                   C 240 252 238 240 240 228 
                   C 232 235 225 248 225 262 
                   C 225 285 240 310 265 325 
                   C 295 342 335 338 350 315 
                   C 335 328 305 330 280 320 
                   C 255 310 245 290 248 270 
                   C 255 282 268 290 282 290 
                   C 298 290 310 280 312 268 
                   C 300 270 290 262 290 252 
                   C 290 240 305 235 312 248 
                   C 318 240 320 225 312 215 
                   C 302 202 285 196 270 196 
                   C 250 196 230 206 220 222 
                   C 210 240 212 265 222 288 
                   C 212 278 206 260 206 242 
                   C 206 215 220 188 242 170 
                   C 265 152 295 146 312 158 
                   C 305 146 290 135 275 130 
                   C 260 125 248 126 235 105 Z"
                fill="#0A8080"
              />

              {/* Mother's gentle facial profile & eye */}
              <path
                d="M 270 186 
                   C 285 190 296 200 298 215 
                   C 292 218 285 218 280 215 
                   C 275 212 272 205 270 198 Z"
                fill="#0A8080"
              />
              {/* Closed gentle peaceful eye lash line */}
              <path
                d="M 258 205 Q 266 212 274 207"
                stroke="#0A8080"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Loving Pink Heart in Mother's Chest */}
              <path
                d="M 245 285 
                   C 245 273 234 266 225 270 
                   C 219 273 216 278 215 284 
                   C 214 278 211 273 205 270 
                   C 196 266 185 273 185 285 
                   C 185 300 205 315 215 325 
                   C 225 315 245 300 245 285 Z"
                fill="#F472B6"
              />

              {/* Baby in loving hands */}
              <path
                d="M 285 270 
                   C 270 260 252 268 245 282 
                   C 240 292 242 305 252 315 
                   C 265 328 290 332 305 320 
                   C 320 308 322 288 312 275 
                   C 305 265 295 265 285 270 Z"
                fill="#0A8080"
              />
              {/* Baby's gentle closed eye */}
              <path
                d="M 278 282 Q 284 286 289 283"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Mother's arm lovingly wrapping and supporting baby */}
              <path
                d="M 220 340 
                   C 250 360 295 358 335 325 
                   C 350 310 358 290 355 270 
                   C 350 288 340 305 322 318 
                   C 290 340 255 342 220 340 Z"
                fill="#0A8080"
              />
            </g>

            {/* Integrated "Mother Care" Text within the emblem */}
            <text
              x="135"
              y="420"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
              fontWeight="800"
              fontSize="52"
              fill="#0A8080"
              letterSpacing="-1"
            >
              Mother
            </text>
            <text
              x="305"
              y="420"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
              fontWeight="800"
              fontSize="52"
              fill="#F472B6"
              letterSpacing="-1"
            >
              Care
            </text>
          </svg>
        )}

        {/* Pulse indicator on tap */}
        {clickCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[9px] font-bold text-white shadow animate-pulse"
            aria-hidden="true"
          >
            {clickCount}
          </span>
        )}
      </div>

      {/* Brand Text for Navigation/Headers */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-teal-800 font-sans">
              Mother
            </span>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-pink-500 font-sans">
              Care
            </span>
          </div>
          <span className="text-[11px] font-medium text-pink-600 tracking-normal mt-0.5">
            একটি নতুন প্রাণের অপেক্ষায়
          </span>
        </div>
      )}

      {/* Secret click detector operates silently */}
    </div>
  );
};
