import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Logginn from './Logginn';
import Url from './Url';

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
