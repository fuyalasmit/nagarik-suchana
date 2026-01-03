-- AlterTable
ALTER TABLE "users" ADD COLUMN     "district" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "ethnicity" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "municipality" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "qualification" TEXT,
ADD COLUMN     "ward" TEXT;

-- CreateTable
CREATE TABLE "notices" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "issuingAgency" TEXT,
    "effectiveFrom" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "sector" TEXT,
    "level" TEXT,
    "url" TEXT,
    "province" TEXT,
    "district" TEXT,
    "municipality" TEXT,
    "ward" TEXT,
    "contact" TEXT,
    "ageGroup" TEXT,
    "gender" TEXT,
    "ethnicity" TEXT,
    "qualification" TEXT,
    "imageUrl" TEXT,
    "pdfUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);
