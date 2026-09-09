create database Ejem;

use Ejem;

CREATE TABLE archivos (
    id_archivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    tipo VARCHAR(50),
    url TEXT
);