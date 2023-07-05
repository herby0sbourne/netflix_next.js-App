import jwt from "jsonwebtoken";
import { findVideoIdByUserId, insertStats, updateStats } from "lib/db/hasura";

export default async function stats(req, res) {
  try {
    const { videoId, favourited, watched = true } = req.body;
    const token = req.cookies.token;

    if (!videoId) return res.send({ msg: "VideoId Missing" });

    if (!token) return res.status(403).send({});

    const decoded = await verifyAndDecodeJWT(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    const video = await findVideoIdByUserId(token, decoded.issuer, videoId);
    const doesStatusExist = video?.length > 0;

    if (req.method === "GET") {
      if (doesStatusExist) {
        // video found
        return res.send(video);
      }
      // no video found
      return res.status(404).send({ user: null, msg: "User not Found" });
    }

    if (!(req.method === "POST")) {
      return res.send({ user: null, msg: "not a Post Method" });
    }

    const data = {
      userId: decoded.issuer,
      watched,
      videoId,
      favourited
    };

    if (doesStatusExist) {
      // update stats
      const resp = await updateStats(token, { ...data });
      return res.send({ data: resp.data });
    }

    // Add to stats
    const resp = await insertStats(token, { ...data });
    return res.send({ data: resp.data });
  } catch (error) {
    return res.status(500).send({ done: false, error: error.message });
  }
}

const verifyAndDecodeJWT = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
};
