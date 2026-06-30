"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Trophy, Crown, Star, Medal } from "lucide-react";
import { playHoverSound } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface Supporter {
  id: string;
  name: string;
  amount: string;
  message?: string;
  rank: number;
}

interface LeaderboardProps {
  initialSupporters?: Supporter[]; // Optional now
}

const rankIcons = [
  <Crown className="w-6 h-6 text-yellow-500" key="1" />,
  <Star className="w-6 h-6 text-gray-400" key="2" />,
  <Medal className="w-6 h-6 text-amber-700" key="3" />,
];

const getPixelAvatar = (name: string) => {
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}`;
};

export function Leaderboard({ initialSupporters = [] }: LeaderboardProps) {
  const [supporters, setSupporters] = useState<Supporter[]>(initialSupporters);

  useEffect(() => {
    // Fetch live leaderboard data from our webhook API
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/saweria");
        if (res.ok) {
          const data = await res.json();
          if (data.leaderboard && data.leaderboard.length > 0) {
            setSupporters(data.leaderboard);
          }
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };

    fetchLeaderboard(); // initial fetch
    const interval = setInterval(fetchLeaderboard, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (!supporters || supporters.length === 0) return null;

  return (
    <section className="w-full">
      <h3 className="text-2xl font-bold font-pixel text-black uppercase tracking-widest mb-4 px-2 drop-shadow-[2px_2px_0_#fff] flex items-center gap-3">
        <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-500" />
        Top Supporters (Saweria)
      </h3>
      
      <div className="bg-white border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000] p-4 flex flex-col gap-3 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)' }} />

        {supporters.map((supporter, index) => (
          <motion.div
            key={supporter.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onMouseEnter={playHoverSound}
            className={cn(
              "group relative flex items-center gap-4 p-3 rounded-lg border-2 border-black bg-neutral-100 transition-all cursor-default",
              index === 0 && "bg-[#fff7ed] border-yellow-500 shadow-[4px_4px_0_0_#eab308]",
              index > 0 && "shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000]"
            )}
          >
            {/* Rank Icon or Number */}
            <div className="flex items-center justify-center w-8 shrink-0 font-pixel text-xl font-bold">
              {index < 3 ? rankIcons[index] : `#${supporter.rank}`}
            </div>

            {/* Avatar */}
            <div className={cn(
              "relative w-12 h-12 overflow-hidden border-2 border-black bg-white rounded-md shrink-0",
              index === 0 && "w-14 h-14 border-yellow-500"
            )}>
              <Image
                src={getPixelAvatar(supporter.name)}
                alt={supporter.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-grow min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={cn(
                  "font-bold font-pixel text-lg truncate",
                  index === 0 ? "text-yellow-600" : "text-black"
                )}>
                  {supporter.name}
                </span>
                <span className="font-pixel text-green-600 font-bold whitespace-nowrap bg-green-100 px-2 py-0.5 rounded border border-green-300">
                  {supporter.amount}
                </span>
              </div>
              {supporter.message && (
                <span className="text-sm text-neutral-600 truncate mt-0.5 italic">
                  "{supporter.message}"
                </span>
              )}
            </div>
            
            {/* 1st Place extra decoration */}
            {index === 0 && (
              <div className="absolute -top-3 -right-3 text-2xl rotate-12 group-hover:rotate-45 transition-transform">
                🪙
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
