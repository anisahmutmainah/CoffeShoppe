import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/AddProductForm.css';

const AddProductForm = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        price: '',
        stock: '',
        category_id: '',
        description: '',
    });
    const [image, setImage] = useState(null); // State untuk file gambar
    const [imagePreview, setImagePreview] = useState(''); // State untuk preview gambar

    useEffect(() => {
        fetch('http://localhost:5000/api/categories')
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error('Error fetching categories:', err));
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Preview gambar
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('category_id', product.category_id);
        formData.append('description', product.description);
        formData.append('image', image); // File gambar ditambahkan ke FormData

        fetch('http://localhost:5000/api/products', {
            method: 'POST',
            body: formData, // Jangan gunakan header 'Content-Type', FormData menangani ini secara otomatis
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                navigate('/ProductManagement');
            })
            .catch((err) => console.error('Error adding product:', err));
    };

    return (
        <div className="add-product-form">
            <h1>Form Tambah Produk</h1>
            <form onSubmit={handleSubmit}>
                <label>Nama:</label>
                <input
                    type="text"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />
                <label>Harga:</label>
                <input
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                />
                <label>Stok:</label>
                <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                />
                <label>Kategori:</label>
                <select
                    value={product.category_id}
                    onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
                >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <label>Deskripsi:</label>
                <textarea
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
                <label>Gambar:</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Preview" width="150" height="150" />
                    </div>
                )}
                <button type="submit">Tambah Produk</button>
            </form>
        </div>
    );
};

export default AddProductForm;
