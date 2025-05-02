-- 1) Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS tienda_mangas;
USE tienda_mangas;

-- 2) Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  idcategoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(40)    NOT NULL,
  CONSTRAINT uk_categoria_nombre UNIQUE(nombre)
) ENGINE=INNODB;

-- 3) Tabla de editoriales
CREATE TABLE IF NOT EXISTS editoriales (
  ideditorial INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(40)    NOT NULL,
  CONSTRAINT uk_editorial_nombre UNIQUE(nombre)
) ENGINE=INNODB;

-- 4) Tabla de géneros
CREATE TABLE IF NOT EXISTS generos (
  idgenero INT AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(40)    NOT NULL,
  CONSTRAINT uk_genero_nombre UNIQUE(nombre)
) ENGINE=INNODB;

-- 5) Tabla de mangas con FKs y CHECK precio ≤ 300
CREATE TABLE IF NOT EXISTS mangas (
  idmanga     INT AUTO_INCREMENT PRIMARY KEY,
  idcategoria INT            NOT NULL,
  ideditorial INT            NOT NULL,
  idgenero    INT            NOT NULL,
  titulo      VARCHAR(100)   NOT NULL,
  autor       VARCHAR(100),
  precio      DECIMAL(10,2)  NOT NULL,
  imagen      VARCHAR(255),
  CONSTRAINT fk_mangas_categoria FOREIGN KEY (idcategoria) REFERENCES categorias(idcategoria),
  CONSTRAINT fk_mangas_editorial FOREIGN KEY (ideditorial) REFERENCES editoriales(ideditorial),
  CONSTRAINT fk_mangas_genero FOREIGN KEY (idgenero) REFERENCES generos(idgenero),
  CONSTRAINT chk_precio_max CHECK (precio <= 300)
) ENGINE=INNODB;

-- 6) Datos de ejemplo
INSERT INTO categorias (nombre) VALUES ('Normal'),('Especial'),('Box Set');
INSERT INTO editoriales (nombre) VALUES ('Shueisha'),('Kodansha'),('Panini');
INSERT INTO generos (nombre) VALUES ('Shōnen'),('Seinen'),('Shōjo'),('Josei'),('Acción'),('Aventura'),('Romance'),('Fantasía'),('Comedia');
INSERT INTO mangas (idcategoria, ideditorial, idgenero, titulo, autor, precio, imagen) VALUES
  (1,1,1,'One Piece Vol.1','Eiichiro Oda',19.90,'/img/onepiece1.jpg'),
  (2,2,2,'Berserk Vol.1','Kentaro Miura',24.50,'/img/berserk1.jpg');
