/*
  Warnings:

  - You are about to drop the column `userShopId` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_userShopId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "userShopId";
