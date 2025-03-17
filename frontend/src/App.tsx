import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Logginn from './pages/Logginn.tsx';
import Url from './pages/Url.tsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Logginn />} />
                <Route path="/url" element={<Url />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
