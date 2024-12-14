import React, { useState, useEffect } from 'react';
import './components/style/ProductManagement.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        // Fetch products and categories from the backend
        fetch('http://localhost:5000/api/products')
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error('Error fetching products:', err));

        fetch('http://localhost:5000/api/categories')
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error('Error fetching categories:', err));
    }, []);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value ? parseInt(event.target.value, 10) : '');
    };
    
    const filteredProducts = selectedCategory
        ? products.filter((product) => product.category_id === selectedCategory)
        : products;    

    return (
        <div className="list-product">
            <h1>List Products</h1>

            {/* Category Filter */}
            <div className="category-filter">
                <label htmlFor="category">Filter dari kategori: </label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">Semua Kategori</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Product Table */}
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Kategori</th>
                        <th>Deskripsi</th>
                        <th>Gambar</th>
                        {/* <th>Actions</th> */}
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
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
                            {/* <td>
                                <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//         fetch(`http://localhost:5000/api/products/${id}`, {
//             method: 'DELETE',
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 alert(data.message);
//                 window.location.reload();
//             })
//             .catch((err) => console.error('Error deleting product:', err));
//     }
// };

export default Home;
