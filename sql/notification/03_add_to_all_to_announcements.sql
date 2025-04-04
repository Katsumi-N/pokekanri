USE `notificationdb`;

ALTER TABLE `announcements`
ADD COLUMN `to_all` TINYINT(1) NOT NULL DEFAULT 0;