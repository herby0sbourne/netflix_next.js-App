const { verifyAndDecodeJWT } = require("./jwt");

const redirectUser = async (context) => {
  const token = context.req ? context.req?.cookies.token : null;
  const decoded = await verifyAndDecodeJWT(token, process.env.NEXT_PUBLIC_JWT_SECRET);
  const userId = decoded.issuer;

  return { token, userId };
};

export default redirectUser;
