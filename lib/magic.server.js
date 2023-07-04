const { Magic } = require("@magic-sdk/admin");

export const mAdmin = new Magic(process.env.NEXT_PUBLIC_MAGIC_SERVER_SECRET_KEY);
