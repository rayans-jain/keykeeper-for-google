import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ScanLine, History, Info, Leaf, Moon, Sun } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/scan", label: "Scan", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
  { to: "/about", label: "About", icon: Info },
] as const;

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let preferred = window.matchMedia("(prefers-color-scheme: dark)").matches;
    try {
      const stored = localStorage.getItem("ewa_theme");
      if (stored) preferred = stored === "dark";
    } catch { /* storage unavailable */ }
    setDark(preferred);
    document.documentElement.classList.toggle("dark", preferred);
  }, []);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("ewa_theme", next ? "dark" : "light"); }
    catch { /* storage unavailable */ }
  };
  return (
    <div className="bottom-dock ewa-no-print">
      <nav aria-label="Primary navigation" className="ewa-glass-nav flex items-center gap-1 rounded-full p-2 text-foreground sm:gap-2 sm:px-3">
        <Link to="/" aria-label="Eco Waste Wise home" title="Eco Waste Wise" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden h-11 w-11 shrink-0 rounded-full text-primary sm:flex")}>
          <Leaf aria-hidden="true" />
        </Link>
        <div className="grid min-w-0 flex-1 grid-cols-4 gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link key={to} to={to} aria-current={active ? "page" : undefined} title={label} className={cn(buttonVariants({ variant: active ? "default" : "ghost" }), "h-12 min-w-0 flex-col gap-1 rounded-full px-1 text-[10px] sm:h-11 sm:flex-row sm:gap-2 sm:text-sm")}>
                <Icon aria-hidden="true" /><span>{label}</span>
              </Link>
            );
          })}
        </div>
        <span className="mx-1 h-7 border-l border-border" aria-hidden="true" />
        <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0 rounded-full" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}>
          {dark ? <Sun /> : <Moon />}
        </Button>
      </nav>
    </div>
  );
}
