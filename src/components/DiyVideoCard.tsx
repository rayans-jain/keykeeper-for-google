import { Clock, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DiyIdeaWithVideo } from "@/types/scan";

export function DiyVideoCard({ idea }: { idea: DiyIdeaWithVideo }) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${idea.youtube_search_query} DIY`)}`;
  const watchUrl = idea.video ? `https://www.youtube.com/watch?v=${encodeURIComponent(idea.video.videoId)}` : searchUrl;
  return (
    <article className="ewa-card flex flex-col overflow-hidden">
      <a href={watchUrl} target="_blank" rel="noopener noreferrer" aria-label={idea.video ? `Watch on YouTube: ${idea.video.videoTitle}` : `Search YouTube: ${idea.title}`} className="group relative flex aspect-video items-center justify-center bg-secondary">
        {idea.video && <img src={idea.video.thumbnail} alt={idea.video.videoTitle} className="absolute inset-0 h-full w-full object-cover" />}
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background text-primary"><Play className="h-5 w-5 fill-current" /></span>
      </a>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground"><span>{idea.difficulty}</span><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{idea.time_minutes} min</span></div>
        <h3 className="mt-3 text-base font-semibold">{idea.title}</h3>
        <Button asChild variant="link" className="mt-3 justify-start whitespace-normal px-0 text-primary"><a href={watchUrl} target="_blank" rel="noopener noreferrer">{idea.video ? "Watch on YouTube" : "Search YouTube tutorials"}<ExternalLink /></a></Button>
        {idea.video && <><p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{idea.video.videoTitle} · {idea.video.channelTitle}</p><a href={searchUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-xs text-muted-foreground underline">Other tutorials</a></>}
      </div>
    </article>
  );
}
