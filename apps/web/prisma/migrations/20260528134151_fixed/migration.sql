/*
  Warnings:

  - You are about to drop the column `order` on the `friends` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "friends" DROP COLUMN "order",
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "visibility_mask" SET DEFAULT B'111'::int;
