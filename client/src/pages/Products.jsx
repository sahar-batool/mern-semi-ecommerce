import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import ProductGrid from '../components/ProductGrid';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getProducts({ page, limit: 8, category, search, sort });
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, category, search, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleCategoryChange = (e) => {
    setPage(1);
    setCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setPage(1);
    setSort(e.target.value);
  };

  return (
    <div className="container products-page">
      <h1>Products</h1>
    <div className="filters-bar">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search products"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='form-input'
        />
        <button type="submit" className="btn btn-secondary">Search</button>
      </form>

      <select value={category} onChange={handleCategoryChange} className="filter-select">
        <option value="">All categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
         <option value="Accessories">Accessories</option>
      </select>

      <select value={sort} onChange={handleSortChange} className="filter-select">
        <option value="">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
      </select>
      </div>

      <ErrorMessage message={error} />
      {/* loading / grid / no results, unchanged */}

    <div>
      {loading ? (
        <LoadingIndicator />
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ProductGrid products={products} />
      )}
      

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="btn btn-secondary" >
          Previous
        </button>
        <span> Page {page} of {totalPages || 1} </span>
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="btn btn-secondary" >
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

export default Products;