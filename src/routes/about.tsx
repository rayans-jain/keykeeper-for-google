import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Cpu,
  Eye,
  FlaskConical,
  Globe2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Eco Waste Wise" },
      {
        name: "description",
        content:
          "Learn how Eco Waste Wise combines vision, a valuable-item smart filter, scientific material analysis, and DIY reuse videos.",
      },
      { property: "og:title", content: "About — Eco Waste Wise" },
      {
        property: "og:description",
        content: "Our mission, four-stage analysis pipeline, and roadmap for smarter waste sorting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const SOLUTION_PILLARS = [
  {
    icon: Eye,
    title: "Vision",
    body: "Recognizes everyday objects, packaging, and surface condition from a single mobile or desktop photo.",
  },
  {
    icon: ShieldCheck,
    title: "Smart Filter",
    body: "Stops immediately when an item looks like a valuable—phones, keys, cards, documents, or working electronics.",
  },
  {
    icon: FlaskConical,
    title: "Scientific Analysis",
    body: "Scores recyclability, reusability, and eco-safety while highlighting contamination risks and prep steps.",
  },
  {
    icon: Sparkles,
    title: "Action",
    body: "Pairs clear bin guidance with real YouTube DIY tutorials so usable materials get a second life.",
  },
];

const BENEFITS = [
  {
    icon: Users,
    title: "For individuals",
    body: "Zero guesswork at the bin, fewer accidentally discarded valuables, and practical upcycling ideas in seconds.",
  },
  {
    icon: Building2,
    title: "For communities",
    body: "Cleaner municipal recycling streams mean fewer rejected truckloads and lower local sorting costs.",
  },
  {
    icon: Globe2,
    title: "For the environment",
    body: "Higher recovery rates and creative reuse keep recoverable polymers, metals, and paper out of landfills.",
  },
];

const ROADMAP = [
  {
    icon: Cpu,
    title: "Smart bins",
    body: "Camera-equipped public bins that sort or guide passersby in real time.",
  },
  {
    icon: Sparkles,
    title: "Community rewards",
    body: "Verified recycling streaks and local merchant perks for neighborhood participation.",
  },
  {
    icon: MapPin,
    title: "City waste heatmaps",
    body: "Anonymized material trends to help municipalities place drop-off points where they matter most.",
  },
];

function AboutPage() {
  return (
    <div className="space-y-16 ewa-animate-in">
      {/* Problem */}
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground sm:text-5xl">
          Clarity at the moment a decision is made.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Most recycling mistakes happen in two seconds: someone stands in front of a bin, guesses,
          and drops the wrong material inside. Eco Waste Wise turns that hesitation into instant,
          evidence-based guidance—with no account, no tracking, and scan history stored only in your
          browser.
        </p>
      </section>

      {/* Solution */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-foreground">The four-stage solution</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTION_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="ewa-card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-foreground">Why it matters</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {BENEFITS.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="ewa-card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Roadmap */}
      <section className="ewa-card p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-foreground">Roadmap</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Where Eco Waste Wise is headed next.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {ROADMAP.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-border bg-background p-5">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-8">
          <Link
            to="/scan"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try the scanner
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}