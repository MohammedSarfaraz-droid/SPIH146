import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  EyeOff,
  Languages,
  Lock,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { HeroCard } from "@/components/features/marketing/hero-card";
import { BARRIERS } from "@/lib/mock-data";

const TRUST_POINTS = [
  {
    icon: EyeOff,
    title: "Anonymous",
    text: "Your identity stays private.",
  },
  {
    icon: Languages,
    title: "Multilingual",
    text: "Communicate in your preferred language.",
  },
  {
    icon: ShieldCheck,
    title: "Safety-aware",
    text: "Concerning content can trigger safety guidance.",
  },
];

const STEPS = [
  {
    n: "01",
    icon: EyeOff,
    title: "Enter anonymously",
    text: "You get a temporary identity — like Anonymous #4821. No name, no photo, no account.",
  },
  {
    n: "02",
    icon: Languages,
    title: "Choose your language",
    text: "Pick the language you think in. English or हिन्दी for this release.",
  },
  {
    n: "03",
    icon: MessagesSquare,
    title: "Start a private conversation",
    text: "We connect you 1-to-1 with an anonymous peer. Messages are translated automatically.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-20">
          <div className="fade-up lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-deep">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
              Anonymous peer support · EN ↔ हिन्दी
            </p>

            <h1 className="mt-6 font-display text-[clamp(2.35rem,5.6vw,4rem)] font-bold leading-[1.04] tracking-[-0.02em] text-ink">
              Talk about what you&rsquo;re going through.
              <span className="mt-2 block text-teal-deep">
                Without revealing{" "}
                <span className="squiggle whitespace-nowrap">who you are.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-ink-soft">
              SafeSpeak lets you have anonymous conversations about sensitive
              health concerns while communicating in the language you&rsquo;re
              most comfortable with.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/entry">
                <Button size="lg">
                  Start a Safe Conversation
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                </Button>
              </Link>
              <Link href="/#how">
                <Button size="lg" variant="secondary">
                  How it works
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              {[
                { icon: Lock, label: "No sign-up" },
                { icon: EyeOff, label: "No name required" },
                { icon: Languages, label: "Auto-translated" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 font-mono text-[11.5px] font-medium text-ink-faint"
                >
                  <Icon className="h-3.5 w-3.5 text-teal" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="fade-up lg:col-span-6"
            style={{ animationDelay: "0.15s" }}
          >
            <HeroCard />
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="border-y border-line bg-cream">
        <Reveal
          stagger
          className="mx-auto grid max-w-6xl divide-y divide-line px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8"
        >
          {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="reveal-child flex items-start gap-4 py-7 sm:px-6 sm:first:pl-0"
            >
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-teal"
                strokeWidth={1.8}
              />
              <div>
                <h3 className="font-display text-[15.5px] font-semibold tracking-tight text-ink">
                  {title}
                </h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                The flow
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold leading-tight tracking-[-0.015em] text-ink">
                How SafeSpeak works
              </h2>
            </div>
            <p className="max-w-xs text-[13.5px] leading-relaxed text-ink-soft md:text-right">
              Three quiet steps between you and a conversation that matters.
            </p>
          </Reveal>

          <div className="relative mt-12">
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-[26px] hidden border-t border-dashed border-line-strong md:block"
            />
            <Reveal
              stagger
              className="relative grid gap-10 md:grid-cols-3 md:gap-8"
            >
              {STEPS.map((s) => (
                <div key={s.n} className="reveal-child group">
                  <div className="flex items-center gap-4">
                    <span className="relative z-10 bg-paper pr-1 font-display text-[44px] font-bold leading-none tracking-tight text-teal/30 transition-colors duration-300 group-hover:text-teal md:text-[52px]">
                      {s.n}
                    </span>
                    <s.icon className="h-5 w-5 text-teal" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-ink-soft">
                    {s.text}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ WHY ============ */}
      <section className="border-t border-line bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-6">
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.015em] text-ink">
              &ldquo;Some conversations are{" "}
              <span className="text-teal-deep">difficult to start.</span>&rdquo;
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:pt-2" delay={120}>
            <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
              Fear of judgment, privacy concerns and language barriers can make
              people hesitate to talk about what they&rsquo;re going through.
              SafeSpeak provides a simple anonymous space to start that
              conversation.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {BARRIERS.map((b) => (
                <li
                  key={b}
                  className="rounded-full border border-line bg-paper px-3.5 py-1.5 font-mono text-[11.5px] font-medium text-ink-soft transition-colors hover:border-teal hover:text-teal-deep"
                >
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/safety"
              className="group mt-8 inline-flex items-center gap-2 text-[13.5px] font-bold tracking-tight text-teal-deep transition-colors hover:text-teal"
            >
              See how the safety layer works
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="relative overflow-hidden bg-dark text-cream">
        <svg
          aria-hidden="true"
          className="spin-slow pointer-events-none absolute -right-20 -top-24 h-[420px] w-[420px] text-dark-line"
          viewBox="0 0 100 100"
          fill="none"
        >
          {[20, 30, 40, 48].map((r) => (
            <circle
              key={r}
              cx="50"
              cy="50"
              r={r}
              stroke="currentColor"
              strokeWidth="0.4"
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_20%_50%,rgba(46,107,94,0.22),transparent_70%)]" />

        <Reveal className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-tint/80">
              Privacy first
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.1rem)] font-bold leading-[1.06] tracking-[-0.015em]">
              Start without sharing
              <span className="block text-teal-tint">your identity.</span>
            </h2>
            <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-cream/65">
              No account. No name. Just a private conversation in the language
              you think in — with someone who listens.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Link href="/entry">
              <Button size="lg">
                Start anonymously
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </Button>
            </Link>
            <p className="font-mono text-[11.5px] text-cream/50">
              Takes less than a minute · English ↔ हिन्दी
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
