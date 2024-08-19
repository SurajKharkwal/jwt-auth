"use server";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { generateAccessToken, generateRefreshToken } from "./lib/utils";

const prisma = new PrismaClient();

export async function validateUser(email: string, password: string) {
  if (!email || !password) {
    return { message: "Email and password are required." };
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        userId: true,
        password: true,
        role: true,
        refreshToken: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { message: "Invalid credentials" };
    }

    const accessToken = await generateAccessToken({
      userId: user.userId,
      role: user.role,
    });
    const refreshToken = await generateRefreshToken({
      userId: user.userId,
    });
    await prisma.user.update({
      where: { email },
      data: {
        refreshToken,
      },
    });

    const cookieStore = cookies();
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    });

    return { message: "Authentication successful", accessToken };
  } catch (error) {
    console.error("Error validating user:", error);
    return { message: "Error validating user." };
  } finally {
    await prisma.$disconnect();
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string
) {
  if (!email || !password) {
    return { message: "Email and password are required." };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const noOfUser = await prisma.user.count();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: noOfUser === 0 ? "Admin" : "User",
      },
    });

    const refreshToken = await generateRefreshToken({ userId: user.userId });

    await prisma.user.update({
      where: { userId: user.userId },
      data: { refreshToken: refreshToken },
    });

    const accessToken = await generateAccessToken({
      userId: user.userId,
      role: user.role,
    });
    const cookieStore = cookies();
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken, refreshToken, user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { message: "Error creating user." };
  } finally {
    await prisma.$disconnect();
  }
}
export async function generateAccessTokenViaRefreshToken() {
  console.log("ok");
}
