import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyAccessToken } from "./lib/utils";
import { Role } from "@prisma/client";

const isProtected = ["/admin"];

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const { isInvalid, isTimeout, payload } = await verifyAccessToken(
    accessToken
  );

  if (
    (request.nextUrl.pathname === "/sign-in" ||
      request.nextUrl.pathname === "/sign-up") &&
    payload
  ) {
    if ((payload.role as Role) === "User")
      return NextResponse.redirect(new URL("/user", request.url));
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (
    isProtected.some((route) => {
      route === request.nextUrl.pathname;
    })
  ) {
    if (isInvalid) {
      cookieStore.delete("accessToken");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    } else if (isTimeout)
      return NextResponse.rewrite(new URL("/check-credentials", request.url));
    else if (payload) {
      if (
        (payload.role as Role) !== "User" &&
        request.nextUrl.pathname.startsWith("admin")
      )
        return NextResponse.redirect(new URL("/user", request.url));
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}
