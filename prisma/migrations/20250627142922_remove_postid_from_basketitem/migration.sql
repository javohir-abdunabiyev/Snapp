/*
  Warnings:

  - You are about to drop the column `postId` on the `BasketItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BasketItem" DROP CONSTRAINT "BasketItem_postId_fkey";

-- AlterTable
ALTER TABLE "BasketItem" DROP COLUMN "postId";
