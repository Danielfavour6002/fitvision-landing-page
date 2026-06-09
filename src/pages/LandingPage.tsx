// src/pages/LandingPage.tsx
// formiq Brand — Blue #1E56F5 · Black #000000 · Satoshi font

import { useState } from "react";
import { supabase } from "@/lib/supabase";

async function logEvent(eventType: string, metadata?: Record<string, unknown>) {
  try { await supabase.from("events").insert({ event_type: eventType, metadata }); } catch {}
}

async function submitEmail(email: string): Promise<{ alreadyRegistered: boolean } | null> {
  try {
    const { error } = await supabase.from("waitlist").insert({ email });
    if (error) {
      if (error.code === "23505") return { alreadyRegistered: true };
      return null;
    }
    return { alreadyRegistered: false };
  } catch { return null; }
}

// ─── PILL LABEL ───────────────────────────────────────────────────────────
function Pill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center bg-[#1E56F5] text-white text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
      {text}
    </span>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/95 backdrop-blur-sm border-b border-white/8">

      {/* Logo — just the wordmark image, no extra wrapper or duplicate text */}
      <a href="/">
        <img src="/logo-wordmark.png" alt="formiq" className="h-8 w-auto" />
      </a>

      <div className="hidden md:flex items-center gap-8">
        {["How It Works", "Why It Works", "Form Score", "Pricing"].map(item => (
          <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-white/60 hover:text-white text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors">
            {item}
          </a>
        ))}
      </div>

      <a href="#waitlist"
        className="hidden md:inline-flex bg-[#1E56F5] hover:bg-[#1a4de0] text-white font-black text-[10px] px-5 py-2.5 rounded-full tracking-[0.12em] uppercase transition-colors">
        Join Waitlist
      </a>

      <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-black border-b border-white/10 flex flex-col items-center gap-5 py-6 md:hidden">
          {["How It Works", "Why It Works", "Form Score", "Pricing"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-white/70 text-[11px] font-semibold tracking-[0.12em] uppercase"
              onClick={() => setOpen(false)}>{item}</a>
          ))}
          <a href="#waitlist"
            className="bg-[#1E56F5] text-white font-black text-[10px] px-5 py-2.5 rounded-full uppercase tracking-[0.12em]"
            onClick={() => setOpen(false)}>Join Waitlist</a>
        </div>
      )}
    </nav>
  );
}

// ─── WAITLIST FORM ────────────────────────────────────────────────────────
function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true); setError("");
    const result = await submitEmail(email);
    if (!result) { setError("Something went wrong. Try again."); setLoading(false); return; }
    await logEvent("waitlist_signup", { email });
    setSubmitted(true); setLoading(false);
  };

  if (submitted) {
    return (
      <div className={`bg-[#0a1530] border border-[#1E56F5]/50 rounded-2xl px-5 py-4 ${compact ? "max-w-md w-full" : "w-full max-w-lg"}`}>
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-[#1E56F5] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <p className="text-white font-black text-sm">You're on the list!</p>
            <p className="text-white/60 text-[12px] mt-0.5">Early access pricing reserved. We'll notify you at launch.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "w-full max-w-md" : "w-full max-w-lg"}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <input type="email" required placeholder="Enter your email"
          value={email} onChange={e => setEmail(e.target.value)}
          className="flex-1 bg-white/8 border border-white/15 text-white placeholder-white/35 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#1E56F5]/70 transition-colors" />
        <button type="submit" disabled={loading}
          className="bg-[#1E56F5] hover:bg-[#1a4de0] text-white font-black text-[10px] px-6 py-3.5 rounded-xl uppercase tracking-[0.1em] transition-colors whitespace-nowrap disabled:opacity-60">
          {loading ? "Joining..." : "Get Early Access — 50% Off"}
        </button>
      </form>
      {error && <p className="text-red-400 text-[11px] mt-2">{error}</p>}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-5 pt-24 pb-16 relative overflow-hidden bg-black">

      {/* Blue radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 60% 10%, rgba(30,86,245,0.20) 0%, transparent 65%)" }} />

      {/* Faint background wordmark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-white/[0.025] font-black leading-none"
          style={{ fontSize: "clamp(8rem,25vw,20rem)", fontFamily: "Satoshi, Inter, sans-serif" }}>
          formiq
        </span>
      </div>

      {/* Two-column layout: text left, phone right */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* LEFT — text content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

          {/* Beta pill */}
          <div className="inline-flex items-center gap-2 border border-[#1E56F5]/40 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E56F5] animate-pulse flex-shrink-0" />
            <span className="text-[#1E56F5] text-[9px] font-black tracking-[0.3em] uppercase">
              Beta Access — Limited Spots
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-black text-white uppercase leading-[0.92] mb-4"
            style={{ fontFamily: "Satoshi, Inter, sans-serif", fontSize: "clamp(2.6rem,7vw,5rem)" }}>
            <span className="block">Your Form,</span>
            <span className="block text-[#1E56F5]">Perfected.</span>
          </h1>

          {/* Real-time hook */}
          <p className="text-[#1E56F5] text-sm font-bold tracking-wider uppercase mb-4">
            Powered by an AI coach that watches every rep in real time
          </p>

          <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mb-3">
            Coach David watches your form through your phone camera, corrects you rep by rep,
            and scores every session — so you can see yourself getting better.
          </p>
          <p className="text-white/45 text-sm max-w-lg leading-relaxed mb-10">
            No personal trainer. No gym required. Just your phone, your body, and an AI
            that never stops watching.
          </p>

          <div id="waitlist" className="flex flex-col items-center lg:items-start gap-3 w-full mb-6">
            <WaitlistForm />
            <p className="text-white/35 text-[11px] tracking-wider">
              No credit card · No spam · Early access pricing reserved
            </p>
          </div>

          {/* Social proof numbers */}
          <div className="flex items-center gap-8 mt-2">
            {[["500+", "Beta Signups"], ["5", "Exercises"], ["Real-time", "AI Coaching"]].map(([val, label]) => (
              <div key={label} className="text-center lg:text-left">
                <p className="text-white font-black text-base"
                  style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>{val}</p>
                <p className="text-white/35 text-[10px] uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — phone mockup */}
        <div className="flex-shrink-0 flex items-center justify-center lg:justify-end w-full lg:w-auto">
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute inset-0 rounded-3xl"
              style={{
                background: "radial-gradient(ellipse at center, rgba(30,86,245,0.35) 0%, transparent 70%)",
                transform: "scale(1.15)",
                filter: "blur(40px)",
              }} />
            {/* Phone image */}
            <img
              src="/phone-mockup.png"
              alt="formiq app running on iPhone"
              className="relative z-10 w-64 md:w-72 lg:w-80 xl:w-96 drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 30px 60px rgba(30,86,245,0.25))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Coach David transcript bar — below the two columns */}
      <div className="relative z-10 w-full max-w-6xl mx-auto mt-12">
        <div className="bg-[#1E56F5] rounded-2xl px-6 py-4 flex items-center gap-4"
          style={{ boxShadow: "0 8px 40px rgba(30,86,245,0.35)" }}>
          {/* App icon */}
          <img src="/logo-icon.png" alt="Coach David" className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-[9px] font-black tracking-wider uppercase mb-0.5">
              Coach David · Live Session
            </p>
            <p className="text-white text-sm font-medium truncate">
              "Left knee caving — drive it out over your toe. Now."
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {[1, 2, 3, 4, 3, 2].map((h, i) => (
              <div key={i} className="bg-white/50 rounded-full w-1"
                style={{ height: `${h * 5}px`, opacity: 0.5 + (h / 8) }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Prop It Up", desc: "Place your phone on any surface facing you. No wearables, no gym hardware, no sensors. Your camera is all you need." },
    { num: "02", title: "David Watches", desc: "Real-time AI vision maps your joints every frame — knee angle, spine position, hip depth, weight distribution. All of it, live." },
    { num: "03", title: "Corrected Every Rep", desc: "Voice corrections as you move: \"Knee out!\" \"Drop lower!\" Then a form score and coaching summary after every session." },
  ];

  return (
    <section id="how-it-works" className="py-24 px-5 bg-[#030509]">
      <div className="max-w-5xl mx-auto">
        <Pill text="How It Works" />
        <h2 className="font-black text-white uppercase leading-tight mb-3"
          style={{ fontFamily: "Satoshi, Inter, sans-serif", fontSize: "clamp(1.8rem,5vw,3rem)" }}>
          Three Steps.<br /><span className="text-[#1E56F5]">Zero Guesswork.</span>
        </h2>
        <p className="text-white/60 text-base max-w-xl leading-relaxed mb-14">
          Setup takes 30 seconds. No learning curve.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="bg-[#0a0a0a] border border-white/8 rounded-2xl p-7 relative overflow-hidden">
              <span className="absolute top-3 right-5 text-white/[0.04] font-black text-7xl select-none"
                style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>{s.num}</span>
              <div className="w-10 h-10 bg-[#1E56F5] rounded-xl flex items-center justify-center mb-5">
                <span className="text-white font-black text-sm">{i + 1}</span>
              </div>
              <h3 className="text-white font-black text-base uppercase tracking-wider mb-3"
                style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>{s.title}</h3>
              <p className="text-white/60 text-[13px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY IT WORKS ─────────────────────────────────────────────────────────
function WhyItWorksSection() {
  const objections = [
    {
      icon: "🔥",
      question: "Will I actually stay motivated?",
      answer: "Motivation follows visible progress. When your squat score goes from 61 to 84 over 6 weeks, you feel it — less knee discomfort, more depth, more control. Your form score history becomes data you genuinely don't want to lose.",
      highlight: "You don't abandon 8 weeks of form data.",
    },
    {
      icon: "🤝",
      question: "Does it replace human interaction?",
      answer: "No — and it doesn't try to. Less than 5% of gym-goers have a regular personal trainer. formiq is for the other 95% who train alone. It doesn't replace human coaching. It gives real coaching to those who have none.",
      highlight: "If you already have a trainer, use both.",
    },
    {
      icon: "🛡️",
      question: "Does it actually prevent injuries?",
      answer: "Not in the moment — and we won't claim otherwise. What it does is correct the habits that cause injuries. \"Knee caving on rep 6\" corrects what you do on rep 7, and rep 700. Injury prevention is a compound result.",
      highlight: "Correct the habit. The injury never happens.",
    },
  ];

  return (
    <section id="why-it-works" className="py-24 px-5 bg-black">
      <div className="max-w-5xl mx-auto">
        <Pill text="Why It Works" />
        <h2 className="font-black text-white uppercase leading-tight mb-4"
          style={{ fontFamily: "Satoshi, Inter, sans-serif", fontSize: "clamp(1.8rem,5vw,3rem)" }}>
          Real Questions.<br /><span className="text-[#1E56F5]">Honest Answers.</span>
        </h2>
        <p className="text-white/55 text-base max-w-xl leading-relaxed mb-14">
          We've heard every objection. Here's what we actually think.
        </p>
        <div className="space-y-5">
          {objections.map(o => (
            <div key={o.question} className="bg-[#0a0a0a] border border-white/8 rounded-2xl p-8">
              <div className="flex items-start gap-5">
                <span className="text-3xl flex-shrink-0 mt-0.5">{o.icon}</span>
                <div className="flex-1">
                  <h3 className="text-white font-black text-lg mb-3"
                    style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>{o.question}</h3>
                  <p className="text-white/65 text-[13px] leading-relaxed mb-4">{o.answer}</p>
                  <div className="border-l-2 border-[#1E56F5] pl-4">
                    <p className="text-[#1E56F5] font-bold text-[13px]">{o.highlight}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FORM SCORE SECTION ───────────────────────────────────────────────────
function FormScoreSection() {
  return (
    <section id="form-score" className="py-24 px-5 bg-[#030509]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Pill text="Your Fitness Mirror" />
            <h2 className="font-black text-white uppercase leading-tight mb-6"
              style={{ fontFamily: "Satoshi, Inter, sans-serif", fontSize: "clamp(1.8rem,5vw,3rem)" }}>
              The Number No Other<br /><span className="text-[#1E56F5]">App Can Show You.</span>
            </h2>
            <p className="text-white/80 text-[14px] leading-relaxed mb-5">
              Every fitness app tracks what you did — calories, weight, distance.
              None of them track how well you moved.
            </p>
            <p className="text-white/60 text-[13px] leading-relaxed mb-8">
              formiq scores your form after every session. Precise — based on what Coach
              David actually observed during your reps. Knee tracking, spine position,
              depth, consistency.
            </p>
            <p className="text-white/35 text-[10px] uppercase tracking-wider mb-4">Squat Form — 6 Week Example</p>
            <div className="space-y-3">
              {[
                { week: "Week 1", score: 61, grade: "C" },
                { week: "Week 2", score: 68, grade: "C" },
                { week: "Week 3", score: 74, grade: "C" },
                { week: "Week 4", score: 79, grade: "B" },
                { week: "Week 5", score: 84, grade: "B" },
                { week: "Week 6", score: 91, grade: "A" },
              ].map(row => (
                <div key={row.week} className="flex items-center gap-3">
                  <span className="text-white/35 text-[10px] w-14 flex-shrink-0">{row.week}</span>
                  <div className="flex-1 bg-white/8 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full bg-[#1E56F5] transition-all"
                      style={{ width: `${row.score}%`, opacity: 0.5 + (row.score / 200) }} />
                  </div>
                  <span className="text-white font-bold text-[12px] w-7">{row.score}</span>
                  <span className="text-[#1E56F5] font-black text-[11px] w-5">{row.grade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score card mockup */}
          <div className="flex flex-col items-center">
            <p className="text-white/35 text-[10px] uppercase tracking-wider mb-5">Session Score Card</p>
            <div className="w-full max-w-[290px] bg-[#0a0a0a] border border-[#1E56F5]/40 rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 0 40px rgba(30,86,245,0.15)" }}>
              <div className="bg-[#1E56F5] px-6 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <img src="/logo-icon.png" alt="formiq" className="w-5 h-5 rounded-md" />
                  <span className="text-white text-[9px] font-black tracking-[0.2em] uppercase">formiq</span>
                  <span className="ml-auto text-white/60 text-[9px]">Session Complete</span>
                </div>
                <p className="text-white font-black text-sm uppercase tracking-wider">Squats</p>
              </div>
              <div className="px-6 py-6 text-center border-b border-white/8">
                <div className="flex items-end justify-center gap-2 mb-2">
                  <span className="text-white font-black leading-none"
                    style={{ fontSize: "68px", fontFamily: "Satoshi, Inter, sans-serif" }}>87</span>
                  <span className="text-white/35 text-base mb-2">/100</span>
                </div>
                <span className="inline-block bg-[#1E56F5]/20 border border-[#1E56F5]/40 text-[#1E56F5] text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase">
                  Grade B+
                </span>
              </div>
              <div className="px-6 py-4 grid grid-cols-3 gap-2 border-b border-white/8">
                {[["36", "REPS"], ["22", "MIN"], ["+6", "vs LAST"]].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-white font-black text-lg leading-none">{v}</p>
                    <p className="text-white/35 text-[8px] uppercase tracking-wider mt-1">{l}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4">
                <div className="flex items-start gap-2.5">
                  <img src="/logo-icon.png" alt="" className="w-6 h-6 rounded-lg flex-shrink-0 mt-0.5" />
                  <p className="text-white/65 text-[11px] leading-relaxed italic">
                    "Depth was excellent. Watch that left knee on descent — drive it out next session."
                  </p>
                </div>
              </div>
              <div className="px-5 py-3 bg-[#1E56F5]/10 border-t border-[#1E56F5]/15 flex items-center justify-between">
                <span className="text-white/35 text-[9px] uppercase tracking-wider">Streak</span>
                <span className="text-white font-black text-sm">🔥 14 days</span>
              </div>
            </div>
            <p className="text-white/25 text-[10px] mt-4 text-center max-w-[200px]">
              Every session generates a shareable card like this.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SAFETY ───────────────────────────────────────────────────────────────
function SafetySection() {
  return (
    <section className="py-20 px-5 bg-black">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        <div className="flex-1">
          <Pill text="Injury Prevention" />
          <h2 className="font-black text-white uppercase leading-[0.95] mb-5"
            style={{ fontFamily: "Satoshi, Inter, sans-serif", fontSize: "clamp(1.6rem,4vw,2.6rem)" }}>
            Injuries Don't Happen<br /><span className="text-[#1E56F5]">In One Rep.</span>
          </h2>
          <p className="text-white/75 text-[14px] leading-relaxed mb-4 max-w-md">
            Most gym injuries are bad habits repeated thousands of times. A rounding back.
            A caving knee. Nobody catches it. Months later, something snaps.
          </p>
          <p className="text-white/55 text-[13px] leading-relaxed mb-7 max-w-md">
            formiq corrects the habits before they become injuries. "Your knee caved on rep 6"
            changes what happens on rep 7. And rep 700. That's where injury prevention actually lives.
          </p>
          <div className="space-y-3">
            {[
              "Spine neutrality — flagged every session",
              "Knee tracking — corrected in real time",
              "Hip alignment — scored across sessions",
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#1E56F5] flex-shrink-0" />
                <span className="text-white/70 text-[11px] font-bold tracking-[0.12em] uppercase">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 w-full max-w-[220px] mx-auto">
          <div className="bg-[#0a1530] border border-[#1E56F5]/40 rounded-2xl p-6 text-center"
            style={{ boxShadow: "0 0 40px rgba(30,86,245,0.12)" }}>
            <img src="/logo-icon.png" alt="formiq" className="w-14 h-14 rounded-2xl mx-auto mb-4" />
            <p className="text-white font-black text-sm uppercase tracking-wider mb-1"
              style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>Knee Alert</p>
            <p className="text-[#1E56F5] text-[11px] font-bold mb-3">Rep 6 · Left Knee</p>
            <div className="bg-[#1E56F5]/15 border border-[#1E56F5]/25 rounded-xl px-3 py-2.5">
              <p className="text-white/80 text-[11px] leading-relaxed italic">
                "Knee caving inward. Drive it out over your toe."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF ─────────────────────────────────────────────────────────
function SocialProofSection() {
  return (
    <section className="py-20 px-5 bg-[#030509]">
      <div className="max-w-4xl mx-auto text-center">
        <Pill text="Early Testers" />
        <h2 className="font-black text-white uppercase mb-4"
          style={{ fontFamily: "Satoshi, Inter, sans-serif", fontSize: "clamp(1.6rem,4vw,2.4rem)" }}>
          What Early Testers Say
        </h2>
        <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed mb-12">
          Real reactions from formiq beta users.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { quote: "I thought I'd get bored of an AI coach. Then I watched my squat score go from 61 to 84 in 5 weeks. I'm not going anywhere.", name: "Chidi O.", role: "Gym Enthusiast", stat: "61 → 84" },
            { quote: "It caught my lower back rounding on deadlifts. My actual gym instructor never mentioned it once in 6 months. This is different.", name: "Amara K.", role: "Fitness Coach", stat: "0 injuries" },
            { quote: "The knee pain I had for a year is gone. Not a one-time fix — it corrected how I was moving every single session.", name: "Tunde A.", role: "Powerlifter", stat: "12 weeks" },
          ].map(t => (
            <div key={t.name} className="bg-[#0a0a0a] border border-white/8 rounded-2xl p-6 text-left">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-[#1E56F5]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/85 text-[13px] leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-[12px]">{t.name}</p>
                  <p className="text-white/35 text-[11px] mt-0.5">{t.role}</p>
                </div>
                <span className="text-[#1E56F5] text-[10px] font-black bg-[#1E56F5]/10 px-2.5 py-1 rounded-full border border-[#1E56F5]/20">
                  {t.stat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "Will I stay motivated without a human coach?", a: "Motivation follows visible progress. When your form score improves from 61 to 84 and your knees stop hurting — that's motivation nobody manufactures for you. The data you build becomes something you don't want to lose." },
    { q: "Can AI actually see my form accurately?", a: "Yes. Real-time computer vision maps joint positions continuously. Coach David tracks knee angle, spine alignment, hip depth, and weight distribution on every rep." },
    { q: "Does it need special equipment?", a: "Just your smartphone propped on any surface. No wearables, no sensors, no gym hardware. Standard indoor lighting works well." },
    { q: "How real is the injury prevention claim?", a: "formiq corrects the movement habits that cause injuries over time. A caving knee corrected at rep 6 becomes a good habit at rep 6,000. That's where injury prevention lives." },
    { q: "Which exercises are supported?", a: "Beta launches with Squats, Push-ups, Deadlift, Lunges, and Plank. We add more based on user requests." },
    { q: "How much does it cost?", a: "Free tier: 3 AI coaching sessions per week. Pro Coach: $4.99/month early access (50% off). Waitlist members lock in early access pricing." },
  ];

  return (
    <section id="faq" className="py-24 px-5 bg-black">
      <div className="max-w-3xl mx-auto">
        <Pill text="FAQ" />
        <h2 className="font-black text-white uppercase mb-4"
          style={{ fontFamily: "Satoshi, Inter, sans-serif", fontSize: "clamp(1.8rem,5vw,2.8rem)" }}>
          Questions We'd<br /><span className="text-[#1E56F5]">Ask Too.</span>
        </h2>
        <p className="text-white/50 text-sm leading-relaxed mb-12">No marketing language. Straight answers.</p>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/8 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-white font-semibold text-[14px] leading-snug">{f.q}</span>
                <svg className={`w-4 h-4 text-[#1E56F5] flex-shrink-0 transition-transform ${open === i ? "rotate-45" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5 border-t border-white/8">
                  <p className="text-white/65 text-[13px] leading-relaxed pt-4">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────
function PricingSection({ onProClick }: { onProClick: () => void }) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const displayPrice = billing === "monthly" ? "$4.99" : "$47.88";
  const strikePrice = billing === "monthly" ? "$9.99/mo" : "$95.88/yr";
  const billingNote = billing === "monthly" ? "Billed monthly · Cancel anytime" : "Billed as $47.88/year — $3.99/month";

  return (
    <section id="pricing" className="py-24 px-5 bg-[#030509] text-center">
      <div className="max-w-4xl mx-auto">
        <Pill text="Pricing" />
        <h2 className="font-black text-white uppercase mb-3"
          style={{ fontFamily: "Satoshi, Inter, sans-serif", fontSize: "clamp(1.8rem,5vw,3rem)" }}>
          Simple, <span className="text-[#1E56F5]">Honest</span> Pricing
        </h2>
        <p className="text-white/55 text-base max-w-lg mx-auto leading-relaxed mb-10">
          Start free. Upgrade when you're ready.
        </p>

        <div className="inline-flex items-center gap-1 bg-[#111] border border-white/10 rounded-full p-1 mb-12">
          {(["monthly", "annual"] as const).map(b => (
            <button key={b} onClick={() => setBilling(b)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${billing === b ? "bg-[#1E56F5] text-white" : "text-white/45 hover:text-white/70"}`}>
              {b === "monthly" ? "Monthly" : (
                <>Annual <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${billing === "annual" ? "bg-white/20" : "bg-[#1E56F5]/20 text-[#1E56F5]"}`}>SAVE 20%</span></>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* FREE */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-7 text-left flex flex-col">
            <p className="text-white font-black text-sm uppercase tracking-widest mb-1"
              style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>Starter</p>
            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-6">Free forever</p>
            <div className="flex items-end gap-1 mb-7">
              <span className="text-5xl font-black text-white leading-none"
                style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>$0</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {([
                [true, "5 exercises"],
                [true, "Form score after every session"],
                [true, "AI coaching summary"],
                [true, "3 coached sessions per week"],
                [true, "7-day session history"],
                [false, "Unlimited sessions"],
                [false, "Full form history + progress graph"],
              ] as [boolean, string][]).map(([on, label], i) => (
                <li key={i} className={`flex items-center gap-3 text-[13px] ${on ? "text-white/75" : "text-white/20 line-through"}`}>
                  <svg className={`w-4 h-4 flex-shrink-0 ${on ? "text-[#1E56F5]" : "text-white/15"}`}
                    fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {label}
                </li>
              ))}
            </ul>
            <button className="w-full border border-white/12 text-white/50 font-black text-[10px] py-3.5 rounded-xl uppercase tracking-[0.12em] hover:border-white/25 hover:text-white/75 transition-colors">
              Start Free
            </button>
          </div>

          {/* PRO */}
          <div className="relative bg-[#0a1530] border-2 border-[#1E56F5] rounded-2xl p-7 text-left flex flex-col"
            style={{ boxShadow: "0 0 40px rgba(30,86,245,0.15)" }}>
            <div className="absolute -top-3.5 right-5 bg-[#1E56F5] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.12em]">
              Most Popular
            </div>
            <p className="text-[#1E56F5] font-black text-sm uppercase tracking-widest mb-1"
              style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>Pro Coach</p>
            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-4">The complete experience</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-white leading-none"
                style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>{displayPrice}</span>
              <span className="text-white/35 text-sm mb-1">{billing === "monthly" ? "/mo" : "/yr"}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white/25 text-[12px] line-through">{strikePrice}</span>
              <span className="bg-[#1E56F5]/20 border border-[#1E56F5]/30 text-[#1E56F5] text-[8px] font-black px-2 py-0.5 rounded-full uppercase">50% off</span>
            </div>
            <p className="text-white/35 text-[11px] mb-6">{billingNote}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {["Everything in Starter", "Unlimited coaching sessions", "Full form history + progress graph", "Streak system + Coach David check-ins", "Injury-prevention alerts", "Priority server access"].map(f => (
                <li key={f} className="flex items-center gap-3 text-[13px] text-white/85">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#1E56F5]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={onProClick}
              className="w-full bg-[#1E56F5] hover:bg-[#1a4de0] text-white font-black text-[10px] py-3.5 rounded-xl uppercase tracking-[0.12em] transition-colors">
              Lock In Early Access
            </button>
          </div>
        </div>
        <p className="text-white/20 text-[11px] mt-8">All prices in USD · Cancel anytime</p>
      </div>
    </section>
  );
}

// ─── BOTTOM CTA ───────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 px-5 bg-black text-center">
      <div className="max-w-2xl mx-auto">
        <img src="/logo-icon.png" alt="formiq"
          className="w-16 h-16 rounded-2xl mx-auto mb-8"
          style={{ boxShadow: "0 0 40px rgba(30,86,245,0.35)" }} />
        <h2 className="font-black text-white uppercase leading-tight mb-5"
          style={{ fontFamily: "Satoshi, Inter, sans-serif", fontSize: "clamp(1.8rem,5vw,3rem)" }}>
          Your Form,<br /><span className="text-[#1E56F5]">Perfected.</span>
        </h2>
        <p className="text-white/70 text-base leading-relaxed mb-3">
          Every session scored. Every improvement tracked. The data only exists if you start.
        </p>
        <p className="text-white/40 text-sm leading-relaxed mb-10">
          Waitlist members get 50% off Pro Coach. Standard pricing applies after launch.
        </p>
        <div className="flex justify-center mb-4">
          <WaitlistForm compact />
        </div>
        <p className="text-white/25 text-[11px] tracking-wider">No credit card · No spam · Cancel anytime</p>
      </div>
    </section>
  );
}

// ─── PRO MODAL ────────────────────────────────────────────────────────────
function ProModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/85 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-[#0a0a0a] border border-[#1E56F5]/30 rounded-2xl p-8 max-w-sm w-full text-center relative"
        style={{ boxShadow: "0 0 50px rgba(30,86,245,0.15)" }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 text-white/25 hover:text-white/60 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <img src="/logo-icon.png" alt="formiq"
          className="w-14 h-14 rounded-2xl mx-auto mb-5"
          style={{ boxShadow: "0 0 20px rgba(30,86,245,0.3)" }} />
        <h3 className="font-black text-white uppercase text-xl tracking-wider mb-3"
          style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>Coming Very Soon</h3>
        <p className="text-white/70 text-sm leading-relaxed mb-2">
          We're in private beta. Join the waitlist to secure early access pricing —
          <span className="text-[#1E56F5] font-bold"> 50% off your first year</span>.
        </p>
        <p className="text-white/40 text-[12px] leading-relaxed mb-6">
          Standard pricing applies once early access closes.
        </p>
        <div className="mb-4"><WaitlistForm compact /></div>
        <button onClick={onClose}
          className="text-white/25 text-[10px] uppercase tracking-wider hover:text-white/45 transition-colors">
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-black border-t border-white/8 py-12 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          {/* Brand column */}
          <div>
            <img src="/logo-wordmark.png" alt="formiq" className="h-7 w-auto mb-4" />
            <p className="text-white/35 text-[12px] leading-relaxed max-w-[200px]">
              A Smart Fitness Platform. Real-time AI coaching, anywhere.
            </p>
            <p className="text-white/20 text-[10px] mt-3 italic">Your Form, Perfected.</p>
          </div>

          {/* Product column */}
          <div>
            <p className="text-white/40 text-[9px] font-black tracking-[0.3em] uppercase mb-4">Product</p>
            <div className="space-y-2">
              {[
                ["How It Works", "#how-it-works"],
                ["Form Score", "#form-score"],
                ["Pricing", "#pricing"],
                ["Join Waitlist", "#waitlist"],
              ].map(([l, h]) => (
                <a key={l} href={h}
                  className="block text-white/40 hover:text-white/70 text-[12px] transition-colors">{l}</a>
              ))}
            </div>
          </div>

          {/* Legal + Social column */}
          <div>
            <p className="text-white/40 text-[9px] font-black tracking-[0.3em] uppercase mb-4">Legal</p>
            <div className="space-y-2 mb-6">
              {[
                ["Privacy Policy", "/privacy"],
                ["Terms of Service", "/terms"],
              ].map(([l, h]) => (
                <a key={l} href={h}
                  className="block text-white/40 hover:text-white/70 text-[12px] transition-colors">{l}</a>
              ))}
              <a href="mailto:support@formiq.app"
                className="block text-white/40 hover:text-white/70 text-[12px] transition-colors">
                support@formiq.app
              </a>
            </div>
            <p className="text-white/40 text-[9px] font-black tracking-[0.3em] uppercase mb-3">Follow</p>
            <div className="flex gap-4">
              {[
                ["Twitter", "https://twitter.com/formiqapp"],
                ["Instagram", "https://instagram.com/formiqapp"],
                ["TikTok", "https://tiktok.com/@formiqapp"],
              ].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                  className="text-white/35 hover:text-[#1E56F5] text-[11px] transition-colors">{l}</a>
              ))}
            </div>
          </div>

        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/15 text-[10px] tracking-wider">© 2026 formiq. All rights reserved.</p>
          <p className="text-white/15 text-[10px] tracking-wider">Accessible · Guided · Comfortable</p>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [showProModal, setShowProModal] = useState(false);
  return (
    <div className="bg-black min-h-screen" style={{ fontFamily: "Satoshi, Inter, sans-serif" }}>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <WhyItWorksSection />
      <FormScoreSection />
      <SafetySection />
      <SocialProofSection />
      <FAQSection />
      <PricingSection onProClick={() => setShowProModal(true)} />
      <CTASection />
      <Footer />
      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
    </div>
  );
}
