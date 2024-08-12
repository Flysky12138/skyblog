-- AlterTable
ALTER TABLE "clashs" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "variables" SET DEFAULT '{}'::json;
