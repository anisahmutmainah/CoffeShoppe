import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style/EditProductForm.css';

const EditProductForm = () => {
    const { id } = useParams(); // Ambil ID dari URL
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        price: '',
        stock: '',
        category_id: '',
        description: '',
        // image: '',
    });
    const [categories, setCategories] = useState([]); // Data kategori
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null); // State untuk file gambar
    const [imagePreview, setImagePreview] = useState(''); // State untuk preview gambar


    // Fetch detail produk berdasarkan ID
    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Product not found');
                }
                return res.json();
            })
            .then((data) => {
                setProduct(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });

        // Fetch kategori untuk dropdown
        fetch('http://localhost:5000/api/categories')
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error('Error fetching categories:', err));
    }, [id]);

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
    
        if (image) {
            formData.append('image', image); // Tambahkan file hanya jika ada
        }
    
        fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'PUT',
            body: formData,
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to update product');
            }
            return res.json();
        })
        .then((data) => {
            alert(data.message || 'Product updated successfully!');
            navigate('/ProductManagement'); // Navigasi hanya jika berhasil
        })
        .catch((err) => {
            console.error('Error updating product:', err);
            alert('Failed to update product. Please try again.');
        });
    };
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="edit-product-form">
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input
                    type="text"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />
                <label>Price:</label>
                <input
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                />
                <label>Stock:</label>
                <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                />
                <label>Category:</label>
                <select
                    value={product.category_id}
                    onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
                >
                    <option value="">Select Category</option>
                    {categories.map((category_id) => (
                        <option key={category_id.id} value={category_id.id}>
                            {category_id.name}
                        </option>
                    ))}
                </select>
                <label>Description:</label>
                <textarea
                    value={product.description}
                    onChange={(e) => 
                        setProduct({ ...product, description: e.target.value })}
                />
                <label>Image:</label>
                <input
                    type="file"
                    name="image"
                    accept='image/*'
                    onChange={(e) => handleFileChange(e)}
                   
                />
                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Preview" width="150" height="150" />
                    </div>
                )}
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default EditProductForm;
