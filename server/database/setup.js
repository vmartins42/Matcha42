var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: ''
})

connection.connect();
connection.query('CREATE DATABASE IF NOT EXISTS matcha')
console.log('Database matcha created')
connection.query('USE matcha')
connection.query('CREATE TABLE IF NOT EXISTS users (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, username VARCHAR(100) NOT NULL, lastname VARCHAR(100) NOT NULL, firstname VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, inscription_date VARCHAR(25), sexe VARCHAR(25), orientation VARCHAR(25) DEFAULT \'Bisexuelle\', bio VARCHAR(10000), interests VARCHAR(255), age INT, pic0 LONGBLOB, pic1 LONGBLOB, pic2 LONGBLOB, pic3 LONGBLOB, pic4 LONGBLOB, city VARCHAR(255), scorePop INT(255), zip VARCHAR(255), country VARCHAR(255), adressUser VARCHAR(255), lat FLOAT, lon FLOAT, visit VARCHAR(25), online BOOLEAN DEFAULT FALSE, hash VARCHAR(255), valid BOOLEAN DEFAULT FALSE, connected VARCHAR(25), completed BOOLEAN DEFAULT FALSE)')
console.log('Table users created')
connection.query('CREATE TABLE IF NOT EXISTS likes (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, username VARCHAR(100) NOT NULL, liked VARCHAR(100) NOT NULL)')
console.log('Table likes created')
connection.query('CREATE TABLE IF NOT EXISTS visits (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, username VARCHAR(100) NOT NULL, visited VARCHAR(100) NOT NULL)')
console.log('Table visits created')
connection.query('CREATE TABLE IF NOT EXISTS block (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, username VARCHAR(100) NOT NULL, blocked VARCHAR(100) NOT NULL)')
console.log('Table block created')
connection.query('CREATE TABLE IF NOT EXISTS notif (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, username VARCHAR(100) NOT NULL, sender VARCHAR(100) NOT NULL, notification VARCHAR(255) NOT NULL, readed BOOLEAN DEFAULT FALSE, date VARCHAR(25) NOT NULL)')
console.log('Table notif created')
connection.query('CREATE TABLE IF NOT EXISTS messages (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, username VARCHAR(100) NOT NULL, sender VARCHAR(100) NOT NULL, message VARCHAR(10000), date VARCHAR(45))')
console.log('Table messages created')
connection.query('CREATE TABLE IF NOT EXISTS tag (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, username VARCHAR(100) NOT NULL, tag VARCHAR(100))')
console.log('Table tag created')
connection.end()