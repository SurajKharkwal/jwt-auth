import { generateAccessToken, verifyRefreshToken } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CheckCredentials() {
  const prisma = new PrismaClient();
  const cookieStore = cookies();
  const user = await prisma.user.findUnique({
    where: {
      userId: "",
    },
    select: { refreshToken: true, role: true, userId: true },
  });
  if (!user || !user.refreshToken) {
    redirect("/sign-in");
  }
  const { isInvalid } = await verifyRefreshToken(user.refreshToken);
  if (isInvalid) {
    redirect("/sign-in");
  }
  cookieStore.set(
    "accessToken",
    await generateAccessToken({ userId: user.userId, role: user.role })
  );

  return (
    <div className=" w-full h-full flex items-center justify-center ">
      <span className="w-14 h-14 rounded-full border-t-2 border-2 border-t-indigo-500 border-indigo-300" />
    </div>
  );
}
