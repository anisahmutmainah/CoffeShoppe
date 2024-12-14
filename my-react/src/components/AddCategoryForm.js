import React, { useState } from 'react';
import './style/AddCategoryForm.css';

const AddCategoryForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Category added:', data);
                setName('');
                setDescription('');
                // Redirect to Category Management page (optional)
                window.location.href = '/CategoryManagement';
            })
            .catch((err) => console.error('Error adding category:', err));
    };

    return (
        <div className="add-category-form">
            <h2>Tambah Kategori Baru</h2>
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
                    Simpan Kategori
                </button>
            </form>
        </div>
    );
};

export default AddCategoryForm;
