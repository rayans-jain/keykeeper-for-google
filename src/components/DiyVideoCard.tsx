import { Clock, ExternalLink, Play } from "lucide-react";
import { useState } from "react";
import type { DiyIdeaWithVideo } from "@/types/scan";

export function DiyVideoCard({ idea }: { idea: DiyIdeaWithVideo }) {
  const [playing, setPlaying] = useState(false);
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${idea.youtube_search_query} DIY`,
  )}`;

  return (
    <article className="ewa-card flex flex-col overflow-hidden">
      <div className="relative aspect-video w-full bg-secondary">
        {idea.video ? (
          playing ? (
            <iframe
              title={idea.video.videoTitle}
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
                idea.video.videoId,
              )}?autoplay=1&rel=0`}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play video: ${idea.video.videoTitle}`}
              className="group relative h-full w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <img
                src={idea.video.thumbnail}
                alt={idea.video.videoTitle}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-primary/25 transition-colors group-hover:bg-primary/35">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-primary shadow-md transition-transform duration-200 group-hover:scale-110">
                  <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                </span>
              </span>
            </button>
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-primary bg-background px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Search on YouTube
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border px-2.5 py-0.5 font-medium text-foreground">
            {idea.difficulty}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {idea.time_minutes} min
          </span>
        </div>
        <h3 className="mt-3 text-base font-semibold text-foreground">{idea.title}</h3>
        {idea.video && (
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
            {idea.video.videoTitle} · {idea.video.channelTitle}
          </p>
        )}
      </div>
    </article>
  );
}