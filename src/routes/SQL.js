const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const multer = require('multer');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public/uploads'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sql2',
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Create a new record
app.post('/api/records', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const sql = `INSERT INTO records (name, email) VALUES ('${name}', '${email}')`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    res.send({status: 'Record created successfully!'});
  });
});

// Get all records
app.get('/api/records', function (req, res) {
  const sql = 'SELECT * FROM records';
  connection.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

// Get a record by ID
app.get('/api/records/:id', function (req, res) {
  const id = req.params.id;
  const sql = `SELECT * FROM records WHERE id = ${id}`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result[0]);
  });
});

// Update a record by ID
app.put('/api/records/:id', function (req, res) {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const sql = `UPDATE records SET name = '${name}', email = '${email}' WHERE id = ${id}`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    res.send({status: 'Record updated successfully!'});
  });
});

// Delete a record by ID
app.delete('/api/records/:id', function (req, res) {
  const id = req.params.id;
  const sql = `DELETE FROM records WHERE id = ${id}`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    res.send({status: 'Record deleted successfully!'});
  });
});

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({storage: storage});

// Upload a file
app.post('/api/upload', upload.single('file'), function (req, res) {
  const file = req.file;
  const sql = `INSERT INTO files (name, path) VALUES ('${file.originalname}', '${file.path}')`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    res.send({status: 'File uploaded successfully!'});
  });
});

// Get all files
app.get('/api/files', function (req, res) {
  const sql = 'SELECT * FROM files';
  connection.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
