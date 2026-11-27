import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  FlaskConical,
  HelpCircle,
  Recycle,
  ScanSearch,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eco Waste Wise — Know in one glance what to do with it" },
      {
        name: "description",
        content:
          "Photograph or upload any item to instantly check if it is a valuable or waste, see scientific recyclability scores, and watch DIY reuse videos.",
      },
      { property: "og:title", content: "Eco Waste Wise — Know in one glance what to do with it" },
      {
        property: "og:description",
        content:
          "Instant valuable-vs-waste detection, scientific recyclability scores, and DIY reuse videos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const PROBLEMS = [
  {
    icon: AlertTriangle,
    title: "Wish-cycling contaminates good recyclables",
    body: "Tossing one unaccepted item into the recycling bin can send an entire batch straight to landfill.",
  },
  {
    icon: ShieldAlert,
    title: "Valuables get thrown away by mistake",
    body: "Chargers, keys, cards, and working electronics disappear into trash bags every day.",
  },
  {
    icon: HelpCircle,
    title: "Nobody knows plastic types",
    body: "Resin codes and mixed packaging make split-second sorting guesswork at the bin.",
  },
];

const STEPS = [
  { icon: Camera, num: "01", title: "Capture", body: "Snap a photo or upload an image of one item." },
  {
    icon: ScanSearch,
    num: "02",
    title: "Identify",
    body: "Our smart filter checks first whether it is a valuable you should keep.",
  },
  {
    icon: FlaskConical,
    num: "03",
    title: "Analyze",
    body: "See material breakdown, recyclability scores, and exact bin preparation.",
  },
  {
    icon: Recycle,
    num: "04",
    title: "Reuse",
    body: "Watch real YouTube DIY tutorials to give the material a second life.",
  },
];

function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="ewa-animate-in mx-auto max-w-3xl pt-6 text-center sm:pt-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Know in one glance what to do with it.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          End the split-second hesitation at the bin. Snap or upload any item to protect valuables,
          understand the material scientifically, and discover real DIY reuse ideas.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/scan"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Scan an item
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex min-h-[48px] items-center rounded-full border border-border bg-background px-7 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            How it works
          </a>
        </div>
      </section>

      {/* 3 minimal problem cards */}
      <section aria-label="Common sorting problems" className="grid gap-5 md:grid-cols-3">
        {PROBLEMS.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="ewa-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          );
        })}
      </section>

      {/* Trash vs Treasure explainer */}
      <section className="ewa-card p-6 sm:p-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Trash vs. Treasure, checked first
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Before running a recycling breakdown, Eco Waste Wise checks whether the object is
              something you would regret throwing away. Only confirmed waste continues to full
              material scoring.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-accent/35 bg-background p-5">
              <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                VALUABLE
              </span>
              <p className="mt-3 text-sm font-medium text-foreground">
                Phones, chargers, keys, wallets, cards, jewelry, documents
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Stops immediately with a maroon alert so you keep it safe.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/25 bg-background p-5">
              <span className="inline-block rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                WASTE
              </span>
              <p className="mt-3 text-sm font-medium text-foreground">
                Packaging, bottles, cartons, worn items, scrap materials
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Gets scores, bin prep steps, and 3 curated DIY reuse videos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-step How it works */}
      <section id="how-it-works" className="scroll-mt-28 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">How it works</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Four fast steps from photo to confident action.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="ewa-card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-sm font-semibold text-muted-foreground">
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
