/*
  Warnings:

  - You are about to drop the column `sessionId` on the `cart_item` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "cart_item_sessionId_key";

-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "sessionId";
