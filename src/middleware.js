import { NextResponse } from "next/server";

export async function middleware(req, event) {
  const { pathname } = req.nextUrl;
  const token = req?.cookies.get("token") || null;

  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // console.log("middleware ran");

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/browse/:path*"]
};
// export const config = {
//   matcher: '/about/:path*',
// }
