"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function SevenXLogo({ className = "", size = "md", showText = true }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-neutral-950 p-1.5 shadow-lg border border-white/10 ${iconSizes[size]}`}>
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-600/30 to-blue-500/30 blur-sm -z-10" />
        
        {/* Stylized X SVG */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow"
        >
          <defs>
            <linearGradient id="sevenxGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="sevenxGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          
          {/* Main diagonal 1 */}
          <path
            d="M 20 20 L 40 20 L 80 80 L 60 80 Z"
            fill="url(#sevenxGrad1)"
          />
          {/* Main diagonal 2 */}
          <path
            d="M 80 20 L 60 20 L 20 80 L 40 80 Z"
            fill="url(#sevenxGrad2)"
            opacity="0.9"
          />
          {/* Center 7 overlay element */}
          <path
            d="M 30 25 L 70 25 L 50 55"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
        </svg>
      </div>

      {showText && (
        <div className={`font-bold tracking-tight ${textSizes[size]}`}>
          <span className="text-white">SevenX</span>
          <span className="ml-1.5 gradient-text font-extrabold">Labs</span>
        </div>
      )}
    </div>
  );
}
