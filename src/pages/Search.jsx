import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
    // useSearchParams allows us to read the "?q=" from the URL
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';

    const [searchInput, setSearchInput] = useState(queryParam);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false); // Tracks if a search has been executed

    // Change to whatever port your SearchService is actually running on!
    const SEARCH_SERVICE_PORT = '8082'; 

    useEffect(() => {
        // If there's a query in the URL on page load, automatically search for it
        if (queryParam) {
            executeSearch(queryParam);
        }
    }, [queryParam]);

    const executeSearch = async (searchTerm) => {
        if (!searchTerm.trim()) return;
        
        setLoading(true);
        setSearched(true);
        try {
            const searchApiUrl = process.env.REACT_APP_SEARCH_URL || 'http://localhost:8082';
            const response = await axios.get(`${searchApiUrl}/api/search?query=${searchTerm}`);
            setResults(response.data);
        } catch (error) {
            console.error("Error executing search:", error);
            setResults([]); // Clear results on error
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // This updates the URL (e.g. /search?q=polo) and triggers the useEffect above
        setSearchParams({ q: searchInput });
    };

    return (
        <div className="home-wrapper">
            {/* Standard Header */}
            <header className="theme-header">
                <div className="logo">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h2>SHOP+</h2>
                    </Link>
                </div>
                <nav className="header-nav">
                    <Link to="/">Home</Link>
                    <Link to="/search">Search</Link>
                </nav>
            </header>

            <div className="home-container" style={{ minHeight: '60vh', paddingTop: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2>Search Products</h2>
                    <form onSubmit={handleSearchSubmit} style={{ marginTop: '20px' }}>
                        <input 
                            type="text" 
                            placeholder="Search by name or description..." 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            style={{ 
                                padding: '12px 20px', 
                                width: '300px', 
                                border: '1px solid #ccc', 
                                borderRadius: '4px 0 0 4px',
                                fontSize: '16px'
                            }}
                        />
                        <button 
                            type="submit" 
                            className="btn-theme-pink"
                            style={{ borderRadius: '0 4px 4px 0', padding: '13px 25px', border: 'none' }}
                        >
                            SEARCH
                        </button>
                    </form>
                </div>

                {/* Loading State */}
                {loading && <div style={{ textAlign: 'center' }}>Searching our catalog...</div>}

                {/* Empty State */}
                {!loading && searched && results.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
                        <h3>No products found matching "{queryParam}"</h3>
                        <p>Try checking your spelling or using more general terms.</p>
                    </div>
                )}

                {/* Results Grid (Reuses your Home page CSS) */}
                {!loading && results.length > 0 && (
                    <div className="product-grid">
                        {results.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                    <Link to={`/product/${product.id}`}>
                                        {/* Ensure your Search Elasticsearch document has the imageUrl indexed! */}
                                        <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
                                    </Link>
                                </div>
                                <div className="product-info">
                                    <h3>
                                        <Link to={`/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <span className="price">${product.price ? product.price.toFixed(2) : '0.00'}</span>
                                    <button className="btn-sec-col add-cart-btn">ADD TO CART</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <footer className="theme-footer">
                <p>© 2026 Shop+. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Search;