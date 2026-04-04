import { useState } from "react";

import { supabase } from "@/lib/supabase";

async function logEvent(eventType: string, metadata?: Record<string, unknown>) {
  try {
    await supabase.from("events").insert({ event_type: eventType, metadata });
  } catch {}
}

async function submitEmail(email: string): Promise<{ discountCode: string; alreadyRegistered: boolean } | null> {
  try {
    const { error } = await supabase.from("waitlist").insert({ email });
    if (error) {
      console.error("Supabase error:", error); // ADD THIS
      if (error.code === "23505") return { discountCode: "", alreadyRegistered: true };
      return null;
    }
    return { discountCode: "", alreadyRegistered: false };
  } catch (e) {
    console.error("Caught error:", e); // ADD THIS
    return null;
  }
}
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-black/95 backdrop-blur-sm border-b border-white/5">
      <span className="font-montserrat font-black text-white text-xs tracking-[0.25em] uppercase">FitVision AI</span>
      <div className="hidden md:flex items-center gap-8">
        {["How It Works", "About", "FAQ", "Pricing"].map((item) => (
          <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-white/50 hover:text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors">
            {item}
          </a>
        ))}
      </div>
      <a href="#waitlist"
        className="hidden md:inline-flex bg-[#39FF14] text-black font-black text-[10px] px-5 py-2.5 rounded tracking-[0.15em] uppercase hover:brightness-110 transition-all">
        Join Waitlist
      </a>
      <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-b border-white/10 flex flex-col items-center gap-5 py-6 md:hidden">
          {["How It Works", "About", "FAQ", "Pricing"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase"
              onClick={() => setMenuOpen(false)}>{item}</a>
          ))}
          <a href="#waitlist"
            className="bg-[#39FF14] text-black font-black text-[10px] px-5 py-2.5 rounded tracking-[0.15em] uppercase"
            onClick={() => setMenuOpen(false)}>Join Waitlist</a>
        </div>
      )}
    </nav>
  );
}

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
    if (!result) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }
    await logEvent("waitlist_signup", { email });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className={`bg-[#0a1a0a] border border-[#39FF14]/40 rounded-xl px-5 py-4 text-left ${compact ? "max-w-md" : "w-full max-w-lg"}`}>
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#39FF14] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="black" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <p className="text-[#39FF14] font-black text-sm uppercase tracking-wider">You're on the list!</p>
            <p className="text-white/50 text-[11px] mt-0.5">We'll notify you the moment we launch. 🚀</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "w-full max-w-md" : "w-full max-w-lg"}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="email" required placeholder="Enter your email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white/8 border border-white/15 text-white placeholder-white/25 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-[#39FF14]/50 transition-colors"
        />
        <button type="submit" disabled={loading}
          className="bg-[#39FF14] text-black font-black text-[10px] px-6 py-3.5 rounded-lg uppercase tracking-[0.1em] hover:brightness-110 active:scale-95 transition-all whitespace-nowrap disabled:opacity-60">
          {loading ? "Joining..." : "Join the Waitlist"}
        </button>
      </form>
      {error && <p className="text-[#FF3131] text-[11px] mt-2">{error}</p>}
    </div>
  );
}

const VIDEO_SRC = `${import.meta.env.BASE_URL}fitvision-demo.mp4`;

function VideoPlayer() {
  const [hasError, setHasError] = useState(false);
  const pts: [number, number][] = [[50,15],[50,30],[37,36],[63,36],[30,50],[70,50],[38,63],[62,63],[40,80],[60,80]];
  const lines: [number,number][] = [[0,1],[1,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9]];
  return (
    <div className="relative aspect-video bg-[#080808] flex items-center justify-center overflow-hidden">
      {!hasError ? (
        <video
          src={VIDEO_SRC}
          autoPlay muted loop playsInline
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-6">
          <svg viewBox="0 0 100 100" className="w-28 h-28 mb-3">
            {lines.map(([a, b], i) => (
              <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]}
                stroke="#39FF14" strokeWidth="1" strokeOpacity="0.6" />
            ))}
            {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill="#39FF14" fillOpacity="0.9" />)}
            <text x="54" y="53" fill="#39FF14" fontSize="7" fontWeight="bold">85°</text>
          </svg>
          <p className="text-white/30 text-xs text-center max-w-[200px]">AI tracking demo · Live in beta</p>
        </div>
      )}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-10 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050f05 0%, #000000 55%)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(57,255,20,0.09) 0%, transparent 70%)" }} />
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl">
        <div className="inline-flex items-center gap-2 border border-[#39FF14]/40 rounded-full px-4 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse flex-shrink-0" />
          <span className="text-[#39FF14] text-[9px] font-black tracking-[0.3em] uppercase">Beta Access Now Live</span>
        </div>
        <h1 className="font-montserrat font-black text-white uppercase leading-[0.93] mb-6">
          <span className="block text-[clamp(2.2rem,8vw,4.8rem)]">Your AI Gym Coach</span>
          <span className="block text-[clamp(2.2rem,8vw,4.8rem)]">Watches Your Form</span>
          <span className="block text-[clamp(2.2rem,8vw,4.8rem)] text-[#39FF14] italic">In Real Time.</span>
        </h1>
        <p className="text-white/80 text-sm md:text-base max-w-xl leading-relaxed mb-10">
          Point your phone camera. Our AI instantly tracks 33 body landmarks, spots bad form, and talks you through every rep — like a world-class coach in your pocket.
        </p>

        <div className="w-full max-w-2xl mb-10">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]"
            style={{ boxShadow: "0 0 60px rgba(57,255,20,0.08)" }}>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-black/80 border-b border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              <span className="text-[#39FF14] text-[9px] font-black tracking-widest uppercase">Live Demo</span>
              <span className="ml-auto text-white/20 text-[9px]">AI Coaching · Real Time</span>
            </div>
            <VideoPlayer />
          </div>
        </div>

        <div id="waitlist" className="flex flex-col items-center gap-3 w-full">
          <WaitlistForm />
          <p className="text-white/25 text-[10px] tracking-wider">No credit card. No spam. Just early access.</p>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Prop It Up",
      desc: "Place your phone on any surface or tripod aimed at you. No wearables, no special equipment.",
      img: "/img-panel1.png",
    },
    {
      num: "02",
      title: "AI Sees You",
      desc: "Our computer vision instantly maps 33 body landmarks and tracks every movement in real time.",
      img: "/img-panel2.png",
    },
    {
      num: "03",
      title: "Live Voice Coaching",
      desc: "Hear instant cues: \"Back straight!\", \"Go deeper!\", \"Great rep!\" — as you're moving.",
      img: "/img-panel3.png",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-5 bg-[#030803]">
      <div className="max-w-5xl mx-auto">
        <p className="text-[#39FF14] text-[9px] font-black tracking-[0.35em] uppercase mb-3">How It Works</p>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-2">
          Three Steps.<br />
          <span className="text-[#39FF14] italic">Zero Guesswork.</span>
        </h2>
        <div className="w-12 h-0.5 bg-[#39FF14] mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/8 bg-[#0a0a0a] mb-4">
                <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent px-4 py-3">
                  <span className="text-[#39FF14] font-mono font-black text-xs">{s.num}</span>
                </div>
              </div>
              <h3 className="text-white font-black uppercase text-sm tracking-[0.1em] mb-1">{s.title}</h3>
              <p className="text-white/75 text-[12px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SafetySection() {
  return (
    <section id="safety" className="py-16 px-5 bg-black">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 md:gap-16 items-center">
        <div className="flex-1 order-2 md:order-1">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-3.5 h-3.5 text-[#FF3131] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 7v6c0 4.418 3.582 8 8 9 4.418-1 8-4.582 8-9V7l-8-5z"/>
            </svg>
            <span className="text-[#FF3131] text-[9px] font-black tracking-[0.3em] uppercase">Injury Prevention</span>
          </div>
          <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.6rem,4vw,2.6rem)] leading-[0.95] mb-5">
            Safety First: The <span className="text-[#FF3131] italic">Injury-Proof</span> Algorithm
          </h2>
          <p className="text-white/80 text-[13px] leading-relaxed mb-6 max-w-md">
            FitVision AI monitors high-risk zones — spine neutrality, knee tracking, hip alignment — and alerts you the moment something looks wrong. Before injuries happen.
          </p>
          <div className="space-y-3">
            {[
              { color: "text-[#FF3131]", label: "Spine Neutrality Monitoring" },
              { color: "text-[#39FF14]", label: "Joint Stacking Analysis" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${f.color === "text-[#FF3131]" ? "bg-[#FF3131]" : "bg-[#39FF14]"}`} />
                <span className={`${f.color} text-[10px] font-black tracking-[0.2em] uppercase`}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 w-full max-w-[240px] mx-auto md:mx-0 order-1 md:order-2">
          <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-[#FF3131]/50"
            style={{ boxShadow: "0 0 30px rgba(255,49,49,0.2)" }}>
            <img src="/img-safety.png" alt="Safety detection" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#FF3131]/10" />
            <div className="absolute bottom-4 left-3 right-3">
              <div className="bg-black/85 border border-[#FF3131] rounded-lg px-4 py-3 text-center"
                style={{ boxShadow: "0 0 15px rgba(255,49,49,0.3)" }}>
                <p className="text-[#FF3131] text-[10px] font-black tracking-[0.15em] uppercase animate-pulse">
                  ⚠ Back Rounding Detected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section id="about" className="py-20 px-5 bg-[#030803] border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#FF3131] text-[9px] font-black tracking-[0.35em] uppercase mb-3">The Problem</p>
            <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-5">
              Most People Train<br />
              <span className="text-[#FF3131] italic">Completely Blind.</span>
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
              You go to the gym. You do your reps. But nobody's watching. Nobody's correcting you. 
              Bad form builds up over months until something snaps — a knee, a lower back, a shoulder. 
              Personal trainers cost $50–150 per session. Most people just guess.
            </p>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              FitVision AI is what happens when you give everyone access to a world-class eye. 
              Always watching. Always coaching. Never judging.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {[
              {
                stat: "$75–150",
                label: "Average cost per PT session",
                color: "text-[#FF3131]",
                border: "border-[#FF3131]/20",
                bg: "bg-[#FF3131]/5",
                desc: "Most people can't afford consistent access to a real coach.",
              },
              {
                stat: "82%",
                label: "Gym-goers with no form feedback",
                color: "text-[#FF3131]",
                border: "border-[#FF3131]/20",
                bg: "bg-[#FF3131]/5",
                desc: "Training without feedback is how preventable injuries happen.",
              },
              {
                stat: "< 50ms",
                label: "FitVision AI response time",
                color: "text-[#39FF14]",
                border: "border-[#39FF14]/20",
                bg: "bg-[#39FF14]/5",
                desc: "Real-time coaching that catches mistakes before they become injuries.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`${item.bg} border ${item.border} rounded-xl px-5 py-4 flex items-start gap-4`}
              >
                <p className={`${item.color} font-mono font-black text-2xl leading-none flex-shrink-0 pt-0.5`}>
                  {item.stat}
                </p>
                <div>
                  <p className="text-white font-bold text-[11px] uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-white/60 text-[11px] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProofSection() {
  return (
    <section className="py-16 px-5 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#39FF14] text-[9px] font-black tracking-[0.35em] uppercase mb-3">Early Reactions</p>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.6rem,4vw,2.4rem)] mb-10">
          What Early Testers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              quote: "I've been doing squats wrong for 2 years. The AI caught it in 3 seconds.",
              name: "Chidi O.",
              role: "Gym Enthusiast · Lagos",
            },
            {
              quote: "It's like having a PT in your pocket. I can't believe this is real and it's this affordable.",
              name: "Amara K.",
              role: "Fitness Coach · Abuja",
            },
            {
              quote: "The injury detection alone is worth it. My knee pain is finally gone.",
              name: "Tunde A.",
              role: "Powerlifter · Port Harcourt",
            },
          ].map((t) => (
            <div key={t.name} className="bg-[#0a0a0a] border border-white/8 rounded-xl p-5 text-left">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-[#39FF14]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-white/85 text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <p className="text-white font-bold text-[11px]">{t.name}</p>
              <p className="text-white/30 text-[10px]">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "Do I need any special equipment?",
      a: "Nope. Just your smartphone. Prop it on any surface, a chair, a water bottle, anything. No wearables, no sensors, no gym hardware.",
    },
    {
      q: "How does the AI actually see me?",
      a: "We use advanced computer vision (MediaPipe) that runs directly on your device. Your camera feed is processed locally — nothing is uploaded to a server.",
    },
    {
      q: "Which exercises does it support?",
      a: "At launch: squats, deadlifts, push-ups, lunges, and rows. We're adding more every week based on early user feedback.",
    },
    {
      q: "Will it work indoors with bad lighting?",
      a: "Yes. The AI is trained to work in typical indoor gym and home lighting conditions. Darker environments may reduce accuracy slightly.",
    },
    {
      q: "When does it launch?",
      a: "We're targeting a beta launch in Q2 2026. Join the waitlist to be first in line and get launch-day pricing.",
    },
    {
      q: "Is it really built in Nigeria?",
      a: "100%. Built in Lagos by Nigerian developers. We're proud of that — and we think it gives us a unique perspective on building affordable, accessible fitness tech.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-5 bg-[#030803]">
      <div className="max-w-3xl mx-auto">
        <p className="text-[#39FF14] text-[9px] font-black tracking-[0.35em] uppercase mb-3">FAQ</p>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,2.8rem)] mb-10">
          Obvious Questions,<br />
          <span className="text-[#39FF14] italic">Honest Answers.</span>
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i}
              className="bg-[#0a0a0a] border border-white/8 rounded-xl overflow-hidden transition-all">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-white font-semibold text-[13px] pr-4">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-[#39FF14] flex-shrink-0 transition-transform ${open === i ? "rotate-45" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-4 border-t border-white/5">
                  <p className="text-white/80 text-[13px] leading-relaxed pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ onProClick }: { onProClick: () => void }) {
  return (
    <section id="pricing" className="py-20 px-5 bg-black text-center">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#39FF14] text-[9px] font-black tracking-[0.35em] uppercase mb-3">Pricing</p>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,3rem)] mb-2">
          Simple, <span className="text-[#39FF14] italic">Honest</span> Pricing
        </h2>
        <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-12">Performance shouldn't be a luxury.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-7 text-left flex flex-col">
            <p className="text-white font-black text-sm uppercase tracking-widest mb-0.5">Starter</p>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-5">Core tracking features</p>
            <div className="flex items-end gap-1 mb-7">
              <span className="text-5xl font-black text-white leading-none">$0</span>
            </div>
            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                { label: "Basic Rep Counting", on: true },
                { label: "Summary Report", on: true },
                { label: "Real-Time Voice Coaching", on: false },
              ].map((f) => (
                <li key={f.label} className={`flex items-center gap-2.5 text-[13px] ${f.on ? "text-white/70" : "text-white/20 line-through"}`}>
                  <svg className={`w-4 h-4 flex-shrink-0 ${f.on ? "text-[#39FF14]" : "text-white/15"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  {f.label}
                </li>
              ))}
            </ul>
            <button className="w-full border border-white/15 text-white/50 font-black text-[10px] py-3.5 rounded-lg uppercase tracking-[0.15em] hover:border-white/30 hover:text-white/80 transition-colors">
              Start Tracking Free
            </button>
          </div>
          <div className="relative bg-[#071007] border-2 border-[#39FF14] rounded-2xl p-7 text-left flex flex-col"
            style={{ boxShadow: "0 0 30px rgba(57,255,20,0.12)" }}>
            <div className="absolute -top-3.5 right-5 bg-[#39FF14] text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em]">
              Most Popular
            </div>
            <p className="text-[#39FF14] font-black text-sm uppercase tracking-widest mb-0.5">Pro Coach</p>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-5">The complete AI experience</p>
            <div className="flex items-end gap-1.5 mb-7">
              <span className="text-5xl font-black text-white leading-none">$14.99</span>
              <span className="text-white/30 text-sm mb-1">/mo</span>
            </div>
            <ul className="space-y-2.5 mb-8 flex-1">
              {["All Starter Features", "Real-Time Voice Coaching", "Injury-Prevention Alerts", "Personalized AI Plans"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[13px] text-white">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#39FF14]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={onProClick}
              className="w-full bg-[#39FF14] text-black font-black text-[10px] py-3.5 rounded-lg uppercase tracking-[0.15em] hover:brightness-110 active:scale-95 transition-all">
              Subscribe for Live Coaching
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function WaitlistCTASection() {
  return (
    <section className="py-20 px-5 bg-[#030803] text-center">
      <div className="max-w-2xl mx-auto">
        <span className="text-4xl mb-4 block">💪</span>
        <h2 className="font-montserrat font-black text-white uppercase text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-4">
          Ready to Train<br />
          <span className="text-[#39FF14] italic">Smarter?</span>
        </h2>
        <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
          Join hundreds of early users already on the waitlist. Be first to access FitVision AI when we launch.
        </p>
        <div className="flex justify-center">
          <WaitlistForm compact />
        </div>
        <p className="text-white/25 text-[10px] tracking-wider mt-3">No credit card. No spam. Just early access.</p>
      </div>
    </section>
  );
}

function ProModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0d0d0d] border border-[#39FF14]/25 rounded-2xl p-8 max-w-sm w-full text-center relative"
        style={{ boxShadow: "0 0 40px rgba(57,255,20,0.1)" }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/20 hover:text-white/60 transition-colors" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="w-14 h-14 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/25 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-[#39FF14]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </div>
        <h3 className="font-montserrat font-black text-white uppercase text-xl tracking-wider mb-3">Coming Soon</h3>
        <p className="text-white/80 text-sm leading-relaxed mb-7">
          We're perfecting the live-voice feature in private beta. You're noted as interested and will be <span className="text-[#39FF14] font-semibold">first in line</span> for Pro.
        </p>
        <button onClick={onClose}
          className="w-full bg-[#39FF14] text-black font-black text-[10px] py-3.5 rounded-lg uppercase tracking-[0.15em] hover:brightness-110 transition-all">
          Got It, I'll Wait!
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-10 px-5 text-center">
      <p className="font-montserrat font-black text-white text-[11px] tracking-[0.3em] uppercase mb-2">FitVision AI</p>
      <p className="text-white/25 text-[10px] mb-5">Built with 🇳🇬 in Lagos, Nigeria</p>
      <div className="flex flex-wrap items-center justify-center gap-6 mb-5">
        {["Terms", "Privacy", "Twitter", "Instagram"].map((link) => (
          <a key={link} href="#" className="text-white/25 hover:text-white/60 text-[9px] uppercase tracking-[0.2em] transition-colors">{link}</a>
        ))}
      </div>
      <p className="text-white/15 text-[9px] tracking-wider">© 2026 FitVision AI. Engineered for performance.</p>
    </footer>
  );
}

export default function LandingPage() {
  const [showProModal, setShowProModal] = useState(false);

  const handleProClick = async () => {
    await logEvent("pro_click_intent", { tier: "pro_coach", price: 14.99 });
    setShowProModal(true);
  };

  return (
    <div className="bg-black min-h-screen" style={{ fontFamily: "'Inter', 'Montserrat', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <SafetySection />
      <WhySection />
      <SocialProofSection />
      <FAQSection />
      <PricingSection onProClick={handleProClick} />
      <WaitlistCTASection />
      <Footer />
      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
    </div>
  );
}
