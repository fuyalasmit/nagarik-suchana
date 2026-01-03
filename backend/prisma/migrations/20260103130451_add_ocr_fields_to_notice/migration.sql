-- AlterTable
ALTER TABLE "notices" ADD COLUMN     "extractedFields" JSONB,
ADD COLUMN     "ocrConfidence" DOUBLE PRECISION,
ADD COLUMN     "ocrText" TEXT,
ADD COLUMN     "processingStatus" TEXT NOT NULL DEFAULT 'pending';
