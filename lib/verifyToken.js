const { jwtVerify } = require("jose");

export const verifyToken = async (token) => {
  try {
    if (!token) return null;

    const verifyToken = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    return verifyToken.payload;
  } catch (error) {
    console.log(error);
    return null;
  }
};
