import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, Menu, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/scan", label: "Scan" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const activeTo =
    NAV_ITEMS.find((item) => (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)))
      ?.to ?? "/";

  useLayoutEffect(() => {
    const updatePill = () => {
      const container = navRef.current;
      const activeEl = linkRefs.current[activeTo];
      if (!container || !activeEl) return;
      const cRect = container.getBoundingClientRect();
      const aRect = activeEl.getBoundingClientRect();
      setPill({ left: aRect.left - cRect.left, width: aRect.width, ready: true });
    };
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [activeTo]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="ewa-no-print sticky top-4 z-40 mx-auto w-full max-w-[920px] px-4">
      <nav
        aria-label="Primary navigation"
        className="ewa-glass-nav flex items-center justify-between rounded-full px-4 py-2 sm:px-5"
      >
        <Link
          to="/"
          className="relative z-10 flex min-h-[44px] items-center gap-2 rounded-full px-1 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            Eco Waste Wise
          </span>
        </Link>

        {/* Desktop sliding pill links */}
        <div ref={navRef} className="relative z-10 hidden items-center gap-1 sm:flex">
          {pill.ready && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ left: `${pill.left}px`, width: `${pill.width}px` }}
            />
          )}
          {NAV_ITEMS.map((item) => {
            const isActive = item.to === activeTo;
            return (
              <Link
                key={item.to}
                to={item.to}
                ref={(el) => {
                  linkRefs.current[item.to] = el;
                }}
                className={`relative z-10 flex min-h-[44px] items-center rounded-full px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile glass dropdown sheet */}
      {mobileOpen && (
        <div className="ewa-glass-nav ewa-animate-in mt-2 rounded-2xl p-2 sm:hidden">
          <div className="relative z-10 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.to === activeTo;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex min-h-[44px] items-center rounded-xl px-4 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}