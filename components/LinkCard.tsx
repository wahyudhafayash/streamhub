"use client";

import { motion } from "motion/react";
import { ExternalLink, Twitch, Youtube, Coffee, Wallet, MessageSquare, Music2, Instagram, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { playHoverSound } from "@/lib/audio";

const iconMap: Record<string, LucideIcon> = {
  Twitch,
  Youtube,
  Coffee,
  Wallet,
  MessageSquare, // Use for Discord
  Music2, // Use for TikTok
  Instagram
};

const gameEmojis = ["🍄", "🌟", "🪙", "👾", "🧱", "🐢", "💣", "💎", "🗡️", "🛡️"];

interface LinkCardProps {
  id: string;
  type: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  highlight?: boolean;
  isLiveStream?: boolean;
  delay?: number;
  index?: number;
}

export function LinkCard({ platform, label, url, icon, highlight, isLiveStream, delay = 0, index = 0 }: LinkCardProps) {
  const IconComponent = iconMap[icon] || ExternalLink;
  const emoji = gameEmojis[index % gameEmojis.length];

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ y: -2, x: -2, boxShadow: "6px 6px 0px 0px #000" }}
      whileTap={{ scale: 0.96, y: 2, x: 2, boxShadow: "0px 0px 0px 0px #ef4444" }}
      onMouseEnter={playHoverSound}
      className={cn(
        "group relative flex items-center p-4 w-full rounded-xl border-4 border-black overflow-hidden transition-all duration-150 shadow-[4px_4px_0_0_#000]",
        isLiveStream
          ? "bg-[#ffb3a7]"
          : highlight 
            ? "bg-[#c4b5fd]" 
            : "bg-white"
      )}
    >
      {/* Game Emoji */}
      <div className="absolute -right-4 -bottom-4 text-7xl opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300 pointer-events-none filter grayscale sepia select-none z-0">
        {emoji}
      </div>

      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-lg border-2 border-black mr-4 shrink-0 transition-colors duration-300 shadow-[2px_2px_0_0_#000] z-10 bg-white",
        isLiveStream
          ? "bg-red-500 text-white"
          : highlight 
            ? "bg-[#8b5cf6] text-white" 
            : "bg-neutral-100 text-neutral-800"
      )}>
        <IconComponent className="w-6 h-6" />
      </div>
      
      <div className="flex flex-col flex-grow text-left z-10">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-bold font-pixel text-2xl tracking-wide text-black drop-shadow-[1px_1px_0_#fff]"
          )}>
            {platform}
          </span>
          {isLiveStream && (
            <span className="flex items-center gap-1.5 bg-red-500 border-2 border-black text-black text-[10px] font-pixel px-2 py-0.5 shadow-[1px_1px_0_0_#000] uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 bg-white border border-black animate-ping" />
              LIVE
            </span>
          )}
        </div>
        <span className="text-sm text-neutral-700 font-medium line-clamp-1 group-hover:text-black transition-colors mt-0.5">
          {label}
        </span>
      </div>

      <div className={cn(
        "flex-shrink-0 ml-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 z-10 bg-white rounded-md",
        isLiveStream ? "text-red-600" : "text-neutral-500 group-hover:text-black"
      )}>
        <ExternalLink className="w-6 h-6" strokeWidth={3} />
      </div>
    </motion.a>
  );
}
