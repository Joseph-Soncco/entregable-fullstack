-- Creamos la base de datos
CREATE DATABASE tienda_mangas;
USE tienda_mangas;

CREATE TABLE IF NOT EXISTS categorias
(
    idcategoria   INT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(40)    NOT NULL,
    CONSTRAINT uk_categoria_nombre UNIQUE (nombre)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS editoriales
(
    ideditorial   INT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(40)    NOT NULL,
    CONSTRAINT uk_editorial_nombre UNIQUE (nombre)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS mangas
(
    idmanga       INT AUTO_INCREMENT PRIMARY KEY,
    idcategoria   INT            NOT NULL,
    ideditorial   INT            NOT NULL,
    titulo        VARCHAR(100)   NOT NULL,
    autor         VARCHAR(100),
    precio        DECIMAL(10,2)  NOT NULL,
    stock         INT            NOT NULL DEFAULT 0,
    imagen        VARCHAR(255),    -- ruta o URL de la imagen
    CONSTRAINT fk_categoria_mangas FOREIGN KEY (idcategoria) REFERENCES categorias(idcategoria),
    CONSTRAINT fk_editorial_mangas FOREIGN KEY (ideditorial) REFERENCES editoriales(ideditorial)
) ENGINE = INNODB;
