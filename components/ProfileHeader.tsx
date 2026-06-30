"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { BadgeCheck } from "lucide-react";
import { playHoverSound } from "@/lib/audio";

interface ProfileHeaderProps {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  banner: string;
  isLive: boolean;
  channelUrl?: string;
  buttonText?: string;
}

export function ProfileHeader({
  name,
  username,
  bio,
  avatar,
  banner,
  isLive,
  channelUrl,
  buttonText = "Subscribe",
}: ProfileHeaderProps) {
  return (
    <div className="relative flex flex-col items-center mb-8">
      {/* Banner */}
      <div className="w-full h-48 md:h-64 relative overflow-hidden border-b-4 border-black bg-pink-200">
        <Image
          src={banner}
          alt="Profile Banner"
          fill
          className="object-cover opacity-90 mix-blend-luminosity"
          referrerPolicy="no-referrer"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pink-300/80 via-transparent to-transparent mix-blend-overlay" />
        {/* Retro dots overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.1]"
          style={{
            backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
            backgroundSize: "16px 16px",
          }}
        ></div>
      </div>

      {/* Avatar & Profile Info */}
      <div className="relative -mt-20 flex flex-col items-center px-4 w-full">
        {/* Avatar Container with glowing effect if Live */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative group"
        >
          <div
            className={`relative w-32 h-32 md:w-40 md:h-40 overflow-hidden border-4 ${isLive ? "border-red-500 bg-red-400" : "border-black bg-yellow-200"} shadow-[4px_4px_0_0_#000] z-10 rounded-xl`}
          >
            <Image
              src="/assets/images/pho.jpeg"
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105 duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {isLive && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#ff7e67] border-2 border-black text-black text-sm font-pixel px-4 py-1 z-20 flex items-center gap-2 shadow-[2px_2px_0_0_#000] uppercase tracking-widest">
              <span className="w-2 h-2 bg-white border border-black animate-pulse" />
              LIVE
            </div>
          )}
        </motion.div>

        {/* Text Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 flex flex-col items-center text-center space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-pixel flex items-center gap-2 tracking-wide text-black drop-shadow-[2px_2px_0_#fff]">
            {name}
            <BadgeCheck className="w-8 h-8 text-blue-500 drop-shadow-[1px_1px_0_#000]" />
          </h1>
          <p className="text-pink-600 font-pixel text-xl tracking-wider uppercase font-bold drop-shadow-[1px_1px_0_#fff]">
            {username}
          </p>
          <p className="text-base md:text-lg text-neutral-800 max-w-md mt-2 font-medium bg-white/50 px-4 py-2 border-2 border-black border-dashed rounded-lg shadow-[2px_2px_0_0_#000]">
            {bio}
          </p>
        </motion.div>

        {/* Follow/Subscribe Button */}
        {channelUrl && (
          <motion.a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -2, x: -2, boxShadow: "8px 8px 0px 0px #000" }}
            whileTap={{
              scale: 0.95,
              y: 2,
              x: 2,
              boxShadow: "0px 0px 0px 0px #ef4444",
            }}
            onMouseEnter={playHoverSound}
            className="mt-8 px-8 py-3 bg-[#a7f3d0] border-4 border-black text-black font-pixel text-2xl uppercase tracking-widest flex items-center gap-2 shadow-[6px_6px_0_0_#000]"
          >
            {buttonText}
          </motion.a>
        )}
      </div>
    </div>
  );
}
