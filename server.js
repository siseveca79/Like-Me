require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect(err => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database');
  }
});


app.post('/post', async (req, res) => {
  const { usuario, url, descripcion } = req.body;
  console.log('Datos recibidos en /post:', req.body); 
  if (!usuario || !url || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO posts (usuario, url, descripcion) VALUES ($1, $2, $3) RETURNING *',
      [usuario, url, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear el post', err);
    res.status(500).json({ error: 'Error al crear el post' });
  }
});


app.put('/post', async (req, res) => {
  const { id } = req.query;
  console.log('ID recibido en /post (PUT):', id); 
  if (!id) {
    return res.status(400).json({ error: 'ID del post es requerido' });
  }
  try {
    const result = await pool.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Post no encontrado' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error al incrementar los likes', err);
    res.status(500).json({ error: 'Error al incrementar los likes' });
  }
});


app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener los posts', err);
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
