import cookie from "cookie";

const MAX_AGE = 7 * 24 * 60 * 60;
export const setTokenCookie = (token, res) => {
  const setCookie = cookie.serialize("token", token, {
    maxAge: MAX_AGE,
    expire: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    sameSite: "none",
    path: "/"
  });
  res.setHeader("Set-Cookie", setCookie);
};
