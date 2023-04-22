/*
  Warnings:

  - The primary key for the `shopping_session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `shopping_session` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_sessionId_fkey";

-- DropIndex
DROP INDEX "shopping_session_userId_key";

-- AlterTable
ALTER TABLE "shopping_session" DROP CONSTRAINT "shopping_session_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "shopping_session_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "shopping_session"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
