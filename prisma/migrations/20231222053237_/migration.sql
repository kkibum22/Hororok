/*
  Warnings:

  - You are about to alter the column `birth` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `birth` DATETIME(3) NOT NULL;
