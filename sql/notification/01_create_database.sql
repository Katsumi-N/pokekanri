CREATE DATABASE IF NOT EXISTS `notificationdb`;

DROP USER IF EXISTS `pikachu`@`%`;
CREATE USER pikachu IDENTIFIED BY 'pikachu';
GRANT ALL PRIVILEGES ON pokekanridb.* TO 'pikachu'@'%';
