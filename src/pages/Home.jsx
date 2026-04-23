import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();
    
    // --- STATE DEFINITIONS ---
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- SEARCH STATE ---
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // To detect clicks outside the dropdown to close it
    const searchContainerRef = useRef(null);

    // --- AUTHENTICATION EFFECT ---
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                setUser(null);
            }
        };
        checkAuth();
    }, []);

    // --- DATA FETCHING EFFECT ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Port 8081 for Product Service
                const response = await axios.get('http://localhost:8081/api/products');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // --- AUTO-SUGGESTION DEBOUNCE EFFECT ---
    useEffect(() => {
        // Wait 300ms after the user stops typing before making the API call
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim().length > 1) { // Only search if they typed at least 2 characters
                try {
                    // IMPORTANT: Port 8083 for Search Service!
                    const res = await axios.get(`http://localhost:8083/api/search?query=${searchQuery}`);
                    // Only show the top 4 results in the dropdown
                    setSuggestions(res.data.slice(0, 4)); 
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Close dropdown if user clicks anywhere else on the screen
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- HANDLERS ---
    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            // Navigate to full search page
            navigate(`/search?q=${searchQuery}`); 
        }
    };

    const handleSuggestionClick = (productId) => {
        setShowSuggestions(false);
        setSearchQuery('');
        // Navigate directly to the PDP
        navigate(`/product/${productId}`);
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading awesome products...</div>;

    return (
        <div className="home-wrapper">
            <header className="theme-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 30px' }}>
                <div className="logo">
                    <h2>SHOP+</h2>
                </div>

                {/* NEW SEARCH BAR */}
                <div className="header-search-container" ref={searchContainerRef}>
                    <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
                        <input 
                            type="text" 
                            className="header-search-input"
                            placeholder="Search products..." 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                        />
                    </form>

                    {/* SUGGESTIONS DROPDOWN */}
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="suggestions-dropdown">
                            {suggestions.map((item) => (
                                <li 
                                    key={item.id} 
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(item.id)}
                                >
                                    <img src={item.imageUrl || 'https://via.placeholder.com/40'} alt={item.name} className="suggestion-image" />
                                    <div className="suggestion-details">
                                        <h4>{item.name}</h4>
                                        <span>${item.price ? item.price.toFixed(2) : '0.00'}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <nav className="header-nav">
                    <Link to="/">Home</Link>
                    <Link to="/search">Explore</Link>

                    {user ? (
                        <div className="user-menu" style={{ display: 'inline-flex', gap: '15px', alignItems: 'center' }}>
                            <span className="greeting">Hello, {user.username}</span>
                            <button onClick={handleSignOut} className="btn-outline">Logout</button>
                        </div>
                    ) : (
                        <div className="auth-buttons" style={{ display: 'inline-flex', gap: '15px' }}>
                            <Link to="/login" className="btn-clear">Login</Link>
                            <Link to="/register" className="btn-theme-pink btn-small">Register</Link>
                        </div>
                    )}
                </nav>
            </header>

            <section className="theme-banner">
                <div className="banner-content">
                    <h1>New Season Arrivals</h1>
                    <p>Discover the latest trends in Men's and Women's fashion.</p>
                    <button className="btn-theme-pink">SHOP NOW</button>
                </div>
            </section>

            <div className="home-container">
                <h2>Featured Products</h2>
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image">
                                <Link to={`/product/${product.id}`}>
                                    <img src={product.imageUrl} alt={product.name} />
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
            </div>

            <footer className="theme-footer">
                <p>© 2026 Shop+. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;