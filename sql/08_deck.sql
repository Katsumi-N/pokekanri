USE `pokekanridb`;

CREATE TABLE IF NOT EXISTS `decks` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `main_card_id` BIGINT,
  `main_card_type_id` BIGINT,
  `sub_card_id` BIGINT,
  `sub_card_type_id` BIGINT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `index_user_id` (`user_id`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `deck_cards` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `deck_id` BIGINT NOT NULL,
  `card_id` BIGINT NOT NULL,
  `card_type_id` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `index_deck_id` (`deck_id`),
  INDEX `index_card_id_card_type_id` (`card_id`, `card_type_id`),
  FOREIGN KEY (`deck_id`) REFERENCES `decks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin; 