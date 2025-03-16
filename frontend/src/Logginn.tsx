const Logginn = () => {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">
            <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
                <img src="/nav-logo.png" alt="NAV logo" className="h-10" />
                <div className="flex space-x-8 text-gray-700 font-medium">
                    <a href="#">Hjem</a>
                    <a href="#">Privat</a>
                    <a href="#">Arbeidsgiver</a>
                    <a href="#">Samarbeidspartnere</a>
                    <input placeholder="Søk" className="border rounded px-2" />
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-8">Velkommen tilbake!</h1>
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Brukernavn"
                        className="border border-gray-400 px-4 py-2 rounded w-80"
                    />
                    <input
                        type="password"
                        placeholder="Passord"
                        className="border border-gray-400 px-4 py-2 rounded w-80"
                    />
                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded w-80">
                        Logg inn
                    </button>
                </div>
            </main>

            <footer className="bg-gray-200 p-6">
                <div className="grid grid-cols-4 gap-4 text-sm">
                    <ul>
                        <li>Kontakt</li>
                        <li>Kontakt oss</li>
                        <li>NAV i ditt fylke</li>
                        <li>Kurs fra NAV</li>
                        <li>Klage og tilbakemeldinger</li>
                    </ul>
                    <ul>
                        <li>NAV og samfunn</li>
                        <li>Statistikk, analyse og FoU</li>
                        <li>Lover og regler (lovdata.no)</li>
                        <li>Om NAV</li>
                    </ul>
                    <ul>
                        <li>English</li>
                        <li>Sámegiella</li>
                    </ul>
                    <ul>
                        <li>Personvern og informasjonskapsler</li>
                        <li>Endre samtykke for informasjonskapsler</li>
                        <li>Svindelforsøk og sikkerhet</li>
                        <li>Tilgjengelighet</li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default Logginn;
