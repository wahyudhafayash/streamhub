"use client";

import { motion } from "motion/react";
import { Clock, Eye, Play } from "lucide-react";
import Image from "next/image";
import { playHoverSound } from "@/lib/audio";

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  views?: string;
  date: string;
  duration?: string;
  url: string;
}

interface VideoFeedProps {
  title?: string;
  videos: VideoData[];
  channelUrl?: string;
  isVertical?: boolean;
}

export function VideoFeed({ title = "Latest Uploads", videos, channelUrl, isVertical = false }: VideoFeedProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="w-full mt-8 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 px-2 gap-4">
        <h2 className="text-3xl md:text-4xl font-pixel font-bold text-black flex items-center gap-2 drop-shadow-[2px_2px_0_#fff]">
          {title}
        </h2>
        {channelUrl && (
          <motion.a 
            href={channelUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            onMouseEnter={playHoverSound}
            whileHover={{ y: -2, x: -2, boxShadow: "4px 4px 0px 0px #000" }}
            whileTap={{ scale: 0.95, y: 2, x: 2, boxShadow: "0px 0px 0px 0px #ef4444" }}
            className="self-start text-sm font-pixel text-black bg-[#a7f3d0] border-2 border-black px-4 py-2 shadow-[2px_2px_0_0_#000] transition-colors uppercase tracking-widest"
          >
            View Channel
          </motion.a>
        )}
      </div>

      <div className={`grid grid-cols-1 ${isVertical ? 'md:grid-cols-3 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
        {videos.map((video, index) => (
          <motion.a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -2, x: -2, boxShadow: "8px 8px 0px 0px #000" }}
            whileTap={{ scale: 0.96, y: 2, x: 2, boxShadow: "0px 0px 0px 0px #ef4444" }}
            onMouseEnter={playHoverSound}
            className="group block relative rounded-xl bg-white border-4 border-black overflow-hidden shadow-[6px_6px_0_0_#000]"
          >
            <div className={`relative ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} overflow-hidden border-b-4 border-black bg-neutral-200`}>
              <Image 
                src={video.thumbnail} 
                alt={video.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-[#c4b5fd]/30 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-colors flex items-center justify-center">
                 <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center pl-1 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300 shadow-[4px_4px_0_0_#000]">
                    <Play className="w-8 h-8 text-black" />
                 </div>
              </div>
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-[#fde047] border-2 border-black px-2 py-1 text-xs font-pixel text-black shadow-[2px_2px_0_0_#000]">
                  {video.duration}
                </div>
              )}
            </div>

            <div className="p-4 bg-white">
              <h3 className="font-bold text-black line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors text-lg">
                {video.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-neutral-600 font-pixel tracking-wide uppercase font-bold">
                {video.views && (
                  <div className="flex items-center gap-1.5 bg-neutral-100 px-2 py-1 border border-black shadow-[1px_1px_0_0_#000]">
                    <Eye className="w-4 h-4" />
                    {video.views}
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-neutral-100 px-2 py-1 border border-black shadow-[1px_1px_0_0_#000]">
                  <Clock className="w-4 h-4" />
                  {video.date}
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
