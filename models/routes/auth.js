const express = require('express');
const router = express.Router();
const Usuario = require('../modelos/Usuario');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Registro
router.post('/register', async (req, res) => {
  const hashed = await bcrypt.hash(req.body.contraseña, 10);
  const nuevo = new Usuario({
    nombre: req.body.nombre,
    correo: req.body.correo,
    contraseña: hashed
  });
  await nuevo.save();
  res.redirect('/login');
});

// Login
router.post('/login', async (req, res) => {
  const usuario = await Usuario.findOne({ correo: req.body.correo });
  if (usuario && await bcrypt.compare(req.body.contraseña, usuario.contraseña)) {
    req.session.usuarioId = usuario._id;
    res.redirect('/productos');
  } else {
    res.send('Credenciales incorrectas');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
