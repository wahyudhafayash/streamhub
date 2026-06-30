export async function getYoutubeChannelData(handle: string) {
  try {
    const handleName = handle.startsWith("@") ? handle : `@${handle}`;
    
    // Scrape HTML for channel ID, Avatar, Banner, Bio since RSS lacks them
    const htmlRes = await fetch(`https://www.youtube.com/${handleName}?hl=en`, { next: { revalidate: 3600 } });
    const htmlText = await htmlRes.text();

    const channelIdMatch = htmlText.match(/<meta itemprop="identifier" content="([^"]+)">/);
    const channelId = channelIdMatch ? channelIdMatch[1] : null;

    if (!channelId) {
       console.error("Could not find channel ID from handle");
       return null;
    }

    const avatarMatch = htmlText.match(/<meta property="og:image" content="([^"]+)">/);
    const avatar = avatarMatch ? avatarMatch[1] : null;

    const titleMatch = htmlText.match(/<meta property="og:title" content="([^"]+)">/);
    const title = titleMatch ? titleMatch[1] : null;

    const descMatch = htmlText.match(/<meta property="og:description" content="([^"]+)">/);
    const description = descMatch ? descMatch[1] : null;

    const bannerMatch = htmlText.match(/"banner":{"thumbnails":\[{"url":"([^"]+)"/);
    const banner = bannerMatch ? bannerMatch[1].replace(/=w\d+-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj/, '') : null;

    let subCount = "";
    let vidCount = "";
    try {
      const scriptRegex = /var ytInitialData = (.*?);<\/script>/;
      const dataMatch = htmlText.match(scriptRegex);
      if(dataMatch) {
         const data = JSON.parse(dataMatch[1]);
         const header = data?.header?.pageHeaderRenderer?.content?.pageHeaderViewModel;
         const metadataRows = header?.metadata?.contentMetadataViewModel?.metadataRows;
         if (metadataRows && metadataRows.length > 1) {
            const parts = metadataRows[1].metadataParts;
            if (parts && parts.length > 0) {
               subCount = parts[0]?.text?.content || "";
               vidCount = parts[1]?.text?.content || "";
            }
         }
      }
    } catch(e) {
      console.warn("Failed to parse ytInitialData for stats");
    }

    // Parse RSS feed
    const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, { next: { revalidate: 3600 } });
    const rssText = await rssRes.text();
    
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    const videos = [];
    while ((match = entryRegex.exec(rssText)) !== null) {
      const entryText = match[1];
      const videoId = entryText.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || '';
      const videoTitleRaw = entryText.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const url = entryText.match(/<link rel="alternate" href="(.*?)"\/>/)?.[1] || '';
      const pubDate = entryText.match(/<published>(.*?)<\/published>/)?.[1] || '';
      const views = entryText.match(/<media:statistics views="(.*?)"\/>/)?.[1] || '';
    
      const videoTitle = videoTitleRaw
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      if (videoId) {
        videos.push({
          id: videoId,
          title: videoTitle,
          url: url || `https://youtube.com/watch?v=${videoId}`,
          date: pubDate,
          views: views,
          thumbnail: `https://i4.ytimg.com/vi/${videoId}/hqdefault.jpg`
        });
      }
    }

    // Live status from YouTube API
    let liveDataObj = null;
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey && apiKey !== "MY_YOUTUBE_API_KEY") {
      const liveRes = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`,
         { next: { revalidate: 120 } }
      );
      if (liveRes.ok) {
        const liveData = await liveRes.json();
        if (liveData.items && liveData.items.length > 0) {
          liveDataObj = liveData.items[0];
        }
      }
    }
    
    return {
      channel: {
        id: channelId,
        title: title || handleName,
        description: description || "",
        avatar: avatar,
        banner: banner,
        handle: handleName,
        subscribers: subCount,
        videosCount: vidCount
      },
      videos: videos.slice(0, 6),
      live: liveDataObj
    };
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return null;
  }
}
