import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function SiteMotion() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    const mark = () => {
      document.querySelectorAll("main section, main article, main .ewa-card").forEach((element) => {
        if (element.classList.contains("motion-entry")) return;
        element.classList.add("motion-entry");
        observer.observe(element);
      });
    };
    mark();
    const mutations = new MutationObserver(mark);
    const main = document.querySelector("main");
    if (main) mutations.observe(main, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);
  return null;
}
