"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[600px] bg-brand-gradient opacity-[0.08] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-24 -z-10 size-[420px] rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-16 md:pb-28 md:pt-20 lg:grid-cols-2 lg:gap-12">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs font-semibold text-secondary-foreground">
            <Sparkles className="size-3.5 text-primary" />
            CEFR-based · Trusted results
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find out your{" "}
            <span className="text-brand-gradient">real English level</span>{" "}
            in 40 minutes
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Level Line is a precise, CEFR-aligned placement test that measures
            your vocabulary, grammar, reading, and listening — no signup,
            no waiting, just an accurate result you can trust.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/test">
                Start Test
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <a
              href="#skills"
              className="text-sm font-semibold text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
            >
              See how it works
            </a>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            No registration required · Free instant results
          </p>
        </motion.div>

        {/* Founder image */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border card-shadow-lg">
            <Image
              src="/images/founder-uldana.png"
              alt="Uldana — Level Line founder"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 480px, 90vw"
            />
          </div>

          {/* Floating stat chip */}
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card/95 px-5 py-4 backdrop-blur card-shadow-lg sm:block">
            <p className="text-2xl font-extrabold text-brand-gradient">40</p>
            <p className="text-xs font-medium text-muted-foreground">
              questions, one clear result
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
