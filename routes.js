const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const multer = require('multer');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Listar productos
router.get('/', async (req, res) => {
  const productos = await Producto.find();
  res.render('productos', { productos });
});

// Formulario de creación
router.get('/nuevo', (req, res) => {
  res.render('formulario');
});

// Crear producto
router.post('/', upload.single('imagen'), async (req, res) => {
  const nuevo = new Producto({
    nombre: req.body.nombre,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    imagen: req.file ? req.file.filename : ''
  });
  await nuevo.save();
  res.redirect('/productos');
});

// Eliminar producto
router.get('/eliminar/:id', async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.redirect('/productos');
});

module.exports = router;
