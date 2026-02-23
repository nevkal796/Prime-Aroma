"use client";

import { useState } from "react";

export default function HeroImage() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full min-h-[320px] w-full items-end justify-center bg-[#0a1628]/50 sm:min-h-[400px]">
        <div className="h-[70%] w-24 rounded-full border border-[#EDE8D0]/20" />
      </div>
    );
  }

  return (
    <div className="aspect-[3/5] w-full max-w-sm lg:max-w-md">
      {/* Add your hero bottle image at public/hero-bottle.png */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-bottle.png"
        alt=""
        className="h-full w-full object-contain object-bottom"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
