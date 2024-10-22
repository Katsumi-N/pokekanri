CREATE DATABASE IF NOT EXISTS `pokekanridb`;

DROP USER IF EXISTS `pikachu`@`%`;
CREATE USER pikachu IDENTIFIED BY 'pikachu';
GRANT ALL PRIVILEGES ON pokekanridb.* TO 'pikachu'@'%';
