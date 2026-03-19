import React, { useState, useEffect } from 'react';
import './Home.css';

function Home() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        const apiUrl = `${baseUrl}/api/articles`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Fetch error:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section">
                <h1>Protect Yourself from Scams</h1>
                <p>Welcome to Senim-Wiki. Arm yourself with the knowledge to identify and avoid the latest digital fraud and social engineering tactics.</p>
            </div>

            {/* Content Section */}
            <div>
                <h3 className="section-title">Latest Threat Briefings</h3>

                {loading && <div className="status-message">Loading articles...</div>}

                {error && <div className="status-message" style={{ color: '#e53e3e' }}>
                    Failed to load articles. Please try again later.
                </div>}

                {!loading && !error && articles.length === 0 && (
                    <div className="status-message">No articles published yet. Check back soon!</div>
                )}

                {/* Grid of Articles */}
                <div className="article-grid">
                    {articles.map(article => (
                        <div key={article.id} className="article-card">
                            {/* Assuming your backend has a 'scamCategory' field. If not, you can remove this span */}
                            {article.scamCategory && (
                                <span className="article-category">{article.scamCategory}</span>
                            )}

                            <h4>{article.title}</h4>
                            <p>{article.content}</p>

                            <div className="article-footer">
                                Added: {new Date(article.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;