export const updateLike = async (videoId, favourited) => {
  return await fetch("/api/stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      videoId,
      favourited
    })
  });
};

export const likeStatus = async (videoId) => {
  const response = await fetch(`/api/stats?videoId=${videoId}`);

  const data = await response.json();

  return data[0]?.favourited;
};

export const logOut = async () => {
  const res = await fetch("/api/logout");

  return await res.json();
};
