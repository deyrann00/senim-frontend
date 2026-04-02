import React, { useState, useEffect } from 'react';
import './Blacklist.css'; // Optional: Create this to style your cards

function Blacklist() {
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const baseUrl = "senim-backend-production.up.railway.app" || 'http://localhost:8080';

        fetch(`${baseUrl}/api/funds`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch blacklisted funds');
                }
                return response.json();
            })
            .then(data => {
                setFunds(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching blacklist:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Helper to color-code statuses
    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'confirmed fraud': return '#e53e3e'; // Red
            case 'suspicious': return '#dd6b20'; // Orange
            case 'under review': return '#d69e2e'; // Yellow
            default: return '#718096'; // Gray
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                Реестр сомнительных фондов
            </h1>
            <p style={{ color: '#4a5568', marginBottom: '2rem' }}>
                База данных организаций и страниц, подозреваемых в мошенничестве.
            </p>

            {loading && <p>Загрузка данных...</p>}
            {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {funds.map((fund) => (
                    <div
                        key={fund.id}
                        style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{fund.name}</h3>
                            <span style={{
                                backgroundColor: getStatusColor(fund.status),
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                            }}>
                                {fund.status?.toUpperCase()}
                            </span>
                        </div>

                        <p style={{ margin: '0.5rem 0', color: '#2d3748' }}>
                            <strong>Описание:</strong> {fund.description}
                        </p>
                        <p style={{ margin: '0.5rem 0', color: '#2d3748' }}>
                            <strong>Причина подозрения:</strong> {fund.reason}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Blacklist;