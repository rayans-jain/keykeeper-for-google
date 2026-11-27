import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="ewa-no-print border-t border-border bg-secondary/50 pt-10 pb-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-semibold text-foreground"><Leaf className="h-6 w-6 text-primary" />Eco Waste Wise</Link>
            <p className="mt-3 text-sm text-muted-foreground">Less waste. More possibility.</p>
            <Button asChild variant="link" className="mt-3 h-auto px-0 text-primary"><Link to="/scan">Scan a photo <ArrowUpRight /></Link></Button>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase text-muted-foreground">Explore</h2>
            <div className="mt-3 flex flex-col items-start gap-3 text-sm">
              <Link to="/scan" className="hover:text-primary">Scanner</Link>
              <Link to="/history" className="hover:text-primary">Your reports</Link>
              <Link to="/about" className="hover:text-primary">Our objectives</Link>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase text-muted-foreground">Sort responsibly</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Follow local collection rules. Keep medical waste separate.</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row">
          <p>© Eco Waste Wise</p>
          <p>Photo-based guidance · History saved in your browser</p>
        </div>
      </div>
    </footer>
  );
}
