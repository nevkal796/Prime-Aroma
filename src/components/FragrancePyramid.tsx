"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Section = "top" | "middle" | "base";

const SECTION_LABELS: Record<Section, string> = {
  top: "Top Notes",
  middle: "Middle Notes",
  base: "Base Notes",
};

type Props = {
  topNotes: string;
  middleNotes: string;
  baseNotes: string;
};

// Single triangle: top (100,10), bottom-left (10,190), bottom-right (190,190)
// Divided into three horizontal bands. Points ordered so each polygon is a proper shape (no bow-tie).
// Top third: small triangle at apex
const TOP_POINTS = "100,10 70,70 130,70";
// Middle third: trapezoid (top-left, top-right, bottom-right, bottom-left)
const MIDDLE_POINTS = "70,70 130,70 160,130 40,130";
// Base third: trapezoid
const BASE_POINTS = "40,130 160,130 190,190 10,190";

export default function FragrancePyramid({
  topNotes,
  middleNotes,
  baseNotes,
}: Props) {
  const [active, setActive] = useState<Section | null>(null);

  const sections: { id: Section; points: string; fill: string; notes: string }[] = [
    { id: "top", points: TOP_POINTS, fill: "rgb(218, 194, 150)", notes: topNotes },
    { id: "middle", points: MIDDLE_POINTS, fill: "rgb(197, 158, 85)", notes: middleNotes },
    { id: "base", points: BASE_POINTS, fill: "rgb(159, 112, 24)", notes: baseNotes },
  ];

  function noteItems(notes: string): string[] {
    return notes.split(",").map((s) => s.trim()).filter(Boolean);
  }

  function toggle(id: Section) {
    setActive((prev) => (prev === id ? null : id));
  }

  const activeSection = active ? sections.find((s) => s.id === active) : null;

  return (
    <section className="rounded bg-[#EDE8D0] py-8 px-4">
      <p className="text-center font-sans text-[20px] font-medium uppercase tracking-widest text-[#0a1628]/70 sm:text-s">
        {activeSection ? SECTION_LABELS[activeSection.id].toUpperCase() : "Notes"}
      </p>
      <div className="relative mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <motion.div
          className="flex-shrink-0"
          animate={{ x: activeSection ? -50 : 0 }}
          transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <svg
            viewBox="0 0 200 200"
            className="h-40 w-40 sm:h-44 sm:w-44"
            aria-label="Fragrance pyramid"
          >
            {sections.map(({ id, points, fill, notes }) => {
              const isActive = active === id;
              return (
                <polygon
                  key={id}
                  points={points}
                  fill={fill}
                  stroke={isActive ? "#c9a84c" : "transparent"}
                  strokeWidth={isActive ? 4 : 0}
                  className="cursor-pointer transition-all duration-200 hover:brightness-110"
                  style={{
                    filter: isActive ? "brightness(1.1)" : undefined,
                  }}
                  onClick={() => toggle(id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(id);
                    }
                  }}
                  aria-pressed={isActive}
                  aria-label={`${SECTION_LABELS[id]}: ${notes}`}
                />
              );
            })}
          </svg>
        </motion.div>
        {/* Absolutely positioned so layout doesn't shift — pyramid glides smoothly to/from center */}
        <AnimatePresence mode="wait">
          {activeSection && (
            <motion.div
              key={activeSection.id}
              className="absolute left-1/2 top-1/2 min-w-[180px] translate-x-12 -translate-y-1/2 rounded bg-[#EDE8D0] p-4 sm:translate-x-20 sm:p-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ul className="mt-3 space-y-1.5 sm:mt-0">
                {noteItems(activeSection.notes).map((item) => (
                  <li
                    key={item}
                    className="font-serif text-sm leading-relaxed text-[#0a1628] sm:text-base"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
