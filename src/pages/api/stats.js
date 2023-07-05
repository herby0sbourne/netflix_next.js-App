import jwt from "jsonwebtoken";
import { findVideoIdByUserId, insertStats, updateStats } from "lib/db/hasura";

export default async function stats(req, res) {
  if (!(req.method === "POST")) {
    return res.send({ msg: "not a Post Method" });
  }
  const { videoId, favourited, watched = true } = req.body;

  if (!videoId) {
    return res.status(401).send({ mgs: "videoId missing" });
  }

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).send({});
    }

    const decoded = await verifyAndDecodeJWT(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    const doesStatusExist = await findVideoIdByUserId(token, decoded.issuer, videoId);

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
