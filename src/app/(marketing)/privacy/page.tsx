import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, EyeOff, FileMinus, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { PrivacySection } from "@/components/features/marketing/privacy-section";
import { NOT_CLAIMS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Privacy by Design — SafeSpeak",
  description:
    "Learn how SafeSpeak protects your identity with temporary IDs, session-only conversations, and zero personal data collection.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
      <Reveal className="max-w-2xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-deep">
          Privacy
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.015em] text-ink">
          Privacy <span className="squiggle">by design</span>
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-soft">
          SafeSpeak is built so you can share what matters without handing over
          who you are. Here is what that means in practice — stated plainly,
          without overpromising.
        </p>
      </Reveal>

      <Reveal className="mt-14" delay={80}>
        <PrivacySection index="P·01" icon={EyeOff} title="Anonymous identity">
          <p>
            Users do not need to reveal their real name or profile. You appear
            only as a temporary identity — for example,{" "}
            <span className="font-mono text-[13px] font-semibold text-teal-deep">
              #4821
            </span>{" "}
            — which exists only for the length of your session.
          </p>
        </PrivacySection>

        <PrivacySection
          index="P·02"
          icon={FileMinus}
          title="Minimal information"
        >
          <p>
            The MVP avoids asking for unnecessary personal information. No
            sign-up form, no date of birth, no contacts — just a language choice
            so the conversation can be translated.
          </p>
        </PrivacySection>

        <PrivacySection index="P·03" icon={Lock} title="Private conversations">
          <p>
            Users interact through temporary anonymous identities in 1-to-1
            conversations. When you leave, the thread and the identity are
            closed — there is no history to browse and no profile to find.
          </p>
        </PrivacySection>

        <PrivacySection index="P·04" icon={ShieldCheck} title="Safety">
          <p>
            Messages may be checked for harmful or abusive content so SafeSpeak
            can offer safety responses — a supportive prompt, a respect
            reminder, or a warning label. This check exists to protect people,
            not to profile them.
          </p>
        </PrivacySection>
      </Reveal>

      <Reveal className="mt-12 max-w-2xl" delay={100}>
        <div className="rounded-xl border border-line bg-cream p-6 sm:p-7">
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
            What we won&rsquo;t claim
          </h2>
          <ul className="mt-4 space-y-2.5">
            {NOT_CLAIMS.map((c) => (
              <li
                key={c}
                className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-soft"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-teal/60" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-dashed border-line pt-4 text-[12px] leading-relaxed text-ink-faint">
            This is a hackathon MVP running entirely in your browser — nothing
            you write here is transmitted or stored anywhere.
          </p>
        </div>
      </Reveal>

      <Reveal
        className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
        delay={120}
      >
        <Link href="/entry">
          <Button size="lg">
            Start anonymously
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </Button>
        </Link>
        <p className="font-mono text-[11.5px] text-ink-faint">
          No account · No name · English ↔ हिन्दी
        </p>
      </Reveal>
    </main>
  );
}
