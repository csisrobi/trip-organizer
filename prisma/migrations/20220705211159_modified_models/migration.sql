/*
  Warnings:

  - You are about to drop the column `participants` on the `Route` table. All the data in the column will be lost.
  - Added the required column `groupTour` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Route` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_userId_fkey";

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "participants",
ADD COLUMN     "groupTour" BOOLEAN NOT NULL,
ADD COLUMN     "maxParticipants" INTEGER,
ADD COLUMN     "track" TEXT,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "_RouteToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RouteToUser_AB_unique" ON "_RouteToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RouteToUser_B_index" ON "_RouteToUser"("B");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RouteToUser" ADD CONSTRAINT "_RouteToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RouteToUser" ADD CONSTRAINT "_RouteToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
