"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function SevenXLogo({ className = "", size = "md", showText = true }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-[#121212] p-1 shadow-md border border-neutral-800 ${iconSizes[size]}`}>
        <Image
          src="/logo.png"
          alt="SevenX Labs"
          width={56}
          height={56}
          className="w-full h-full object-contain rounded-lg"
          priority
        />
      </div>

      {showText && (
        <div className={`font-extrabold tracking-tight ${textSizes[size]}`}>
          <span className="text-neutral-900 dark:text-white">SevenX</span>
          <span className="ml-1 text-pink-600 dark:text-pink-400 font-extrabold">Labs</span>
        </div>
      )}
    </div>
  );
}
