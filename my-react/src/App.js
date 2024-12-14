import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Menambahkan Navigate di sini
import Navbar from './components/Navbar'; // Import Navbar
import CategoryManagement from './components/CategoryManagement'; // Import halaman Manage Categories
import AddCategoryForm from './components/AddCategoryForm'; // Import form untuk menambah kategori
import EditCategoryForm from './components/EditCategoryForm'; // Import from untuk mengedit kategori
import ProductManagement from './components/ProductManagement'; // Import From untuk halaman manage Produk
import AddProductForm from './components/AddProductForm';
import EditProductForm from './components/EditProductForm';
import Home from './Home';


const App = () => {
  return (
    <Router>
      {/* Navbar akan selalu muncul di semua halaman */}
      <Navbar />

      {/* Routes untuk menentukan rute dan halaman yang ditampilkan */}
      <Routes>
        {/* Route untuk halaman Manage Categories */}
        <Route path="/CategoryManagement" element={<CategoryManagement />} />
        
        {/* Route untuk halaman Add Category Form */}
        <Route path="/AddCategoryForm" element={<AddCategoryForm />} />

        {/* Route untuk halaman Edit Category Form */}
        <Route path="/EditCategoryForm/:id" element={<EditCategoryForm />} />

        <Route path="/ProductManagement" element={<ProductManagement />} />
        <Route path="/AddProductForm" element={<AddProductForm />} />
        <Route path="/EditProductForm/:id" element={<EditProductForm />} />

        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
