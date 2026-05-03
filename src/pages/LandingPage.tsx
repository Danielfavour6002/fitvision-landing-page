import { useState } from "react";
import { supabase } from "@/lib/supabase";

async function logEvent(eventType: string, metadata?: Record<string, unknown>) {
  try {
    await supabase.from("events").insert({ event_type: eventType, metadata });
  } catch {}
}

async function submitEmail(
  email: string
): Promise<{ discountCode: string; alreadyRegistered: boolean } | null> {
  try {
    const { error } = await supabase.from("waitlist").insert({ email });
    if (error) {
      if (error.code === "23505") return { discountCode: "", alreadyRegistered: true };
      return null;
    }
    return { discountCode: "", alreadyRegistered: false };
  } catch {
    return null;
  }
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/95 backdrop-blur-sm border-b border-white/8">
      <img 
        src="/logo-dark-bg.svg" 
        alt="FitVision AI"
        className="h-7 w-auto"  // controls height, width scales automatically
      />
      <div className="hidden md:flex items-center gap-8">
        {["How It Works", "Why It Works", "Form Score", "Pricing"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-white/60 hover:text-white text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors"
          >
            {item}
          </a>
        ))}
      </div>
      <a href="#waitlist"
        className="hidden md:inline-flex bg-[#39FF14] text-black font-black text-[10px] px-5 py-2.5 rounded tracking-[0.15em] uppercase hover:brightness-110 transition-all">
        Join Waitlist — Free
      </a>
      <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-b border-white/10 flex flex-col items-center gap-5 py-6 md:hidden">
          {["How It Works", "Why It Works", "Form Score", "Pricing"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-white/70 text-[11px] font-semibold tracking-[0.15em] uppercase"
              onClick={() => setMenuOpen(false)}>{item}</a>
          ))}
          <a href="#waitlist"
            className="bg-[#39FF14] text-black font-black text-[10px] px-5 py-2.5 rounded tracking-[0.15em] uppercase"
            onClick={() => setMenuOpen(false)}>Join Waitlist — Free</a>
        </div>
      )}
    </nav>
  );
}

// ─── WAITLIST FORM ─────────────────────────────────────────────────────────
function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setError("");
    const result = await submitEmail(email);
    if (!result) { setError("Something went wrong. Please try again."); setLoading(false); return; }
    await logEvent("waitlist_signup", { email });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className={`bg-[#0a1a0a] border border-[#39FF14]/50 rounded-xl px-5 py-4 text-left ${compact ? "max-w-md" : "w-full max-w-lg"}`}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#39FF14] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="black" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <p className="text-[#39FF14] font-black text-sm uppercase tracking-wider">You're on the list!</p>
            <p className="text-white/70 text-[12px] mt-0.5">Early access pricing reserved. We'll notify you at launch. 🚀</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "w-full max-w-md" : "w-full max-w-lg"}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <input type="email" required placeholder="Enter your email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-[#39FF14]/60 transition-colors" />
        <button type="submit" disabled={loading}
          className="bg-[#39FF14] text-black font-black text-[10px] px-6 py-3.5 rounded-lg uppercase tracking-[0.1em] hover:brightness-110 active:scale-95 transition-all whitespace-nowrap disabled:opacity-60">
          {loading ? "Joining..." : "Get Early Access — 50% Off"}
        </button>
      </form>
      {error && <p className="text-[#FF3131] text-[11px] mt-2">{error}</p>}
    </div>
  );
}

// ─── VIDEO PLAYER ──────────────────────────────────────────────────────────
const VIDEO_SRC = `${import.meta.env.BASE_URL}fitvision-demo.mp4`;
function VideoPlayer() {
  const [hasError, setHasError] = useState(false);
  const pts: [number, number][] = [[50,15],[50,30],[37,36],[63,36],[30,50],[70,50],[38,63],[62,63],[40,80],[60,80]];
  const lines: [number,number][] = [[0,1],[1,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9]];
  return (
    <div className="relative aspect-video bg-[#080808] flex items-center justify-center overflow-hidden">
      {!hasError ? (
        <video src={VIDEO_SRC} autoPlay muted loop playsInline className="w-full h-full object-cover" onError={() => setHasError(true)} />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 w-full h-full"
          style={{ background: "radial-gradient(ellipse at center, #0d1f0d 0%, #080808 70%)" }}>
          <div className="relative mb-4">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {lines.map(([a,b],i) => <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#39FF14" strokeWidth="1.2" strokeOpacity="0.7" />)}
              {pts.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="2.8" fill="#39FF14" fillOpacity="0.9" />)}
              <text x="54" y="53" fill="#39FF14" fontSize="7" fontWeight="bold">85°</text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border border-[#39FF14]/20 animate-ping" style={{ animationDuration: "2s" }} />
            </div>
          </div>
          <p className="text-white font-bold text-sm mb-1">Coach David · Live Session</p>
          <p className="text-white/50 text-[11px] text-center max-w-[220px] leading-relaxed">Real-time form analysis and voice coaching</p>
          <div className="mt-4 bg-black/70 border border-[#39FF14]/30 rounded-lg px-4 py-2.5 text-center">
            <p className="text-[#39FF14] text-[10px] font-black tracking-wider animate-pulse">
              🎤 "Your left knee is caving inward — push it out now!"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-16 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050f05 0%, #000000 60%)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(57,255,20,0.09) 0%, transparent 70%)" }} />
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl">

        <div className="inline-flex items-center gap-2 border border-[#39FF14]/40 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse flex-shrink-0" />
          <span className="text-[#39FF14] text-[9px] font-black tracking-[0.3em] uppercase">
            Beta Access — Limited Spots Remaining
          </span>
        </div>

        {/* REPOSITIONED HEADLINE — form improvement over time */}
        <h1 className="font-montserrat font-black text-white uppercase leading-[0.93] mb-5">
          <span className="block text-[clamp(2.2rem,8vw,4.8rem)]">The Only App That</span>
          <span className="block text-[clamp(2.2rem,8vw,4.8rem)]">Shows You How Your</span>
          <span className="block text-[clamp(2.2rem,8vw,4.8rem)] text-[#39FF14] italic">Form Improves.</span>
        </h1>

        {/* Add this bridge line — keeps real-time coaching front and center */}
        <p className="text-[#39FF14] text-sm font-bold tracking-wider uppercase mb-4">
          Powered by an AI coach that watches every rep in real time
        </p>

        <p className="text-white text-base md:text-lg max-w-xl leading-relaxed mb-3 font-medium">
          Coach David watches your form through your phone camera, 
          corrects you rep by rep, and scores every session — 
          so you can actually see yourself getting better.
        </p>

        <div id="waitlist" className="flex flex-col items-center gap-3 w-full mb-12">
          <WaitlistForm />
          <p className="text-white/40 text-[11px] tracking-wider">
            No credit card · No spam · Early access pricing reserved on signup
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <div className="relative rounded-2xl overflow-hidden border border-white/12 bg-[#0a0a0a]"
            style={{ boxShadow: "0 0 80px rgba(57,255,20,0.07), 0 25px 50px rgba(0,0,0,0.5)" }}>
            <div className="flex items-center gap-2 px-4 py-3 bg-black/80 border-b border-white/8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              <span className="text-[#39FF14] text-[9px] font-black tracking-widest uppercase">Coach David · Live Session</span>
              <span className="ml-auto text-white/30 text-[9px] font-medium">Real-Time AI Coaching</span>
            </div>
            <VideoPlayer />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ──────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Prop It Up", desc: "Place your phone on any surface aimed at you. No wearables, no special equipment, no gym hardware. Just your camera.", img: "/img-panel1.png" },
    { num: "02", title: "Coach David Watches", desc: "Real-time computer vision maps 33 body landmarks across every frame. He sees your knee angle, spine position, and weight distribution as you move.", img: "/img-panel2.png" },
    { num: "03", title: "Corrected Every Rep", desc: 'Live voice cues as you move: "Knee out!", "Go deeper!", "Perfect depth!" — then a form score and coaching summary after every session.', img: "/img-panel3.png" },
  ];
  return (
    <section id="how-it-works" className="py-24 px-5 bg-[#030803]">
      <div className="max-w-5xl mx-auto">
        <p className="text-[#39FF14] text-[9px] font-black tracking-[0.35em] uppercase mb-4">How It Works</p>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-3">
          Three Steps.<br /><span className="text-[#39FF14] italic">Zero Guesswork.</span>
        </h2>
        <p className="text-white/70 text-base max-w-xl leading-relaxed mb-12">
          Getting started takes less than 60 seconds. No setup. No equipment. No learning curve.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] mb-5">
                <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent px-4 py-3">
                  <span className="text-[#39FF14] font-mono font-black text-xs">{s.num}</span>
                </div>
              </div>
              <h3 className="text-white font-black uppercase text-sm tracking-[0.1em] mb-2">{s.title}</h3>
              <p className="text-white/70 text-[13px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY IT WORKS — addresses every objection directly ─────────────────────
function WhyItWorksSection() {
  const objections = [
    {
      question: "Will I actually stay motivated?",
      icon: "🔥",
      answer: "Motivation follows visible progress. When your squat form goes from 61 to 84 over 6 weeks, you feel it in your body — less knee pain, more depth, more weight. That physical proof keeps you coming back. We also build in streaks, Coach David check-ins when you miss sessions, and a form score history that becomes data you'd hate to lose.",
      highlight: "You don't lose a streak. You don't abandon 8 weeks of form data.",
    },
    {
      question: "Does it replace human interaction?",
      icon: "🤝",
      answer: "No — and it doesn't try to. Less than 5% of gym-goers have a regular personal trainer. FitVision is for the other 95% who train alone. It doesn't replace human coaching for those who have it. It provides real coaching for those who don't.",
      highlight: "If you already have a trainer, use both. If you don't, now you do.",
    },
    {
      question: "Can AI actually prevent injuries?",
      icon: "🛡️",
      answer: "Not in the moment — and we won't pretend otherwise. A sub-second response can't physically stop you mid-rep. What it does is correct the habits that cause injuries. \"Your knee caved on rep 6\" said after the rep changes what you do on rep 7, and rep 100, and rep 10,000. Injury prevention is a compound result, not a one-time intervention.",
      highlight: "Correct the habit. The injury never happens.",
    },
  ];

  return (
    <section id="why-it-works" className="py-24 px-5 bg-black">
      <div className="max-w-5xl mx-auto">
        <p className="text-[#39FF14] text-[9px] font-black tracking-[0.35em] uppercase mb-4">Why It Works</p>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-4">
          Real Questions.<br /><span className="text-[#39FF14] italic">Honest Answers.</span>
        </h2>
        <p className="text-white/65 text-base max-w-xl leading-relaxed mb-16">
          We've heard every objection. Here's what we actually think.
        </p>

        <div className="space-y-6">
          {objections.map((o) => (
            <div key={o.question} className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-8">
              <div className="flex items-start gap-5">
                <span className="text-3xl flex-shrink-0 mt-1">{o.icon}</span>
                <div className="flex-1">
                  <h3 className="text-white font-black text-lg mb-3">{o.question}</h3>
                  <p className="text-white/75 text-[14px] leading-relaxed mb-4">{o.answer}</p>
                  <div className="border-l-2 border-[#39FF14] pl-4">
                    <p className="text-[#39FF14] font-bold text-[13px]">{o.highlight}</p>
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

// ─── FORM SCORE SECTION — the viral loop ───────────────────────────────────
function FormScoreSection() {
  return (
    <section id="form-score" className="py-24 px-5 bg-[#030803]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#39FF14] text-[9px] font-black tracking-[0.35em] uppercase mb-4">Your Fitness Mirror</p>
            <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-6">
              The Number No Other<br /><span className="text-[#39FF14] italic">App Can Show You.</span>
            </h2>
            <p className="text-white/85 text-base leading-relaxed mb-5">
              Every fitness app tracks what you did — calories burned, weight lifted, distance covered.
              None of them track how well you moved.
            </p>
            <p className="text-white/70 text-[14px] leading-relaxed mb-5">
              FitVision scores your form after every session. Not a rough estimate — a precise
              score based on what Coach David actually observed during your reps. Knee tracking,
              spine position, depth, consistency. All of it.
            </p>
            <p className="text-white/85 text-[14px] leading-relaxed">
              Watch that number climb. That climb is the only proof that matters —
              proof that you're moving better, building safer habits, and actually improving.
            </p>

            {/* Form score progression example */}
            <div className="mt-8 space-y-3">
              <p className="text-white/50 text-[11px] uppercase tracking-wider mb-4">Example — Squat Form Over 6 Weeks</p>
              {[
                { week: "Week 1", score: 61, grade: "C" },
                { week: "Week 2", score: 68, grade: "C" },
                { week: "Week 3", score: 74, grade: "C" },
                { week: "Week 4", score: 79, grade: "B" },
                { week: "Week 5", score: 84, grade: "B" },
                { week: "Week 6", score: 91, grade: "A" },
              ].map((row) => (
                <div key={row.week} className="flex items-center gap-3">
                  <span className="text-white/40 text-[11px] w-14 flex-shrink-0">{row.week}</span>
                  <div className="flex-1 bg-white/8 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${row.score}%`,
                        backgroundColor: row.score >= 90 ? "#39FF14" : row.score >= 75 ? "#7fff00" : "#a8ff00"
                      }}
                    />
                  </div>
                  <span className="text-white font-bold text-[12px] w-8">{row.score}</span>
                  <span className="text-[#39FF14] font-black text-[11px] w-6">{row.grade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shareable score card mockup */}
          <div className="flex flex-col items-center">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-6">Session Score Card</p>
            <div className="w-full max-w-[300px] bg-[#0a0a0a] border border-[#39FF14]/40 rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 0 40px rgba(57,255,20,0.1)" }}>
              {/* Card header */}
              <div className="bg-[#0d2200] px-6 py-4 border-b border-[#39FF14]/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#39FF14] text-[9px] font-black tracking-[0.3em] uppercase">FitVision AI</span>
                  <span className="text-white/30 text-[9px]">Session Complete</span>
                </div>
                <p className="text-white font-black text-sm uppercase tracking-wider">Squats</p>
              </div>
              {/* Score */}
              <div className="px-6 py-6 text-center border-b border-white/8">
                <div className="flex items-end justify-center gap-2 mb-1">
                  <span className="text-[#39FF14] font-black leading-none" style={{ fontSize: "72px" }}>87</span>
                  <span className="text-white/40 text-lg mb-3">/100</span>
                </div>
                <span className="inline-block bg-[#39FF14]/15 border border-[#39FF14]/30 text-[#39FF14] text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase">
                  Grade B+
                </span>
              </div>
              {/* Stats */}
              <div className="px-6 py-4 grid grid-cols-3 gap-2 border-b border-white/8">
                {[["36", "REPS"], ["22", "MIN"], ["+6", "FROM LAST"]].map(([val, label]) => (
                  <div key={label} className="text-center">
                    <p className="text-white font-black text-lg leading-none">{val}</p>
                    <p className="text-white/40 text-[8px] uppercase tracking-wider mt-1">{label}</p>
                  </div>
                ))}
              </div>
              {/* Coach note */}
              <div className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0d2200] border border-[#39FF14]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#39FF14] text-[10px] font-black">D</span>
                  </div>
                  <p className="text-white/70 text-[11px] leading-relaxed italic">
                    "Depth was excellent today. Watch that left knee on the descent — push it out over your pinky toe next session."
                  </p>
                </div>
              </div>
              {/* Streak */}
              <div className="px-6 py-3 bg-[#0d2200]/50 flex items-center justify-between">
                <span className="text-white/40 text-[9px] uppercase tracking-wider">Training Streak</span>
                <span className="text-[#39FF14] font-black text-sm">🔥 14 days</span>
              </div>
            </div>
            <p className="text-white/30 text-[10px] mt-4 text-center">
              Every session generates a shareable card like this.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── INJURY REFRAME SECTION ─────────────────────────────────────────────────
function SafetySection() {
  return (
    <section id="safety" className="py-20 px-5 bg-black">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-center">
        <div className="flex-1 order-2 md:order-1">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-4 h-4 text-[#FF3131] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 7v6c0 4.418 3.582 8 8 9 4.418-1 8-4.582 8-9V7l-8-5z"/>
            </svg>
            <span className="text-[#FF3131] text-[9px] font-black tracking-[0.3em] uppercase">Injury Prevention</span>
          </div>
          <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.6rem,4vw,2.6rem)] leading-[0.95] mb-5">
            Injuries Don't Happen<br /><span className="text-[#FF3131] italic">In One Rep.</span>
          </h2>
          {/* REFRAMED — corrects habits not emergency intervention */}
          <p className="text-white/85 text-[14px] leading-relaxed mb-4 max-w-md">
            Most gym injuries are the result of bad habits repeated thousands of times. A rounded
            back. A caving knee. A forward lean. Nobody catches it. Months later, something snaps.
          </p>
          <p className="text-white/70 text-[13px] leading-relaxed mb-7 max-w-md">
            FitVision doesn't claim to stop injuries in real time — no app can do that honestly.
            What it does is correct the habits before they become injuries. "Your knee caved on
            rep 6" changes what happens on rep 7. And rep 700. That's where injury prevention
            actually lives.
          </p>
          <div className="space-y-3">
            {[
              { color: "#FF3131", label: "Spine Neutrality — flagged every session" },
              { color: "#39FF14", label: "Knee Tracking — corrected in real time" },
              { color: "#39FF14", label: "Hip Alignment — scored across sessions" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                <span className="text-white/80 text-[11px] font-bold tracking-[0.15em] uppercase">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 w-full max-w-[240px] mx-auto md:mx-0 order-1 md:order-2">
          <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-[#FF3131]/50"
            style={{ boxShadow: "0 0 40px rgba(255,49,49,0.2)" }}>
            <img src="/img-safety.png" alt="Safety detection" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#FF3131]/10" />
            <div className="absolute bottom-4 left-3 right-3">
              <div className="bg-black/90 border border-[#FF3131] rounded-lg px-4 py-3 text-center"
                style={{ boxShadow: "0 0 20px rgba(255,49,49,0.3)" }}>
                <p className="text-[#FF3131] text-[10px] font-black tracking-[0.15em] uppercase animate-pulse">
                  ⚠ Knee Caving — Rep 6
                </p>
                <p className="text-white/50 text-[8px] mt-1">Corrected before rep 7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF — updated to address objections ──────────────────────────
function SocialProofSection() {
  return (
    <section className="py-20 px-5 bg-[#030803]">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#39FF14] text-[9px] font-black tracking-[0.35em] uppercase mb-3">Early Testers</p>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.6rem,4vw,2.4rem)] mb-4">
          What Early Testers Say
        </h2>
        <p className="text-white/60 text-sm max-w-lg mx-auto leading-relaxed mb-12">
          These are real reactions from people who have used FitVision in beta.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              quote: "I thought I'd get bored of an AI coach. Then I watched my squat score go from 61 to 84 in 5 weeks. I'm not going anywhere.",
              name: "Chidi O.",
              role: "Gym Enthusiast",
              stat: "Form: 61 → 84"
            },
            {
              quote: "It caught my lower back rounding on deadlifts. My actual gym instructor never mentioned it once in 6 months. This is different.",
              name: "Amara K.",
              role: "Fitness Coach",
              stat: "6 weeks, 0 injuries"
            },
            {
              quote: "The knee pain I had for a year is gone. Not because of a one-time fix — because it corrected how I was moving every single session.",
              name: "Tunde A.",
              role: "Powerlifter",
              stat: "12-week user"
            },
          ].map((t) => (
            <div key={t.name} className="bg-[#0d0d0d] border border-white/10 rounded-xl p-6 text-left">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_,i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-[#39FF14]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-white/90 text-[13px] leading-relaxed mb-4">"{t.quote}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-[12px]">{t.name}</p>
                  <p className="text-white/40 text-[11px] mt-0.5">{t.role}</p>
                </div>
                <span className="text-[#39FF14] text-[10px] font-black bg-[#39FF14]/10 px-2 py-1 rounded-full">
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

// ─── FAQ — updated to handle real objections ───────────────────────────────
function FAQSection() {
  const faqs = [
    {
      q: "Will I actually stay motivated without a real human coach?",
      a: "Motivation follows visible progress, not people. When your form score improves from 61 to 84 over 6 weeks and your knees stop hurting — that's motivation nobody can manufacture for you. We also add streaks, weekly progress reports, and Coach David checking in when you miss sessions. The data you build up becomes something you genuinely don't want to lose."
    },
    {
      q: "Can AI actually see my form accurately?",
      a: "Yes — through real-time computer vision that maps 33 body landmarks per frame. Coach David tracks your knee angle, spine alignment, hip depth, and weight distribution continuously. Watch the demo video — at 0:14 he catches the knee collapse at the bottom of the squat descent and calls it before the rep is finished. That's not a filter or a mockup."
    },
    {
      q: "Does it need special equipment or lighting?",
      a: "Just your smartphone propped on any surface. No wearables, no sensors, no gym hardware. Standard indoor lighting works well — very dark rooms may reduce tracking accuracy slightly."
    },
    {
      q: "How real is the injury prevention claim?",
      a: "We're honest about this: FitVision can't physically stop you mid-rep. What it does is correct the movement habits that cause injuries over time. A caving knee corrected at rep 6 becomes a good habit at rep 6,000. That's where injury prevention actually lives — not in emergency intervention, but in changing how you move permanently."
    },
    {
      q: "Which exercises are supported at launch?",
      a: "Beta launches with Squats, Push-ups, Deadlift, Lunges, and Plank. We add new exercises weekly based on what users request most."
    },
    {
      q: "How much does it cost?",
      a: "Free tier includes 3 AI coaching sessions per week — enough to experience the full product. Pro Coach is $9.99/month or $95.88/year. Waitlist members get 50% off their first year."
    },
  ];
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 px-5 bg-black">
      <div className="max-w-3xl mx-auto">
        <p className="text-[#39FF14] text-[9px] font-black tracking-[0.35em] uppercase mb-4">FAQ</p>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,2.8rem)] mb-4">
          Questions We'd<br /><span className="text-[#39FF14] italic">Ask Too.</span>
        </h2>
        <p className="text-white/65 text-sm leading-relaxed mb-12">
          No marketing language. Just straight answers.
        </p>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-white font-semibold text-[14px] leading-snug">{faq.q}</span>
                <svg className={`w-4 h-4 text-[#39FF14] flex-shrink-0 transition-transform ${open === i ? "rotate-45" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5 border-t border-white/8">
                  <p className="text-white/75 text-[13px] leading-relaxed pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ───────────────────────────────────────────────────────────────
function PricingSection({ onProClick }: { onProClick: () => void }) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const proMonthly = 9.99;
  const proAnnual = 95.88;
  const earlyMonthly = 4.99;
  const earlyAnnual = 47.88;
  const displayPrice = billing === "monthly" ? `$${earlyMonthly.toFixed(2)}` : `$${earlyAnnual.toFixed(2)}`;
  const strikePrice = billing === "monthly" ? `$${proMonthly.toFixed(2)}/mo` : `$${proAnnual.toFixed(2)}/yr`;
  const billingNote = billing === "monthly"
    ? "Billed monthly · Cancel anytime"
    : `Billed as $${earlyAnnual.toFixed(2)}/year · That's $${(earlyAnnual / 12).toFixed(2)}/month`;

  return (
    <section id="pricing" className="py-24 px-5 bg-[#030803] text-center">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#39FF14] text-[9px] font-black tracking-[0.35em] uppercase mb-4">Pricing</p>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,3rem)] mb-3">
          Simple, <span className="text-[#39FF14] italic">Honest</span> Pricing
        </h2>
        <p className="text-white/65 text-base max-w-lg mx-auto leading-relaxed mb-10">
          Start free. Upgrade when you're ready. No contracts, no hidden fees.
        </p>

        <div className="inline-flex items-center gap-1 bg-[#111] border border-white/10 rounded-full p-1 mb-12">
          <button onClick={() => setBilling("monthly")}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${billing === "monthly" ? "bg-[#39FF14] text-black" : "text-white/50 hover:text-white/80"}`}>
            Monthly
          </button>
          <button onClick={() => setBilling("annual")}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${billing === "annual" ? "bg-[#39FF14] text-black" : "text-white/50 hover:text-white/80"}`}>
            Annual
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${billing === "annual" ? "bg-black/20 text-black" : "bg-[#39FF14]/15 text-[#39FF14]"}`}>
              SAVE 20%
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* FREE */}
          <div className="bg-[#0d0d0d] border border-white/12 rounded-2xl p-7 text-left flex flex-col">
            <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Starter</p>
            <p className="text-white/50 text-[11px] uppercase tracking-wider mb-6">Free forever · No credit card</p>
            <div className="flex items-end gap-1 mb-7">
              <span className="text-5xl font-black text-white leading-none">$0</span>
            </div>
            <ul className="space-y-3 mb-5 flex-1">
              {[
                { label: "5 exercises", on: true },
                { label: "Rep counting", on: true },
                { label: "Form score after every session", on: true },
                { label: "3 coached sessions per week", on: true },
                { label: "7-day session history", on: true },
                { label: "Unlimited sessions", on: false },
                { label: "Full form history + progress graph", on: false },
                { label: "Personalised workout plans", on: false },
              ].map((f) => (
                <li key={f.label} className={`flex items-center gap-3 text-[13px] ${f.on ? "text-white/80" : "text-white/25 line-through"}`}>
                  <svg className={`w-4 h-4 flex-shrink-0 ${f.on ? "text-[#39FF14]" : "text-white/15"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  {f.label}
                </li>
              ))}
            </ul>
            <p className="text-white/35 text-[11px] leading-relaxed mb-6">
              3 free sessions per week is enough to experience real coaching before deciding to upgrade.
            </p>
            <button className="w-full border border-white/15 text-white/60 font-black text-[10px] py-3.5 rounded-lg uppercase tracking-[0.15em] hover:border-white/35 hover:text-white/85 transition-colors">
              Start Free — No Card Needed
            </button>
          </div>

          {/* PRO */}
          <div className="relative bg-[#071007] border-2 border-[#39FF14] rounded-2xl p-7 text-left flex flex-col"
            style={{ boxShadow: "0 0 40px rgba(57,255,20,0.1)" }}>
            <div className="absolute -top-3.5 right-5 bg-[#39FF14] text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em]">
              Most Popular
            </div>
            <p className="text-[#39FF14] font-black text-sm uppercase tracking-widest mb-1">Pro Coach</p>
            <p className="text-white/50 text-[11px] uppercase tracking-wider mb-4">The complete experience</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-white leading-none">{displayPrice}</span>
              <span className="text-white/40 text-sm mb-1">{billing === "monthly" ? "/mo" : "/yr"}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/35 text-[12px] line-through">{strikePrice}</span>
              <span className="bg-[#39FF14]/15 border border-[#39FF14]/30 text-[#39FF14] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                50% off · Early Access
              </span>
            </div>
            <p className="text-white/45 text-[11px] mb-1">{billingNote}</p>
            <p className="text-white/30 text-[10px] mb-6">⚡ Early access pricing · Limited availability</p>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Everything in Starter",
                "Unlimited coaching sessions",
                "Full form score history + progress graph",
                "Injury-prevention alerts",
                "Personalised workout plans",
                "Streak system + Coach David check-ins",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-[13px] text-white/90">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#39FF14]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={onProClick}
              className="w-full bg-[#39FF14] text-black font-black text-[10px] py-3.5 rounded-lg uppercase tracking-[0.15em] hover:brightness-110 active:scale-95 transition-all">
              Lock In Early Access Pricing
            </button>
          </div>
        </div>
        <p className="text-white/25 text-[11px] mt-8">
          All prices in USD · Cancel anytime · Annual plan billed once per year
        </p>
      </div>
    </section>
  );
}

// ─── BOTTOM CTA ────────────────────────────────────────────────────────────
function WaitlistCTASection() {
  return (
    <section className="py-24 px-5 bg-black text-center">
      <div className="max-w-2xl mx-auto">
        <span className="text-5xl mb-6 block">💪</span>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-5">
          Start Building<br /><span className="text-[#39FF14] italic">Your Record.</span>
        </h2>
        <p className="text-white/80 text-base leading-relaxed mb-3">
          Every session scored. Every improvement tracked. The data is yours — and it only exists if you start.
        </p>
        <p className="text-white/50 text-sm leading-relaxed mb-10">
          Early access members get 50% off their first year of Pro Coach. Standard pricing applies after launch.
        </p>
        <div className="flex justify-center mb-4">
          <WaitlistForm compact />
        </div>
        <p className="text-white/35 text-[11px] tracking-wider">
          No credit card · No spam · Cancel anytime
        </p>
      </div>
    </section>
  );
}

// ─── PRO MODAL ─────────────────────────────────────────────────────────────
function ProModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0d0d0d] border border-[#39FF14]/25 rounded-2xl p-8 max-w-sm w-full text-center relative"
        style={{ boxShadow: "0 0 50px rgba(57,255,20,0.1)" }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/25 hover:text-white/60 transition-colors" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="w-14 h-14 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/25 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-[#39FF14]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </div>
        <h3 className="font-montserrat font-black text-white uppercase text-xl tracking-wider mb-3">Coming Very Soon</h3>
        <p className="text-white/80 text-sm leading-relaxed mb-2">
          We're in private beta. Join the waitlist to secure early access pricing —
          <span className="text-[#39FF14] font-semibold"> 50% off your first year</span>.
        </p>
        <p className="text-white/50 text-[12px] leading-relaxed mb-6">
          Standard pricing applies once early access closes.
        </p>
        <div className="mb-4">
          <WaitlistForm compact />
        </div>
        <button onClick={onClose} className="text-white/25 text-[10px] uppercase tracking-wider hover:text-white/50 transition-colors">
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-black border-t border-white/8 py-12 px-5 text-center">
      <p className="font-montserrat font-black text-white text-[11px] tracking-[0.3em] uppercase mb-2">FitVision AI</p>
      <p className="text-white/30 text-[10px] mb-8">Engineered for performance.</p>
      <div className="flex flex-wrap items-center justify-center gap-8 mb-6">
        {["Terms", "Privacy", "Twitter", "Instagram"].map((link) => (
          <a key={link} href="#" className="text-white/30 hover:text-white/65 text-[10px] uppercase tracking-[0.2em] transition-colors">{link}</a>
        ))}
      </div>
      <p className="text-white/15 text-[9px] tracking-wider">© 2026 FitVision AI. All rights reserved.</p>
    </footer>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [showProModal, setShowProModal] = useState(false);
  const handleProClick = async () => {
    await logEvent("pro_click_intent", { tier: "pro_coach", price: 9.99, early_price: 4.99 });
    setShowProModal(true);
  };
  return (
    <div className="bg-black min-h-screen" style={{ fontFamily: "'Inter', 'Montserrat', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <WhyItWorksSection />
      <FormScoreSection />
      <SafetySection />
      <SocialProofSection />
      <FAQSection />
      <PricingSection onProClick={handleProClick} />
      <WaitlistCTASection />
      <Footer />
      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
    </div>
  );
}
