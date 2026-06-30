"use client";

import { motion } from "motion/react";
import { Users, PlayCircle, Gamepad2 } from "lucide-react";
import Image from "next/image";
import { playHoverSound } from "@/lib/audio";

interface LiveStatusCardProps {
  isLive: boolean;
  platform: string;
  title: string;
  viewers?: string;
  game?: string;
  thumbnailUrl?: string;
  streamUrl?: string;
}

export function LiveStatusCard({ isLive, platform, title, viewers, game, thumbnailUrl, streamUrl }: LiveStatusCardProps) {
  if (!isLive) return null;

  return (
    <motion.a
      href={streamUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ y: -2, x: -2, boxShadow: "8px 8px 0px 0px #000" }}
      whileTap={{ scale: 0.96, y: 2, x: 2, boxShadow: "0px 0px 0px 0px #ef4444" }}
      onMouseEnter={playHoverSound}
      className="w-full relative overflow-hidden rounded-xl border-4 border-black bg-[#ffeed6] shadow-[6px_6px_0_0_#000] group cursor-pointer block"
    >
      <div className="absolute inset-0 bg-[#ffd1d1] opacity-50 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} />
      
      <div className="relative p-6 flex flex-col md:flex-row gap-6 items-center bg-white/60 backdrop-blur-sm z-10 border-b-4 border-black border-dashed">
        
        {/* Stream Preview Thumbnail Mock */}
        <div className="relative w-full md:w-48 aspect-video rounded-lg overflow-hidden border-4 border-black shadow-[4px_4px_0_0_#000] bg-black shrink-0">
          <Image 
            src={thumbnailUrl || `https://picsum.photos/seed/apex/600/340`}
            alt="Stream Preview"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized={!!thumbnailUrl}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#ffb3a7]/50 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center pl-1 shadow-[4px_4px_0_0_#000] rotate-12 group-hover:rotate-0 transition-transform">
               <PlayCircle className="w-8 h-8 text-red-500" strokeWidth={3} />
            </div>
          </div>
          <div className="absolute top-2 left-2 bg-red-500 border-2 border-black text-white text-xs font-pixel px-2 py-0.5 shadow-[2px_2px_0_0_#000] uppercase tracking-widest flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 bg-white border border-black animate-ping" />
            LIVE
          </div>
          {viewers && (
            <div className="absolute bottom-2 left-2 bg-[#a7f3d0] border-2 border-black text-black text-xs font-pixel px-2 py-1 shadow-[2px_2px_0_0_#000] flex items-center gap-1.5">
              <Users className="w-4 h-4" strokeWidth={3} />
              {viewers}
            </div>
          )}
        </div>

        {/* Live details */}
        <div className="flex flex-col flex-grow w-full">
          <div className="flex items-center gap-2 mb-2 text-red-600 font-pixel text-xl tracking-wider uppercase font-bold drop-shadow-[1px_1px_0_#fff]">
            <span>{platform}</span>
          </div>
          <h3 className="text-2xl font-bold text-black line-clamp-2 leading-tight mb-2 drop-shadow-[1px_1px_0_#fff]">
            {title}
          </h3>
          {game && (
            <div className="flex items-center gap-2 text-neutral-800 text-sm mt-auto font-medium">
              <Gamepad2 className="w-5 h-5 text-purple-600" />
              <span>{game}</span>
            </div>
          )}
        </div>

      </div>
    </motion.a>
  );
}
