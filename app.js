const express     = require('express')
const bodyParser  = require('body-parser')
const path        = require('path')
const multer      = require('multer')

//Configuracion de Multer
const storage = multer.diskStorage({
  destination: (req,file,cb) =>
    cb(null, path.join(__dirname, 'public/img')),
  filename: (req,file,cb) =>
    cb(null,Date.now() + '-' + file.originalname)
})

const upload = multer({storage})

const mangasRouter = require('./routes/mangas')(img)

const app = express()

//vistas
app.set('views engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Middlewares
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

//Rutas
app.get('/', (req,res)=>res.render('index'))
app.use('/mangas', mangasRouter)

//Servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Servidor en http://localhost:${PORT}'))