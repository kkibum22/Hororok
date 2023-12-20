/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_nickname_key` ON `User`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `id` VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);
