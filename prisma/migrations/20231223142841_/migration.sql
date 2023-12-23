-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_feed_id_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `birth` DATE NOT NULL;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_feed_id_fkey` FOREIGN KEY (`feed_id`) REFERENCES `Feed`(`feed_id`) ON DELETE CASCADE ON UPDATE CASCADE;
