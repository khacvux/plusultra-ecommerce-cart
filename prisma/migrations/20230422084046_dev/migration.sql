/*
  Warnings:

  - You are about to drop the `shopping_session` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `cart_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "shopping_session" DROP CONSTRAINT "shopping_session_userId_fkey";

-- AlterTable
ALTER TABLE "cart_item" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "shopping_session";

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
