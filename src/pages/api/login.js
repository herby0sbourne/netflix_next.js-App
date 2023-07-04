import jwt from "jsonwebtoken";

import { mAdmin } from "../../../lib/magic.server";
import { createUser, isNewUser } from "../../../lib/db/hasura";
import { setTokenCookie } from "../../../lib/cookies";

export default async function login(req, res) {
  if (!(req.method === "POST")) {
    return res.status(500).send({ done: false });
  }

  try {
    const auth = req.headers.authorization || req.headers["Authorization"];
    const DIDToken = auth ? auth.split(" ")[1] : "";

    const metadata = await mAdmin.users.getMetadataByToken(DIDToken);

    const token = generateToken(metadata);
    const isNewUserQuery = await isNewUser(token, metadata.issuer);

    isNewUserQuery && (await createUser(token, metadata));
    setTokenCookie(token, res);

    return res.send({ done: true });
  } catch (e) {
    console.error("Something went wrong. Please try again");
    return res.status(500).send({ done: false });
  }
}

const generateToken = (metadata) => {
  return jwt.sign(
    {
      ...metadata,
      exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user", "admin"],
        "x-hasura-user-id": metadata.issuer
      }
    },
    process.env.NEXT_PUBLIC_JWT_SECRET
  );
};
