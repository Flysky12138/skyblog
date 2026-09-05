/*
  Warnings:

  - You are about to drop the `crons` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "visibility_mask" SET DEFAULT B'111'::int;

-- DropTable
DROP TABLE "crons";
