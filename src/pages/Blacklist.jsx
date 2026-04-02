import React, { useState, useEffect } from 'react';
import { C } from '../config/constants';

export default function Blacklist({ t }) {
    const bt = t.blacklist;

    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://senim-backend-production.up.railway.app';

        fetch(`${baseUrl}/api/funds`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch blacklisted funds');
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

    // Translate the database status (which is in English) to the user's language
    const getTranslatedStatus = (status) => {
        if (!status) return '';
        const lower = status.toLowerCase();
        if (lower.includes('confirmed fraud')) return bt.confirmedFraud;
        if (lower.includes('suspicious')) return bt.suspicious;
        if (lower.includes('under review')) return bt.underReview;
        return status;
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'confirmed fraud': return '#e53e3e';
            case 'suspicious': return '#dd6b20';
            case 'under review': return '#d69e2e';
            default: return '#718096';
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: C?.blue || "#1a3a5c", borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                {bt.title}
            </h1>
            <p style={{ color: '#4a5568', marginBottom: '2rem', fontSize: '1.1rem' }}>
                {bt.sub}
            </p>

            {loading && <p style={{ color: '#718096' }}>{bt.loading}</p>}
            {error && <p style={{ color: 'red' }}>{bt.error} {error}</p>}
            {!loading && !error && funds.length === 0 && <p>{bt.empty}</p>}

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {funds.map((fund) => (
                    <div
                        key={fund.id}
                        style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: C?.blue || '#1a202c', fontSize: '1.25rem' }}>{fund.name}</h3>
                            <span style={{ backgroundColor: getStatusColor(fund.status), color: 'white', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {getTranslatedStatus(fund.status)}
                            </span>
                        </div>

                        <p style={{ margin: '0.75rem 0 0.25rem', color: '#2d3748', fontSize: '0.95rem' }}>
                            <strong style={{ color: C?.blue || '#1a202c' }}>{bt.desc}</strong> {fund.description}
                        </p>
                        <p style={{ margin: '0', color: '#2d3748', fontSize: '0.95rem' }}>
                            <strong style={{ color: C?.blue || '#1a202c' }}>{bt.reason}</strong> {fund.reason}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}