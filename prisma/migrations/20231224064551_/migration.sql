-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Feed` DROP FOREIGN KEY `Feed_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Feedlike` DROP FOREIGN KEY `Feedlike_feed_id_fkey`;

-- DropForeignKey
ALTER TABLE `Feedlike` DROP FOREIGN KEY `Feedlike_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `Feed` ADD CONSTRAINT `Feed_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedlike` ADD CONSTRAINT `Feedlike_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedlike` ADD CONSTRAINT `Feedlike_feed_id_fkey` FOREIGN KEY (`feed_id`) REFERENCES `Feed`(`feed_id`) ON DELETE CASCADE ON UPDATE CASCADE;
