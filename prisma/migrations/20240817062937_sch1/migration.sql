-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin', 'Manager');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateOn" TIMESTAMP(3) NOT NULL,
    "referenceTocken" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'User',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Products" (
    "productId" TEXT NOT NULL,
    "p_name" TEXT NOT NULL,
    "selling_price" INTEGER NOT NULL,
    "size" TEXT[],
    "color" TEXT[],
    "cost_price" INTEGER NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateOn" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "p_userId" TEXT NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("productId")
);

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_p_userId_fkey" FOREIGN KEY ("p_userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
