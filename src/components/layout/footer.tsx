import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  const linkClass =
    "text-[13.5px] font-medium text-ink-soft transition-colors hover:text-teal-deep";

  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo href="/" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              An anonymous multilingual peer-support chat for sensitive
              conversations.
            </p>
            <p className="mt-4 flex max-w-xs items-start gap-2 text-xs leading-relaxed text-ink-faint">
              <HeartHandshake className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              SafeSpeak is peer support — not medical care, therapy, or a
              crisis service.
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/#how" className={linkClass}>
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={linkClass}>
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/safety" className={linkClass}>
                  Safety
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
              Start
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/entry" className={linkClass}>
                  Talk anonymously
                </Link>
              </li>
              <li>
                <Link href="/language" className={linkClass}>
                  Choose a language
                </Link>
              </li>
              <li>
                <Link href="/safety" className={linkClass}>
                  Get help now
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 SafeSpeak · Hackathon MVP — frontend demo, no data leaves your
            browser.
          </p>
          <p className="font-mono tracking-tight">
            EN ↔ हिन्दी · anonymous by design
          </p>
        </div>
      </div>
    </footer>
  );
}
