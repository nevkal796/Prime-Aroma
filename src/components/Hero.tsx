"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import heroImage from "@/assets/cover1.png";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage.src})` }}>
      {/* Dark navy overlay */}
      <div className="absolute inset-0 z-[1] bg-[#0a1628]/60" />
      {/* Content: centered left, above overlay */}
      <div className="relative z-10 flex h-full items-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl w-full">
          <motion.div
            className="max-w-xl lg:max-w-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-[#c9a84c] sm:text-xs">
              THE ART OF FRAGRANCE
            </p>
            <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.15] text-[#EDE8D0] sm:text-5xl md:text-6xl lg:text-7xl">
              Discover Your
              <br />
              <span className="italic text-[#c9a84c]">Signature</span>
              <span className="text-[#EDE8D0]"> Scent</span>
            </h1>
            <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-[#EDE8D0]/70 sm:text-base">
              A carefully curated selection of premium fragrance decants,
              personally chosen for those who appreciate a great scent.
            </p>
            <motion.a
              href="/#collection"
              className="mt-10 inline-flex min-h-[44px] items-center justify-center gap-2 bg-[#EDE8D0] px-8 font-sans text-[10px] font-medium uppercase tracking-widest text-[#0a1628] transition-colors sm:text-xs"
              whileHover={{ backgroundColor: "#c9a84c", color: "#0a1628" }}
              transition={{ duration: 0.3 }}
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
