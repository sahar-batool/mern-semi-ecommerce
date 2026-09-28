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
    <div>
      <h1>Product Management</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />

        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel edit
          </button>
        )}
      </form>

      <ErrorMessage message={error} />
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h2>Products</h2>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              {product.name} - Rs. {product.price} - Stock: {product.stock}{' '}
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Admin;