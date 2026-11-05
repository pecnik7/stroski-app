import {useState, useEffect} from 'react';

function ExpenseList() {

    const API = 'http://localhost:8080/strosek';
    const prazen = {naslov: "", znesek: "", kategorija: "", datum: "", opis: ""};
    //stroski = trenutna vrednost, setStroski = funkcija s katero se vrednost spremeni
    //useState([]) = začetna vrednost je prazen seznam
    const [stroski, setStroski] = useState([]);
    const[form, setForm] = useState(prazen);
    const[urediId, setUrediId] = useState(null);

    const [filterKategorija, setFilterKategorija] = useState("");
    const [filterDatum, setFilterDatum] = useState("");

    const [iskalniNiz, setIskalniNiz] = useState("");
    const [sortiranje, setSortiranje] = useState("datum-desc");

    const [skupajPoKategorijah, setSkupajPoKategorijah] = useState([]);

    const dostopneKategorije = [
        "Hrana", 
        "Prevoz", 
        "Stanovanje", 
        "Zabava", 
        "Oblačila", 
        "Zdravje", 
        "Ostalo"
    ];

    const naloziSkupaj = () => {
        fetch(`${API}/po-kategorijah`)
            .then(response => {
                if (!response.ok) throw new Error('Napaka: ' + response.statusText);
                return response.json();
            })
            .then(data => setSkupajPoKategorijah(data))
            .catch(error => console.error('Napaka pri fetchanju vsot: ', error));
    };

    const naloziStroske = () => {
        const parametri = new URLSearchParams();
        if (filterKategorija !== "") parametri.append("kategorija", filterKategorija);
        if (filterDatum !== "") parametri.append("datum", filterDatum);

        const url = parametri.toString() ? `${API}?${parametri.toString()}` : API;

        fetch(url)
            .then(response =>{
                if(!response.ok) throw new Error('Napaka: ' + response.statusText);
                return response.json();
            })
            .then(data => setStroski(data))
            .catch(error => console.error('Napaka pri fetchanju: ', error));

        naloziSkupaj();
    };

    useEffect(() => {naloziStroske();}, [filterKategorija, filterDatum]);

    const spremeni = (e) => setForm({...form, [e.target.name]: e.target.value });

    const shrani = (e) => {
        e.preventDefault();

        fetch(urediId ? `${API}/${urediId}` : API, {
            method: urediId ? 'PUT' : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...form, znesek: Number(form.znesek)})
        })
            .then(response =>{
                if(!response.ok) throw new Error('Napaka pri shranjevanju');
                setForm(prazen);
                setUrediId(null);
                naloziStroske();
            })
            .catch(error => console.error(error));
    };

    const uredi = (s) => {
        setForm({naslov: s.naslov, znesek: s.znesek, kategorija: s.kategorija, datum: s.datum, opis: s.opis || "" });
        setUrediId(s.id);
    };

    const izbrisi = (id) => {
        if (!window.confirm('Res izbrišem?')) return; 
        fetch(`${API}/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Napaka pri brisanju');
                naloziStroske();
            })
            .catch(error => console.error(error));
    };

    

    const filtriraniStroski = stroski.filter(strosek => {
        return iskalniNiz === "" ||
            strosek.naslov.toLowerCase().includes(iskalniNiz.toLowerCase());
    });

    const urejeniStroski = [...filtriraniStroski].sort((a, b) => {
        if (sortiranje === "naziv") {
            const nazivA = a.naslov || "";
            const nazivB = b.naslov || "";
            return nazivA.localeCompare(nazivB);
        } 
        else if (sortiranje === "znesek-asc") {
            return Number(a.znesek || 0) - Number(b.znesek || 0);
        } 
        else if (sortiranje === "znesek-desc") {
            return Number(b.znesek || 0) - Number(a.znesek || 0);
        } 
        else if (sortiranje === "datum-asc") {
            return new Date(a.datum) - new Date(b.datum);
        } 
        else {
            return new Date(b.datum) - new Date(a.datum);
        }
    });

   return (
        <div className="expense-app">
            <h1>Stroški</h1>
            <p className="subtitle">Pregled in vnos osebnih stroškov</p>

            <form className="expense-form" onSubmit={shrani}>
                <h2 className="form-title">{urediId ? 'Urejanje stroška' : 'Nov strošek'}</h2>

                <label className="field full">
                    <span>Naslov</span>
                    <input name="naslov" placeholder="npr. Nakup v trgovini" value={form.naslov} onChange={spremeni} required />
                </label>

                <label className="field">
                    <span>Znesek (€)</span>
                    <input name="znesek" type="number" step="0.01" placeholder="0.00" value={form.znesek} onChange={spremeni} required />
                </label>

                <label className="field">
                    <span>Kategorija</span>
                    <select name="kategorija" value={form.kategorija} onChange={spremeni} required>
                        <option value="">-- Izberi kategorijo --</option>
                        <option value="Hrana">Hrana</option>
                        <option value="Prevoz">Prevoz</option>
                        <option value="Stanovanje">Stanovanje</option>
                        <option value="Zabava">Zabava</option>
                        <option value="Oblačila">Oblačila</option>
                        <option value="Zdravje">Zdravje</option>
                        <option value="Ostalo">Ostalo</option>
                    </select>
                </label>

                <label className="field">
                    <span>Datum</span>
                    <input name="datum" type="date" value={form.datum} onChange={spremeni} required />
                </label>

                <label className="field">
                    <span>Opis (neobvezno)</span>
                    <input name="opis" placeholder="Dodatne opombe" value={form.opis} onChange={spremeni} />
                </label>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">
                        {urediId ? 'Shrani spremembe' : 'Dodaj strošek'}
                    </button>
                    {urediId && (
                        <button type="button" onClick={() => { setForm(prazen); setUrediId(null); }}>
                            Prekliči
                        </button>
                    )}
                </div>
            </form>

            <h2 className="list-title">Skupaj po kategorijah</h2>
            <div className="expense-list">
                {skupajPoKategorijah.length === 0 ? (
                    <p>Ni podatkov.</p>
                ) : (
                    skupajPoKategorijah.map(vrstica => (
                        <div className="expense-item" key={vrstica.kategorija}>
                            <span className="expense-title">{vrstica.kategorija}</span>
                            <span className="expense-amount">{Number(vrstica.skupaj).toFixed(2)} €</span>
                        </div>
                    ))
                )}
            </div>

            <h2 className="list-title">Vsi stroški</h2>
            <div className="filter-container" style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Filter po kategoriji:</label>
                    <select 
                        value={filterKategorija} 
                        onChange={(e) => setFilterKategorija(e.target.value)}
                        style={{ padding: '6px' }}
                    >
                        <option value="">Vse kategorije</option>
                        {dostopneKategorije.map(kat => (
                            <option key={kat} value={kat}>{kat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Filter po datumu:</label>
                    <input 
                        type="date" 
                        value={filterDatum} 
                        onChange={(e) => setFilterDatum(e.target.value)} 
                        style={{ padding: '5px' }}
                    />
                </div>

                {(filterKategorija || filterDatum) && (
                    <div>
                        <button onClick={() => { setFilterKategorija(""); setFilterDatum(""); }}>
                            Počisti filtre
                        </button>
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Iskalni niz:</label>
                        <input 
                        type="text" 
                        value={iskalniNiz} 
                        placeholder='npr. Kosilo'
                        onChange={(e) => setIskalniNiz(e.target.value)} 
                        style={{ padding: '5px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Razvrsti po:</label>
                    <select 
                        value={sortiranje} 
                        onChange={(e) => setSortiranje(e.target.value)}
                        style={{ padding: '6px' }}
                    >
                        <option value="datum-desc">Najnovejše naprej</option>
                        <option value="datum-asc">Najstarejše naprej</option>
                        <option value="naziv">Naziv (A-Ž)</option>
                        <option value="znesek-desc">Znesek: od najvišjega</option>
                        <option value="znesek-asc">Znesek: od najnižjega</option>
                    </select>
                </div>
            </div>

            <div className="expense-list">
                {urejeniStroski.length === 0 ? (
                    <p>Ni najdenih stroškov, ki bi ustrezali kriterijem.</p>
                ) : (
                    urejeniStroski.map(strosek => (
                        <div className="expense-item" key={strosek.id}>
                            <div className="expense-info">
                                <span className="expense-title">{strosek.naslov}</span>
                                <span className="expense-meta">
                                    {strosek.kategorija} · {strosek.datum}{strosek.opis ? ` · ${strosek.opis}` : ''}
                                </span>
                            </div>
                            <span className="expense-amount">{strosek.znesek} €</span>
                            <div className="expense-buttons">
                                <button onClick={() => uredi(strosek)}>Uredi</button>
                                <button className="btn-delete" onClick={() => izbrisi(strosek.id)}>Izbriši</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ExpenseList;