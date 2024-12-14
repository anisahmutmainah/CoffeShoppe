import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style/ProductManagement.css';


const ProductManagement = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error('Error fetching products:', err));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
            })
                .then((res) => res.json())
                .then((data) => {
                    alert(data.message);
                    // Hapus produk yang dihapus dari state
                    setProducts(products.filter((product) => product.id !== id));
                })
                .catch((err) => console.error('Error deleting product:', err));
        }
    };
    
    return (
        <div className="product-management">
            <h1>Mengelola produk</h1>
            <Link to="/AddProductForm" className="add-button">Tambah Produk</Link>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Kategori</th>
                        <th>Deskripsi</th>
                        <th>Gambar</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.category_id}</td>
                            <td>{product.description}</td>
                            <td>
                                <img
                                    src={`http://localhost:5000/uploads/${product.image}`}
                                    alt={product.name}
                                    className="product-image"
                                />
                            </td>
                            <td>
                                <Link to={`/EditProductForm/${product.id}`} className="edit-button">Edit</Link>
                                <button className="delete-button" onClick={() => handleDelete(product.id)}>Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};




export default ProductManagement;
