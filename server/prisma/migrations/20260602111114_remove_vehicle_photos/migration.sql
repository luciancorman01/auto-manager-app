/*
  Warnings:

  - You are about to drop the `vehicle_photos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "vehicle_photos" DROP CONSTRAINT "vehicle_photos_vehicle_id_fkey";

-- DropTable
DROP TABLE "vehicle_photos";
