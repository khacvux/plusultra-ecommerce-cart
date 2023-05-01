/*
  Warnings:

  - The primary key for the `cart_item` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "cart_item_productId_key";

-- AlterTable
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_pkey",
ADD CONSTRAINT "cart_item_pkey" PRIMARY KEY ("userId", "productId");
