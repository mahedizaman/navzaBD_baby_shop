"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/common/Container";
import {
  Baby,
  HeartHandshake,
  ShieldCheck,
  Truck,
  HeadphonesIcon,
  Sparkles,
  Target,
} from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function AboutPage() {
  return (
    <Container className="px-4 py-10 md:py-16">
      {/* Hero */}
      <motion.section
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e1250] via-[#26186a] to-[#4b3ab7] px-6 py-10 md:px-10 md:py-14 mb-10 md:mb-14 flex flex-col md:flex-row items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#7f77dd]/30 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#f97316]/10 blur-3xl" />

        <div className="relative z-10 max-w-xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/80 mb-3">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
              <Baby size={14} />
            </span>
            About NavzaBD
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
            A Glimpse Into Our Journey
          </h1>
          <p className="text-sm md:text-base text-violet-100/90 max-w-lg">
            NavzaBD started from a very personal place – the endless search for
            safe, trustworthy products for the little ones we love the most.
            Today, we&apos;re building a home for parents across Bangladesh who
            want the same peace of mind.
          </p>
        </div>

        <div className="relative z-10 w-full max-w-xs md:max-w-sm">
          <div className="relative aspect-square rounded-[2rem] bg-[#fdfcfb] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&w=800&q=80"
              alt="Mother holding baby"
              fill
              sizes="(max-width: 768px) 80vw, 320px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1250]/60 via-transparent" />
          </div>
        </div>
      </motion.section>

      {/* Our Story */}
      <motion.section
        className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center mb-12 md:mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#7f77dd] mb-2">
            Our Story
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-4">
            From a parent&apos;s worry to a trusted baby shop
          </h2>
          <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 mb-3">
            NavzaBD was born the night a young parent stood in front of a shelf
            filled with baby products – confused, overwhelmed, and unsure which
            one to trust. Labels looked fancy, promises sounded perfect, but
            real assurance was missing.
          </p>
          <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 mb-3">
            That personal frustration slowly turned into a mission:{" "}
            <span className="font-semibold text-[#1e1250]">
              what if there was one place where every product was carefully
              selected, quality-checked, and honestly presented for Bangladeshi
              parents?
            </span>{" "}
            No more guessing, no more blind trust – just safe, thoughtful items
            for little ones.
          </p>
          <p className="text-sm md:text-[15px] leading-relaxed text-gray-600">
            Today, NavzaBD is that promise in action. We work closely with
            brands, listen to real parent feedback, and keep refining our
            collection so your baby gets the softness, safety, and comfort they
            deserve – without you having to worry about what&apos;s inside the
            box.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-[#eeedfe] blur-2xl opacity-60" />
          <div className="relative rounded-3xl bg-white border border-violet-100/70 shadow-xl p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#1e1250] text-white flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7f77dd]">
                  Built with love
                </p>
                <p className="text-sm font-medium text-[#1a1a2e]">
                  For parents, by people who understand parents
                </p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Every category in NavzaBD – from diapers to bedtime essentials –
              has been curated with real Bangladeshi families in mind. We
              consider climate, lifestyle, and local availability so your
              shopping feels closer to home.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section
        className="mb-12 md:mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#7f77dd]">
            Mission & Vision
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-[#1a1a2e]">
            Where we&apos;re heading with you
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 md:p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-[#1e1250] text-white flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">
                  Our Mission
                </p>
                <p className="text-xs text-gray-500">
                  Safe, honest, and parent-approved – every time
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              To make safe and genuine baby products easily accessible to every
              family in Bangladesh – with transparent details, thoughtful
              curation, and a shopping experience that respects a parent&apos;s
              time and trust.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-[#fdfbff] p-5 md:p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-[#7f77dd] text-white flex items-center justify-center">
                <Target size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">
                  Our Vision
                </p>
                <p className="text-xs text-gray-500">
                  Becoming Bangladesh&apos;s most loved baby brand
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              To grow into Bangladesh&apos;s most trusted baby & kids platform –
              a place parents recommend with confidence, and a brand that sets
              the benchmark for quality, care, and reliability in every baby&apos;s
              first years.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Why Choose NavzaBD */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#7f77dd]">
            Why Choose NavzaBD
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-[#1a1a2e]">
            Why parents keep coming back
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#eeedfe] flex items-center justify-center">
              <Sparkles className="text-[#1e1250]" size={18} />
            </div>
            <p className="text-sm font-semibold text-[#1a1a2e]">
              Premium Quality
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Products are carefully screened so your baby&apos;s skin, comfort,
              and health are never compromised.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
              <HeartHandshake className="text-[#16a34a]" size={18} />
            </div>
            <p className="text-sm font-semibold text-[#1a1a2e]">
              Trustworthy &amp; Safe
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              From ingredient lists to material choices – we look beyond labels
              so you can shop with real confidence.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Truck className="text-[#2563eb]" size={18} />
            </div>
            <p className="text-sm font-semibold text-[#1a1a2e]">
              Fast Delivery
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              We know baby essentials can&apos;t wait. That&apos;s why we focus on
              quick, reliable delivery across the country.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#fdf4ff] flex items-center justify-center">
              <HeadphonesIcon className="text-[#9333ea]" size={18} />
            </div>
            <p className="text-sm font-semibold text-[#1a1a2e]">
              Excellent Service
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Friendly, human support when you need it – from sizing help to
              order issues, we&apos;re here to listen.
            </p>
          </div>
        </div>
      </motion.section>
    </Container>
  );
}

