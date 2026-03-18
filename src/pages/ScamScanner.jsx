import React from 'react';

function ScamScanner() {
    return (
        <div>
            <h1>AI Scam Detector</h1>
            <p>Upload a chat export or use voice-to-text to analyze for potential scam markers.</p>

            <div style={{ border: '2px dashed #ccc', padding: '2rem', marginTop: '1rem', textAlign: 'center' }}>
                <p>Drop your chat file here, or click to upload.</p>
                <button disabled>Upload File (Coming Soon)</button>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <button disabled>🎤 Start Voice Analysis (Coming Soon)</button>
            </div>
        </div>
    );
}

export default ScamScanner;