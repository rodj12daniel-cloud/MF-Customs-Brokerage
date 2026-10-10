"use client";

import * as React from "react";
import { Flame, Trophy } from "lucide-react";

export interface VoxelCardImage {
  src: string;
  alt: string;
}

export interface VoxelVideoStreakCardProps {
  headingPrimary?: string;
  headingHighlight?: string;
  subtitle?: string;
  streakDays?: number;
  streakLabel?: string;
  levelNumber?: number;
  levelLabel?: string;
  videoBadgeText?: string;
  images: VoxelCardImage[];
  className?: string;
  showStats?: boolean;
  showHeading?: boolean;
}

export function VoxelVideoStreakCard({
  headingPrimary = "GROW YOUR CAMPUS",
  headingHighlight = "WITH EVERY CONNECTION.",
  subtitle = "Engage a little every day, earn Loop Points (LP), and complete campus missions to turn college life into a thriving, lasting community.",
  streakDays = 12,
  streakLabel = "Current Streak",
  levelNumber = 38,
  levelLabel = "Total Campus LP",
  videoBadgeText = "Hostel Tea & Vibes",
  images,
  className = "",
  showStats = true,
  showHeading = true,
}: VoxelVideoStreakCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = React.useState(0);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (images.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [images.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Math.max(-8, Math.min(8, x * 16)),
      y: Math.max(-6, Math.min(6, -y * 12)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      className={`relative py-16 sm:py-24 overflow-hidden bg-background select-none ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {showHeading && (
          <h2 className="about-cinematic__voxel-heading text-2xl font-black uppercase tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight drop-shadow-xs">
            {headingPrimary}
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">
              {headingHighlight}
            </span>
          </h2>
        )}

        <p className="mt-4 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {showStats && <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <div className="flex items-center gap-3.5 rounded-2xl border border-border/80 bg-card/90 px-5 py-3 shadow-md shadow-amber-500/5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg cursor-default">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
              <Flame className="size-5 fill-amber-500 text-amber-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-foreground">
                {streakDays} Days
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground">
                {streakLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-border/80 bg-card/90 px-5 py-3 shadow-md shadow-blue-500/5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg cursor-default">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600">
              <Trophy className="size-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-foreground">
                Level {levelNumber}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground">
                {levelLabel}
              </p>
            </div>
          </div>
        </div>}

        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: "transform 0.15s ease-out",
          }}
          className="relative mt-10 sm:mt-14 mx-auto max-w-2xl"
        >
          <div className="group relative aspect-video w-full overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-1.5 shadow-2xl backdrop-blur-md transition-all hover:border-emerald-500/40 hover:shadow-emerald-500/10">
            <div
              className="about-image-carousel relative size-full overflow-hidden rounded-[22px] bg-black"
              role="img"
              aria-label="Cargo, rubber, and steel freight images"
            >
              {images.map((image, index) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  aria-hidden={index !== activeImage}
                  className={`about-image-carousel__image absolute inset-0 size-full object-cover select-none pointer-events-none${index === activeImage ? " is-active" : ""}`}
                  draggable={false}
                />
              ))}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              <div className="pointer-events-none absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-black text-white uppercase tracking-wider backdrop-blur-md">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{videoBadgeText}</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VoxelVideoStreakCard;
