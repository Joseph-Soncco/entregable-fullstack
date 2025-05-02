const express = require('express')
const db = require('../config/database')

// 1 Listar y filtros

router.get('/', async (req, res) => {
  try {
    const {busqueda, categoria, genero, orden} = req.query

    const [categorias] = await db.query('SELECT * FROM categorias')
    const [editoriales] = await db.query('SELECT * FROM editoriales')
    const [generos] = await db.query('SELECT * FROM generos')

    let sql = `
      SELECT
        m.idmanga,
        m.titulo,
        m.autor,
        m.precio,
        m.imagen,
        c.nombre AS categoria,
        e.nombre AS editorial,
        g.nombre AS genero
      FROM mangas m
      INNER JOIN categorias   c ON m.idcategoria = c.idcategoria
      INNER JOIN editoriales  e ON m.ideditorial = e.ideditorial
      INNER JOIN generos      g ON m.idgenero    = g.idgenero
      WHERE 1=1
      `;
    const params = []

    if (busqueda) {
      sql += ' AND (m.titulo LIKE ? OR m.autor LIKE ?)'
      params.push(`%${busqueda}%`, `%${busqueda}%`)
    }
    if (categoria) {
      sql += ' AND m.idcategoria = ?'
      params.push(categoria)
    }
    if (genero) {
      sql += ' AND m.idgenero = ?'
      params.push(genero)
    }
    if (orden === 'asc' || orden === 'desc') {
      sql += ` ORDER BY m.precio ${orden.toUpperCase()}`
    }

    const [mangas] = await db.query(sql, params)
    res.render('index', {
      mangas,
      categorias,
      editoriales,
      generos,
      filtro: { busqueda, categoria, genero, orden }
    })
  }
  catch (error){
    console.error(error)
  }
})

// 2 CREAR FORMULARIO
router.get('/create', async ( req, res ) => {
  try {
    const [categorias]  = await db.query('SELECT * FROM categorias')
    const [editoriales] = await db.query('SELECT * FROM editoriales')
    const [generos]     = await db.query('SELECT * FROM generos')
    res.render('create', {categorias, editoriales, generos})
  } catch (error) {
    console.error(error)
  
  }
})

// 3 CREAR MANGA
router.post('/create', async( req,res ) =>{
  try {
    let precioNum = parseFloat(req.body.precio) || 0
    if(precioNum > 300) precioNum = 300

    //Multer para las imagenes
    const imagen = req.file
      ? `/img/${req.file.filename}`
      : null;

    const {
      titulo,
      autor,
      idcategoria,
      ideditorial,
      idgenero
    } = req.body;

    await db.query(
      `INSERT INTO mangas
        (idcategoria, ideditorial, idgenero, titulo, autor, precio, imagen)
      VALUES (?,?,?,?,?,?,?)`,
      [
        idcategoria,
        ideditorial,
        idgenero,
        titulo,
        autor,
        precioNum,
        imagen
      ]
    )
  } catch (error) {
    console.error(error)
  }
})

// 4 EDIT FORMULARIO
router.get('/edit/:id', async ( req,res ) => {
  try {
    const [[manga]] = await db.query('SELECT * FROM mangas WHERE idmanga = ?',
    [req.params.id])
    
    if(!manga) return res.redirect('/mangas')
    
    const [categorias] = await db.query('SELECT * FROM categorias')
    const [editoriales] = await db.query('SELECT * FROM editoriales')
    const [generos] = await db.query('SELECT * FROM generos')
    res.render('edit', {manga, categorias, editoriales, generos})
  } catch (error) {
    console.error(error)
  }
})

//5 ACTUALIZAR MANGA
router.post('/edit/:id' , async ( req, res ) => {
  try {
    let precioNum = parseFloat(req.body.precio) || 0
    if(precioNum > 300) precioNum = 300

    const imagen = req.file
      ? `/img/${req.file.filename}`
      : req.body.imagenActual;

    const {
      titulo,
      autor,
      idcategoria,
      ideditorial,
      idgenero
    } = req.body;

    await db.query(
      `UPDATE mangas
        SET idcategoria = ?, idgenero= ?, titulo=?, autor=?, precio=?, imagen=?
      WHERE idmanga=?`
      [
        idcategoria,
        ideditorial,
        idgenero,
        titulo,
        autor,
        precioNum,
        imagen,
        req.params.id
      ]
    )
    res.redirect('/mangas')
  } catch (error) {
    console.error(error)
  }
})

// 6 ELIMINAR MANGA
router.get('/delete/:id', async ( req, res ) => {
  try {
    await db.query('DELETE FROM mangas WHERE idmanga =?', [req.params.id])
    res.render('/mangas')
  } catch (error) {
    console.error(error)
  }
})

module.exports = router;