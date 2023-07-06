const { verifyAndDecodeJWT } = require("./jwt");

const redirectUser = async (context) => {
  const token = context.req ? context.req?.cookies.token : null;
  let userId;

  try {
    const decoded = await verifyAndDecodeJWT(token);
    userId = decoded.issuer;

    return { token, userId };
  } catch (err) {
    console.error("error decoding token", err.message);
    return { token, userId };
  }
};

export default redirectUser;
