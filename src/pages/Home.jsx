import React, { useState, useEffect } from 'react';

function Home() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Uses localhost locally, and your Railway URL in production on Vercel
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

        fetch(`${apiUrl}/api/articles`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setArticles(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching articles:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h1>How to Protect Yourself from Scams</h1>
            <p>Welcome to Senim-Wiki. Educate yourself on the latest fraud tactics.</p>

            <div style={{ marginTop: '2rem' }}>
                <h3>Latest Articles:</h3>

                {loading && <p>Loading articles...</p>}
                {error && <p style={{ color: 'red' }}>Error loading articles: {error}</p>}

                {!loading && !error && articles.length === 0 && (
                    <p>No articles published yet. Check back soon!</p>
                )}

                <ul>
                    {articles.map((article) => (
                        <li key={article.id} style={{ marginBottom: '1rem' }}>
                            <strong>{article.title}</strong> ({article.scamCategory})
                            <p style={{ margin: '0.2rem 0' }}>{article.content}</p>
                            <small style={{ color: 'gray' }}>
                                Posted: {new Date(article.createdAt).toLocaleDateString()}
                            </small>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;