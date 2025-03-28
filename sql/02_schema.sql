USE `pokekanridb`;

CREATE TABLE IF NOT EXISTS `pokemons` (
  `id` BIGINT NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `energy_type` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `hp` BIGINT NOT NULL,
  `ability` TEXT,
  `ability_description` TEXT,
  `regulation` VARCHAR(16) NOT NULL,
  `expansion` VARCHAR(16) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `pokemon_attacks` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `pokemon_id` BIGINT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `required_energy` VARCHAR(64) NOT NULL,
  `damage` VARCHAR(16),
  `description` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `index_pokemon_id` (`pokemon_id`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin; 

CREATE TABLE IF NOT EXISTS `trainers` (
  `id` BIGINT NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `trainer_type` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `regulation` VARCHAR(16) NOT NULL,
  `expansion` VARCHAR(16) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `energies` (
  `id` BIGINT NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `regulation` VARCHAR(16) NOT NULL,
  `expansion` VARCHAR(16) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `inventories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `card_id` BIGINT NOT NULL,
  `card_type_id` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `index_card_id_card_type_id` (`card_id`, `card_type_id`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `card_types` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
https://images.microcms-assets.io/assets/2c7a729c17754b66a6f0b8f7180cf385/778c3df66eeb4ecf8fe66045de2b825a/image.png
