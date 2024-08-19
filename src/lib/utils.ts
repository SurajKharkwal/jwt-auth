import { Role } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { jwtVerify, SignJWT, JWTVerifyResult, errors } from "jose";
import { twMerge } from "tailwind-merge";

// Utility function to merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Secret keys encoded as Uint8Array
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_TOKEN_KEY
);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET
);

// Generate Access Token
export const generateAccessToken = async (user: {
  userId: string;
  role: Role;
}) => {
  return new SignJWT({ userId: user.userId, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(ACCESS_TOKEN_SECRET);
};

// Generate Refresh Token
export const generateRefreshToken = async (user: { userId: string }) => {
  return new SignJWT({ userId: user.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Typically, refresh tokens have a longer lifespan
    .sign(REFRESH_TOKEN_SECRET);
};

// Verify Access Token
export const verifyAccessToken = async (token: string) => {
  try {
    const decode = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    return { isTimeout: false, isInvalid: false, payload: decode.payload };
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return { isTimeout: true, isInvalid: false };
    }
    return { isTimeout: false, isInvalid: true };
  }
};

// Verify Refresh Token
export const verifyRefreshToken = async (token: string) => {
  try {
    const decode = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    return { isInvalid: false, decode };
  } catch (error) {
    return { isInvalid: true };
  }
};
