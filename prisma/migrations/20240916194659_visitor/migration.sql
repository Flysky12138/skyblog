/*
  Warnings:

  - You are about to drop the `_ClashToVisitorInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visitor_infos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClashToVisitorInfo" DROP CONSTRAINT "_ClashToVisitorInfo_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClashToVisitorInfo" DROP CONSTRAINT "_ClashToVisitorInfo_B_fkey";

-- AlterTable
ALTER TABLE "clashs" ALTER COLUMN "variables" SET DEFAULT '{}'::json;

-- DropTable
DROP TABLE "_ClashToVisitorInfo";

-- DropTable
DROP TABLE "visitor_infos";

-- CreateTable
CREATE TABLE "visitor_logs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "geo" JSONB NOT NULL DEFAULT '{}'::json,
    "agent" JSONB NOT NULL DEFAULT '{}'::json,
    "referer" TEXT,

    CONSTRAINT "visitor_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClashToVisitorLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClashToVisitorLog_AB_unique" ON "_ClashToVisitorLog"("A", "B");

-- CreateIndex
CREATE INDEX "_ClashToVisitorLog_B_index" ON "_ClashToVisitorLog"("B");

-- AddForeignKey
ALTER TABLE "_ClashToVisitorLog" ADD CONSTRAINT "_ClashToVisitorLog_A_fkey" FOREIGN KEY ("A") REFERENCES "clashs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClashToVisitorLog" ADD CONSTRAINT "_ClashToVisitorLog_B_fkey" FOREIGN KEY ("B") REFERENCES "visitor_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
