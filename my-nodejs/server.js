const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer')
const upload = require('./middleware/uploadMiddlewere');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// membuat konfigurasi ke database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'coffe_db',
})

//koneksi database
db.connect((err)=>{
	if(err)throw err;
	console.log('MySQL Connected...');
});

module.exports=db;

// API Routes untuk navbar
app.get('/api/links', (req, res) => {
    res.json([
        // link route untuk ke halaman home myApp
        { id: 1, name: 'Home', path: '/Home' },
        // link route untuk ke halaman mengelola produk
        { id: 2, name: 'Mengelola Produk', path: '/ProductManagement' },
        //  link route untuk ke halaman mengelola kategori 
        { id: 3, name: 'Mengelola Kategori Produk', path: '/CategoryManagement' },
    ]);
});

// Endpoint untuk menambah kategori baru
app.post('/api/categories', (req, res) => {
    const { name, description } = req.body;
    db.query(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [name, description],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error adding category');
            }
            res.status(201).json({ message: 'Category added successfully', id: result.insertId });
        }
    );
});

// Endpoint untuk melihat kategori 
app.get('/api/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching categories');
        }
        res.json(results);
    });
});

// Endpoint untuk melihat kategori berdasarkan ID
app.get('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    
    // Cek apakah ID valid
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }

    db.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching category');
        }
        if (results.length === 0) {
            return res.status(404).send('Category not found');
        }
        res.json(results[0]);  // Mengembalikan hanya satu kategori berdasarkan ID
    });
});


// Endpoint untuk mengedit kategori berdasarkan ID
app.put('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    // Validasi input
    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    // Cek apakah ID valid
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }

    const query = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
    
    db.query(query, [name, description, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to update category', error: err });
        }

        if (result.affectedRows === 0) {
            // Tidak ada data yang diubah
            return res.status(404).json({ message: 'Category not found or no changes made' });
        }

        res.status(200).json({ message: 'Category updated successfully' });
    });
});


// Endpoint untuk menghapus kategori berdasarkan ID
app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;

    // Logika untuk menghapus kategori di database
    const query = `DELETE FROM categories WHERE id = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to delete category', error: err });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    });
});


//Mengelola Produk 

// // Konfigurasi upload menggunakan multer
// const upload = multer({
//     dest: 'uploads', // Folder tempat gambar disimpan
//     fileFilter: (req, file, cb) => {
//         const filetypes = /jpeg|jpg|png|gif/;
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = filetypes.test(file.mimetype);
//         if (mimetype && extname) {
//             return cb(null, true);
//         } else {
//             cb(new Error('Only image files are allowed.'));
//         }
//     },
// });

// Endpoint untuk mendapatkan semua produk
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching products');
        }
        res.json(results);
    });
});

// Endpoint untuk menambah produk
app.post('/api/products', upload.single('image'), (req, res) => {
    const { name, price, stock, category_id, description } = req.body;
    const image = req.file ? req.file.filename : null; // Mendapatkan nama file gambar

    const query = `INSERT INTO products (name, price, stock, category_id, description, image) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [name, price, stock, category_id, description, image], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding product');
        }
        res.status(201).json({ message: 'Product added successfully', id: result.insertId });
    });
});

// Endpoint untuk mendapatkan produk berdasarkan ID
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching product');
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.json(results[0]);
    });
});

// Endpoint untuk mengedit produk berdasarkan ID
app.put('/api/products/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, price, stock, category_id, description } = req.body;
    const image = req.file ? req.file.filename : req.body.image; // Gunakan gambar lama jika tidak ada unggahan baru

    const query = `UPDATE products SET name = ?, price = ?, stock = ?, category_id = ?, description = ?, image = ? WHERE id = ?`;
    db.query(query, [name, price, stock, category_id, description, image, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating product');
        }
        res.status(200).json({ message: 'Product updated successfully' });
    });
});


// Endpoint untuk menghapus product berdasarkan ID
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    console.log("Deleting product with ID:", id);  // Log ID untuk debug
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deleting product' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});



// start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
