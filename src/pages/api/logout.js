import { verifyAndDecodeJWT } from "/utils/jwt";
import { clearCookie } from "lib/cookies";
import { mAdmin } from "/lib/magic.server";

export default async function logout(req, res) {
  if (!(req.method === "GET")) return res.send({});

  const token = req.cookies.token;

  if (!token) return res.status(403).send({});

  const decoded = await verifyAndDecodeJWT(token);
  const userId = decoded.issuer;
  try {
    clearCookie(res);
    await mAdmin.users.logoutByIssuer(userId);

    return res.send({ done: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ done: false });
  }
}
