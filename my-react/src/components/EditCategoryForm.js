// EditCategoryForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style/EditCategoryForm.css';

const EditCategoryForm = () => {
    const { id } = useParams(); // Ambil ID kategori dari URL
    const navigate = useNavigate(); // Untuk navigasi setelah berhasil update
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        // Mengambil data kategori berdasarkan ID
        fetch(`http://localhost:5000/api/categories/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setName(data.name);
                setDescription(data.description);
            })
            .catch((err) => console.error('Error fetching category data:', err));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mengirim data kategori yang sudah diedit ke server
        fetch(`http://localhost:5000/api/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to update category');
            }
            return res.json();
        })
        .then((data) => {
            alert('Category updated successfully!');
            navigate('/CategoryManagement');
        })
        .catch((err) => {
            console.error('Error updating category:', err);
            alert('Failed to update category. Please try again.');
        });
    };

    return (
        <div className="edit-category-form">
            <h2>Edit Kategori</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nama Kategori</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit" className="submit-btn">
                    Simpan Perubahan
                </button>
            </form>
        </div>
    );
};

export default EditCategoryForm;
