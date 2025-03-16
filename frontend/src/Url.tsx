import { useState } from 'react';

const Url = () => {
    const [url, setUrl] = useState('');

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
                <img src="/nav-logo.png" alt="NAV logo" className="h-10" />
                <div className="flex space-x-8 text-gray-700 font-medium">
                    <a href="#">Hjem</a>
                    <a href="#">Privat</a>
                    <a href="#">Arbeidsgiver</a>
                    <a href="#">Samarbeidspartnere</a>
                    <input placeholder="Søk" className="border rounded px-2" />
                    <button className="text-indigo-600">Logg ut</button>
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-center p-8">
                <div className="bg-blue-100 p-8 rounded-lg shadow-lg w-full max-w-2xl">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                        🔗 URL-forkorter.no
                    </h2>
                    <p className="mb-4 text-sm">
                        Kontroller lenken din her!
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Lim inn lenken her"
                            className="border border-gray-300 px-4 py-2 rounded-md flex-grow"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                            Forkort
                        </button>
                    </div>
                    <div className="mt-6 text-sm">
                        Din lenke er godkjent og leder til:
                        <a href="#" className="text-blue-600 ml-1 underline">
                            lenke.no/kjempelanglenke
                        </a>
                    </div>
                    <button className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md">
                        Logg inn
                    </button>
                </div>
            </main>

            <footer className="bg-white p-4 text-center text-sm">
                <a href="#" className="text-gray-500 hover:text-gray-700">⬅️ Gå tilbake til hjemmesiden</a>
            </footer>
        </div>
    );
};

export default Url;
