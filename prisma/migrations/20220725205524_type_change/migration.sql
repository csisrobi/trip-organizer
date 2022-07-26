/*
  Warnings:

  - The `meetingLocation` column on the `Route` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Route" DROP COLUMN "meetingLocation",
ADD COLUMN     "meetingLocation" INTEGER[];
