/*
  Warnings:

  - You are about to drop the column `is_active` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `cover` on the `posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[screenshot_file_id]` on the table `friends` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "friends" DROP COLUMN "is_active",
ADD COLUMN     "is_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "screenshot_file_id" UUID;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "cover",
ADD COLUMN     "cover_file_id" UUID,
ALTER COLUMN "visibility_mask" SET DEFAULT B'111'::int;

-- CreateIndex
CREATE UNIQUE INDEX "friends_screenshot_file_id_key" ON "friends"("screenshot_file_id");

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_screenshot_file_id_fkey" FOREIGN KEY ("screenshot_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_file_id_fkey" FOREIGN KEY ("cover_file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
