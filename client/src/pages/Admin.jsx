import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/products';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
  stock: '',
};

const Admin = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProducts = async () => {
    try {
      const data = await getProducts({ limit: 100 });
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.description || !form.category) {
      setError('Name, description, and category are required');
      return;
    }

    if (form.price === '' || Number(form.price) < 0) {
      setError('Price must be a valid number, 0 or higher');
      return;
    }

    if (form.stock === '' || Number(form.stock) < 0) {
      setError('Stock must be a valid number, 0 or higher');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setSuccess('Product updated');
      } else {
        await createProduct(payload);
        setSuccess('Product created');
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || '',
      stock: product.stock,
    });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    setError('');
    setSuccess('');

    try {
      await deleteProduct(id);
      setSuccess('Product deleted');
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (user.role !== 'admin') {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div className="container admin-page">
      <h1>Product Management</h1>

      <form onSubmit={handleSubmit} className="form admin-form">
        <input className="form-input" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input className="form-input" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input className="form-input" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input className="form-input" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input className="form-input" name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input className="form-input" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
        
        <div className="admin-form-buttons">
        <button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Create'}</button>
        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel edit
          </button>
        )}
         </div>
      </form>

      <ErrorMessage message={error} />
      {success && <p className="success-message">{success}</p>}

      <h2>Products</h2>
      {loading ? (
        <LoadingIndicator />
      ) : (
         <div className="admin-product-list">
      {products.map((product) => (
        <div key={product._id} className="admin-product-item">
          <span>{product.name} - Rs. {product.price} - Stock: {product.stock}</span>
          <div className="admin-product-item-actions">
            <button onClick={() => handleEdit(product)} className="btn btn-secondary btn-small">Edit</button>
            <button onClick={() => handleDelete(product._id)} className="btn btn-danger btn-small">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default Admin;