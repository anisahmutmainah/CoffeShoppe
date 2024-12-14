import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style/CategoryManagement.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);

    // Mengambil daftar ketergori dari API
    useEffect(() => {
        fetch('http://localhost:5000/api/categories')
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error('Error fetching categories:', err));
    }, []);

    // fungsi untuk mengapus kategori 
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`http://localhost:5000/api/categories/${id}`);
                // Mengambil daftar kategori setelah penghapusan
                const response = await fetch('http://localhost:5000/api/categories');
                const data = await response.json();
                setCategories(data); // Memperbarui state dengan data kategori yang baru
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <div className="category-management">
            <h1>Menggelola Kategori</h1>
            <h2>List Kategori</h2>
            <Link to="/AddCategoryForm" className="add-category-btn">
                Tambah Kategori
            </Link>
            {categories.length === 0 ? (
                <p>No categories found.</p>
            ) : (
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Deskripsi</th>
                            <th>Aksi</th> {/* Kolom untuk tombol Edit dan Hapus */}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>
                                    {/* Tombol Edit */}
                                    <Link to={`/EditCategoryForm/${category.id}`} className="edit-btn">Edit</Link>
                                    
                                    {/* Tombol Hapus */}
                                    <button onClick={() => handleDelete(category.id)}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CategoryManagement;
