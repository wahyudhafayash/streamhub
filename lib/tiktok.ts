export interface TiktokVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  date: number;
  url: string;
}

export async function getTiktokVideos(handle: string, count: number = 3): Promise<TiktokVideo[]> {
  try {
    const handleName = handle.startsWith("@") ? handle.substring(1) : handle;
    const res = await fetch(`https://tikwm.com/api/user/posts?unique_id=${handleName}&count=${count}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
       console.error("TikTok API response not ok", res.status);
       return [];
    }

    const data = await res.json();
    if (data && data.data && data.data.videos) {
      return data.data.videos.map((v: any) => ({
        id: v.video_id,
        title: v.title,
        thumbnail: v.cover || v.origin_cover,
        views: v.play_count,
        date: v.create_time, // epoch seconds
        url: `https://www.tiktok.com/@${handleName}/video/${v.video_id}`
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching Tiktok data:", error);
    return [];
  }
}
