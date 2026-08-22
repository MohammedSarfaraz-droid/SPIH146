import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  HeartPulse,
  LifeBuoy,
  MessagesSquare,
  PhoneCall,
  ShieldAlert,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { PrivacySection } from "@/components/features/marketing/privacy-section";
import { getHelplines } from "@/lib/api";

export const metadata: Metadata = {
  title: "Safety & Helpline Directory — SafeSpeak",
  description:
    "Explore SafeSpeak's safety layer: crisis intercept protocols, respect filters, harmful advice warnings, and 24/7 verified crisis helplines.",
};

export default async function SafetyPage() {
  const helplines = await getHelplines();

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-deep">
          Safety
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.015em] text-ink">
          A calm <span className="text-teal-deep">safety layer</span>
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-soft">
          Sensitive conversations deserve a guardrail. SafeSpeak watches for a
          few clearly harmful patterns and responds gently — without turning
          the space red, and without judging the person behind the words.
        </p>
      </Reveal>

      <Reveal className="mt-14" delay={80}>
        <PrivacySection index="S·01" icon={LifeBuoy} title="Crisis support">
          <p>
            When language suggests self-harm or a crisis, SafeSpeak pauses the
            flow with a supportive message and offers real helplines — KIRAN,
            iCall and 988 — plus a reminder to reach someone you trust.
          </p>
        </PrivacySection>

        <PrivacySection
          index="S·02"
          icon={ShieldAlert}
          title="Respect moderation"
        >
          <p>
            Abusive or bullying language is intercepted with a simple reminder:{" "}
            <em className="font-semibold not-italic text-ink">
              &ldquo;Let&rsquo;s keep this conversation respectful.&rdquo;
            </em>{" "}
            The message is not delivered, keeping the space safe for both sides.
          </p>
        </PrivacySection>

        <PrivacySection
          index="S·03"
          icon={TriangleAlert}
          title="Harmful advice flags"
        >
          <p>
            Clearly dangerous health advice — like telling someone to stop
            prescribed medication — is labelled so both people can treat it
            with care. SafeSpeak never offers medical guidance of its own.
          </p>
        </PrivacySection>
      </Reveal>

      <Reveal className="mt-12 grid gap-4 lg:grid-cols-2" delay={100}>
        <div className="rounded-xl border border-line bg-cream p-6 sm:p-7">
          <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink">
            <Stethoscope className="h-5 w-5 text-teal" strokeWidth={1.8} />
            What SafeSpeak is not
          </h2>
          <ul className="mt-4 space-y-2.5 text-[13.5px] leading-relaxed text-ink-soft">
            <li className="flex items-start gap-2.5">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-warm" />
              Not an AI therapist or a diagnosis platform.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-warm" />
              Not a replacement for professional healthcare.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-warm" />
              Not an emergency service — in danger, call local emergency numbers.
            </li>
          </ul>
          <p className="mt-5 flex items-start gap-2 border-t border-dashed border-line pt-4 text-[13px] leading-relaxed text-ink-soft">
            <MessagesSquare className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
            It is one thing only: an anonymous multilingual peer-support chat
            for sensitive conversations.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl bg-dark text-cream">
          <div className="p-6 sm:p-7">
            <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
              <PhoneCall className="h-5 w-5 text-teal-tint" strokeWidth={1.8} />
              If you need help right now
            </h2>
            <ul className="mt-4 divide-y divide-dark-line">
              {helplines.map((h) => (
                <li
                  key={h.name}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="flex items-center gap-2 text-[13.5px] font-bold tracking-tight">
                      <HeartPulse className="h-3.5 w-3.5 text-teal-tint/70" />
                      {h.name}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-cream/55">
                      {h.detail}
                    </p>
                  </div>
                  <p className="shrink-0 font-mono text-[12px] font-semibold text-teal-tint">
                    {h.contact}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11.5px] leading-relaxed text-cream/50">
              In this design demo, detection uses simple keyword matching. A
              production version would use a proper classifier with human
              review.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal
        className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
        delay={120}
      >
        <Link href="/entry">
          <Button size="lg">
            Try the conversation demo
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </Button>
        </Link>
        <p className="font-mono text-[11.5px] text-ink-faint">
          Anonymous · English ↔ हिन्दी · safety layer included
        </p>
      </Reveal>
    </main>
  );
}
