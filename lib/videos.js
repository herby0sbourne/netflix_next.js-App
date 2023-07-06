import videoTestData from "../data/videos.json";
import { getWatchedVideosList, myLikeVideos } from "./db/hasura";

const fetchVideos = async (URL) => {
  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;
  const BASE_URL = "youtube.googleapis.com/youtube/v3";

  const res = await fetch(`https://${BASE_URL}/${URL}&key=${YOUTUBE_API_KEY}`);
  return await res.json();
};

const getCommonVideos = async (URL) => {
  try {
    const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === "development";
    const data = isDevelopment ? videoTestData : await fetchVideos(URL);

    if (data?.error) {
      console.log("youtube api error", data.error);
      return [];
    }

    return data.items.map((item) => {
      const id = item.id?.videoId || item.id;
      const snippet = item.snippet;

      return {
        id,
        title: snippet?.title || null,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` || snippet?.thumbnails?.high?.url,
        publishTime: snippet?.publishedAt,
        videoCount: item.statistics?.viewCount || 0,
        desc: snippet?.description,
        channelTitle: snippet?.channelTitle
      };
    });
  } catch (error) {
    console.error("something went wrong with video library");
    return [];
  }
};

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&maxResults=10&q=${searchQuery}`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL = "videos?part=snippet&maxResults=10&chart=mostPopular&regionCode=US";
  return getCommonVideos(URL);
};

export const getYouTubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(URL);
};

export const getWatchedVideos = async (token, userId) => {
  const videos = await getWatchedVideosList(token, userId);
  videos.reverse();

  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
    };
  });
};

export const getMyLikeVideos = async (token, userId) => {
  const videos = await myLikeVideos(token, userId);
  videos.reverse();

  return videos.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
    };
  });
};
