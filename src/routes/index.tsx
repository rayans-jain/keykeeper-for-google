import { RecyclingScene } from "@/components/RecyclingScene";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Camera, Recycle, ShieldAlert } from "lucide-react";

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

const CATEGORIES = [
  {
    icon: ShieldAlert,
    title: "Keep what matters",
    text: "Reusable bottles, electronics and everyday essentials. Preserve, repair or donate.",
    label: "USEFUL",
  },
  {
    icon: Recycle,
    title: "Recover the material",
    text: "Sort each part: bottles, caps, labels, metal and cardboard each have a different destination.",
    label: "RECYCLABLE",
  },
  {
    icon: AlertTriangle,
    title: "Handle with care",
    text: "Medical waste and contaminated materials need separate, authorized collection — never household reuse.",
    label: "SPECIAL HANDLING",
  },
];
function HomePage() {
  return (
    <div className="space-y-12">
      <section className="home-scene ewa-animate-in -mx-4 sm:-mx-6">
        <div className="relative z-10 mx-auto max-w-2xl px-6 pt-8 text-center text-foreground sm:pt-10">
          <p className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase text-primary">
            <Recycle className="h-4 w-4" /> Less waste. More possibility.
          </p>
          <h1 className="home-title text-4xl font-bold sm:text-5xl">Eco Waste Wise</h1>
          <p className="mx-auto mt-4 max-w-lg text-xl font-medium">
            A better destination for everything in your photo.
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Keep the useful. Recover the recyclable. Separate the hazardous. One photo, a clear
            report for every product.
          </p>
          <Button asChild className="mt-5 h-12 px-6">
            <Link to="/scan">
              <Camera /> Scan your photo <ArrowRight />
            </Link>
          </Button>
        </div>
        <RecyclingScene />
      </section>
      <section className="border-b border-border pb-10">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">
              Every item has a next step
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Sort smarter, not harder.</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {CATEGORIES.map(({ icon: Icon, title, text, label }) => (
            <article key={title} className="ewa-card p-6">
              <Icon className="h-7 w-7 text-primary" />
              <p className="mt-5 text-xs font-semibold text-primary">{label}</p>
              <h3 className="mt-2 text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="grid gap-8 pb-5 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">From photo to purpose</p>
          <h2 className="mt-3 text-3xl font-semibold">
            The whole picture.
            <br />
            Every little part.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Get an honest assessment of usefulness, material-by-material disposal guidance and
            relevant recycling videos.
          </p>
        </div>
        <ol className="divide-y divide-border">
          {[
            {
              title: "Photograph your products",
              text: "Upload a clear image, or capture with your camera.",
            },
            {
              title: "Review each item",
              text: "Separate reports distinguish useful products, waste and medical hazards.",
            },
            {
              title: "Choose the right destination",
              text: "Check each component’s preparation and collection instructions.",
            },
            {
              title: "Watch and take action",
              text: "Open recycling videos directly beneath safe material reports.",
            },
          ].map((step, i) => (
            <li key={step.title} className="flex gap-4 py-4 first:pt-0">
              <span className="font-display text-lg text-primary">0{i + 1}</span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
