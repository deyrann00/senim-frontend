import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ScamScanner from './pages/ScamScanner';

function App() {
    return (
        <Router>
            <nav style={{ padding: '1rem', background: '#f4f4f4', marginBottom: '2rem' }}>
                <h2 style={{ display: 'inline', marginRight: '2rem' }}>Senim-Wiki</h2>
                <Link to="/" style={{ marginRight: '1rem' }}>Wiki (Home)</Link>
                <Link to="/scanner">AI Chat Scanner</Link>
            </nav>

            <div style={{ padding: '0 2rem' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/scanner" element={<ScamScanner />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;