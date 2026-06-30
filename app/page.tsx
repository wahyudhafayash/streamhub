import { ProfileHeader } from "@/components/ProfileHeader";
import { LinkCard } from "@/components/LinkCard";
import { LiveStatusCard } from "@/components/LiveStatusCard";
import { VideoFeed } from "@/components/VideoFeed";
import { STREAMER_INFO, MOCK_TIKTOK_VIDEOS } from "@/lib/mock-data";
import { getYoutubeChannelData } from "@/lib/youtube";
import { getTiktokVideos } from "@/lib/tiktok";

function formatNumber(numStr: string | undefined): string {
  if (!numStr) return "0";
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return numStr;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + " years ago";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months ago";
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + " days ago";
  if (interval === 1) return "1 day ago";
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + " hours ago";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default async function Home() {
  const youtubeHandle = process.env.YOUTUBE_HANDLE || "@loncengelias";
  const tiktokHandle = process.env.TIKTOK_HANDLE || "loncengelias";

  // Fetch real YouTube Data
  const youtubeData = await getYoutubeChannelData(youtubeHandle);
  const hasYoutubeData = !!youtubeData;

  const isYoutubeLive =
    process.env.NEXT_PUBLIC_YOUTUBE_IS_LIVE === "true" ||
    (youtubeData ? !!youtubeData.live : false);
  const isTiktokLive = process.env.NEXT_PUBLIC_TIKTOK_IS_LIVE === "true";
  const isLive = isYoutubeLive || isTiktokLive;

  const donationLinks = [
    {
      id: "donate-1",
      type: "donation",
      platform: "Saweria",
      label: "Support via Saweria",
      url: process.env.NEXT_PUBLIC_SAWERIA_LINK || "#",
      icon: "Coffee",
      highlight: true,
    },
    {
      id: "donate-2",
      type: "donation",
      platform: "Tako",
      label: "Support via Tako",
      url: process.env.NEXT_PUBLIC_TAKO_LINK || "#",
      icon: "Coffee",
    },
  ];

  const socialLinks = [
    {
      id: "social-1",
      type: "social",
      platform: "YouTube",
      label: isYoutubeLive ? "🔴 LIVE NOW! Watch on YouTube" : "Main Channel",
      url:
        isYoutubeLive && youtubeData?.live
          ? `https://youtube.com/watch?v=${youtubeData.live.id.videoId}`
          : process.env.NEXT_PUBLIC_YOUTUBE_LINK ||
            "https://youtube.com/@loncengelias",
      icon: "Youtube",
      highlight: !isYoutubeLive,
      isLiveStream: isYoutubeLive,
    },
    {
      id: "social-2",
      type: "social",
      platform: "TikTok",
      label: isTiktokLive
        ? "🔴 LIVE NOW! Watch on TikTok"
        : "Daily Clips & Memes",
      url:
        process.env.NEXT_PUBLIC_TIKTOK_LIVE_URL ||
        process.env.NEXT_PUBLIC_TIKTOK_LINK ||
        "https://www.tiktok.com/@loncengelias",
      icon: "Music2",
      highlight: !isTiktokLive,
      isLiveStream: isTiktokLive,
    },
    {
      id: "social-3",
      type: "social",
      platform: "Instagram",
      label: "Photos & Stories",
      url:
        process.env.NEXT_PUBLIC_INSTAGRAM_LINK ||
        "https://www.instagram.com/loncengelias",
      icon: "Instagram",
    },
    {
      id: "social-4",
      type: "social",
      platform: "Discord",
      label: "Join the Community",
      url: process.env.NEXT_PUBLIC_DISCORD_LINK || "https://discord.gg/",
      icon: "MessageSquare",
    },
  ];

  // Hardcode primary profiles from env variables so they don't depend on active YouTube data
  const streamerName = process.env.NEXT_PUBLIC_STREAMER_NAME || "Elias Bell.";
  const streamerUsername =
    process.env.NEXT_PUBLIC_STREAMER_USERNAME || "@fay4ssz";
  const streamerBio =
    process.env.NEXT_PUBLIC_STREAMER_BIO || "Just streaming for fun.";
  const streamerAvatar =
    process.env.NEXT_PUBLIC_STREAMER_AVATAR ||
    "https://picsum.photos/seed/avatar3/800/800";
  const streamerBanner =
    process.env.NEXT_PUBLIC_STREAMER_BANNER ||
    "https://picsum.photos/seed/banner1/1920/1080";

  const profileButtonLink =
    process.env.NEXT_PUBLIC_PROFILE_BUTTON_LINK ||
    process.env.NEXT_PUBLIC_YOUTUBE_LINK ||
    "https://youtube.com/@loncengelias";
  const profileButtonText =
    process.env.NEXT_PUBLIC_PROFILE_BUTTON_TEXT || "Subscribe";

  const profileData = {
    name: streamerName,
    username: streamerUsername,
    bio: streamerBio,
    avatar: streamerAvatar,
    banner: streamerBanner,
    isLive: isLive,
    channelUrl: profileButtonLink,
    buttonText: profileButtonText,
  };

  let liveDetails: any = null;
  if (isYoutubeLive) {
    liveDetails = youtubeData?.live
      ? {
          platform: "YouTube",
          title: youtubeData.live.snippet.title,
          thumbnailUrl: youtubeData.live.snippet.thumbnails.high.url,
          streamUrl: `https://youtube.com/watch?v=${youtubeData.live.id.videoId}`,
          viewers: undefined,
          game: "Live Stream",
        }
      : {
          platform: "YouTube",
          title:
            process.env.NEXT_PUBLIC_YOUTUBE_LIVE_TITLE ||
            "Live Stream on YouTube",
          thumbnailUrl: undefined,
          streamUrl:
            process.env.NEXT_PUBLIC_YOUTUBE_LIVE_URL ||
            process.env.NEXT_PUBLIC_YOUTUBE_LINK ||
            "https://youtube.com/@loncengelias",
          viewers: undefined,
          game: "Live Stream",
        };
  } else if (isTiktokLive) {
    liveDetails = {
      platform: "TikTok",
      title:
        process.env.NEXT_PUBLIC_TIKTOK_LIVE_TITLE ||
        "Streaming live on TikTok!",
      thumbnailUrl: process.env.NEXT_PUBLIC_TIKTOK_LIVE_THUMBNAIL || undefined,
      streamUrl:
        process.env.NEXT_PUBLIC_TIKTOK_LIVE_URL ||
        process.env.NEXT_PUBLIC_TIKTOK_LINK ||
        "https://www.tiktok.com/@loncengelias/live",
      viewers: undefined,
      game: process.env.NEXT_PUBLIC_TIKTOK_LIVE_GAME || "Gaming",
    };
  } else {
    liveDetails = STREAMER_INFO.liveDetails;
  }

  const videos = hasYoutubeData
    ? youtubeData.videos.map((v: any) => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail,
        date: timeAgo(v.date),
        url: v.url,
        views: v.views ? `${formatNumber(v.views)} views` : undefined,
      }))
    : [];

  const youtubeVideos = videos.slice(0, 3);

  // Fetch real TikTok Data
  const rawTiktokVideos = await getTiktokVideos(tiktokHandle, 3);
  const tiktokVideos = rawTiktokVideos.map((v) => ({
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnail,
    date: timeAgo(new Date(v.date * 1000).toISOString()),
    url: v.url,
    views: v.views ? `${formatNumber(v.views.toString())} views` : undefined,
  }));
  const finalTiktokVideos =
    tiktokVideos.length > 0 ? tiktokVideos : MOCK_TIKTOK_VIDEOS;

  return (
    <main className="min-h-screen pb-20 relative overflow-hidden">
      {/* Removed ambient blur lighting for retro feel */}

      <div className="max-w-3xl mx-auto z-10 relative mt-8">
        <ProfileHeader {...profileData} />

        <div className="px-4 mt-8 space-y-12">
          <LiveStatusCard
            isLive={profileData.isLive}
            platform={liveDetails.platform}
            title={liveDetails.title}
            viewers={
              liveDetails.viewers
                ? formatNumber(liveDetails.viewers.toString())
                : undefined
            }
            game={liveDetails.game}
            thumbnailUrl={liveDetails.thumbnailUrl}
            streamUrl={liveDetails.streamUrl}
          />

          <section>
            <h3 className="text-2xl font-bold font-pixel text-black uppercase tracking-widest mb-4 px-2 drop-shadow-[2px_2px_0_#fff]">
              Support the stream
            </h3>
            <div className="flex flex-col gap-4">
              {donationLinks.map((link, i) => (
                <LinkCard
                  key={link.id}
                  {...link}
                  delay={0.2 + i * 0.1}
                  index={i}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold font-pixel text-black uppercase tracking-widest mb-4 px-2 drop-shadow-[2px_2px_0_#fff]">
              My Channels
            </h3>
            <div className="flex flex-col gap-4">
              {socialLinks.map((link, i) => (
                <LinkCard
                  key={link.id}
                  {...link}
                  delay={0.3 + i * 0.1}
                  index={i + donationLinks.length}
                />
              ))}
            </div>
          </section>

          {/* Show real videos if available */}
          {hasYoutubeData && youtubeVideos.length > 0 && (
            <VideoFeed
              title="Latest YouTube"
              videos={youtubeVideos}
              channelUrl={profileData.channelUrl}
            />
          )}

          <VideoFeed
            title="Latest TikToks"
            videos={finalTiktokVideos}
            channelUrl={`https://www.tiktok.com/@${tiktokHandle}`}
            isVertical={true}
          />
        </div>
      </div>
    </main>
  );
}
