/*
  Warnings:

  - Added the required column `postId` to the `BasketItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BasketItem" ADD COLUMN     "postId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BasketItem" ADD CONSTRAINT "BasketItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
