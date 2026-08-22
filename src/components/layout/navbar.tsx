"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "How it works", href: "/#how" },
  { label: "Privacy", href: "/privacy" },
  { label: "Safety", href: "/safety" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        scrolled
          ? "border-line bg-paper/85 backdrop-blur-md shadow-[0_10px_30px_-24px_rgba(35,34,28,0.35)]"
          : "border-transparent bg-paper/60 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo href="/" />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isHowItWorks = link.href === "/#how";
            const active = !isHowItWorks && pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-md px-3.5 py-2 text-[13.5px] font-semibold tracking-tight transition-colors",
                  active
                    ? "bg-teal-wash text-teal-deep"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link href="/entry">
            <Button size="sm">
              Start a Safe Conversation
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-ink transition-colors hover:bg-ink/5 md:hidden cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer panel */}
      <div
        className={cn(
          "grid overflow-hidden border-line transition-all duration-300 md:hidden",
          open ? "grid-rows-[1fr] border-t bg-cream" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <nav className="flex flex-col gap-1 px-5 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-left text-[15px] font-semibold text-ink transition-colors hover:bg-teal-wash hover:text-teal-deep"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-line pt-4">
              <Link href="/entry" onClick={() => setOpen(false)}>
                <Button className="w-full">
                  Start a Safe Conversation
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
