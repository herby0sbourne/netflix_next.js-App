export const getVideos = async (searchQuery = "") => {
  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;
  const BASE_URL = "youtube.googleapis.com/youtube/v3";
  const SEARCH_QUERY = `search?part=snippet&maxResults=10&q=${searchQuery}`;
  const POPULAR_URL = "videos?part=snippet&maxResults=10&chart=mostPopular&regionCode=US";
  const URL = searchQuery === "" ? POPULAR_URL : SEARCH_QUERY;

  try {
    const res = await fetch(`https://${BASE_URL}/${URL}&key=${YOUTUBE_API_KEY}`);
    const data = await res.json();

    if (data?.error) {
      console.log("youtube api error", data.error);
      return [];
    }

    return data.items.map((item) => {
      return {
        id: item?.id?.videoId || item?.id,
        title: item?.snippet?.title || null,
        imgUrl: item?.snippet?.thumbnails?.high?.url || null
      };
    });
  } catch (error) {
    console.error("something went wrong with video library");
    return [];
  }
};
