-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "visibility_mask" SET DEFAULT B'111'::int;

-- CreateTable
CREATE TABLE "crons" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "crons_pkey" PRIMARY KEY ("id")
);
