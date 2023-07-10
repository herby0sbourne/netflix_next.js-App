import jwt from "jsonwebtoken";

export const verifyAndDecodeJWT = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error(`token missing ${token}`));
      return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
};
