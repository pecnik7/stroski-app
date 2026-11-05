# Stroški

Aplikacija za spremljanje osebnih stroškov, narejena za predmet Razvoj informacijskih sistemov (2. letnik, 1. semester).

## O projektu

Z aplikacijo lahko vnašaš svoje stroške (naslov, znesek, kategorija, datum in opis), jih urejaš in brišeš. Seznam stroškov se da filtrirati po kategoriji in po datumu, aplikacija pa prikaže tudi skupno vsoto stroškov za vsako kategorijo.

Filtriranje po kategoriji in datumu ter seštevanje po kategorijah naredi backend (poizvedbe v bazi), frontend samo pošlje parametre in prikaže rezultat. Iskanje po naslovu in sortiranje se izvedeta na frontendu.

## Uporabljene tehnologije

Backend:
- Java 21
- Spring Boot 4.1.1 (Spring Web, Spring Data JPA)
- PostgreSQL 16
- springdoc-openapi (Swagger)
- Maven (priložen je Maven Wrapper)

Frontend:
- React 19.3
- Vite 8
- ESLint 10
- Node.js 22

Ostalo:
- Docker (za bazo)
- Git in GitHub

## Struktura projekta

```
stroski-app/
├── backend/
│   ├── src/main/java/si/feri/backend/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   └── BackendApplication.java
│   ├── src/main/resources/application.properties
│   ├── src/test/
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   └── main.jsx
│   └── package.json
├── .gitignore
├── docker-compose.yml
└── README.md
```

- `backend/.../controller` vsebuje REST kontroler `StrosekController`, ki sprejema zahteve na `/strosek`.
- `backend/.../model` vsebuje entiteto `Strosek`, ki se shrani v bazo.
- `backend/.../repository` vsebuje repozitorij s poizvedbami (filtriranje po kategoriji in datumu, vsote po kategorijah).
- `frontend/src/components` vsebuje React komponente, med njimi `ExpenseList` (obrazec, filtri in seznam stroškov).

## Navodila za nameščanje in zagon

### Kaj moraš imeti nameščeno

- Java JDK 21 (preveri z `java -version`)
- Node.js 22 ali novejši (`node -v`)
- Docker Desktop (`docker -v`)
- Git

Maven ni potreben, ker uporabljamo `mvnw`.

### 1. Prenos projekta

```bash
git clone https://github.com/pecnik7/stroski-app.git
cd stroski-app
```

### 2. Geslo za bazo

Geslo za bazo ni v kodi, ampak v okoljski spremenljivki `DB_PASSWORD`. V korenski mapi ustvari datoteko `.env` (kot primer je `.env.example`) in vanjo zapiši:

```
DB_PASSWORD=tvoje_geslo
```

Datoteke `.env` ne nalagamo na GitHub.

### 3. Zagon baze

V korenski mapi:

```bash
docker compose up -d
```

To zažene PostgreSQL v kontejnerju `stroski-postgres` na vratih 5432. Baza se imenuje `stroski_db`.

### 4. Zagon backenda

Najprej nastavi geslo v terminalu, potem zaženi aplikacijo.

Windows (CMD):
```bash
cd backend
set DB_PASSWORD=tvoje_geslo
mvnw.cmd spring-boot:run
```

Linux ali macOS:
```bash
cd backend
export DB_PASSWORD=tvoje_geslo
./mvnw spring-boot:run
```

Backend teče na http://localhost:8080, Swagger pa je na http://localhost:8080/swagger-ui/index.html.

### 5. Zagon frontenda

V novem terminalu:

```bash
cd frontend
npm install
npm run dev
```

Aplikacija je potem na http://localhost:5173 (točen naslov izpiše Vite, v tem primeru http://localhost:3000).

### API

- `GET /strosek` vrne vse stroške (neobvezno `?kategorija=Hrana` in `?datum=2026-11-04`)
- `GET /strosek/po-kategorijah` vrne vsoto stroškov po kategorijah
- `POST /strosek` doda strošek
- `PUT /strosek/{id}` uredi strošek
- `DELETE /strosek/{id}` izbriše strošek

## Navodila za razvijalce

Veja `main` naj vedno deluje, zato direktno nanjo ne pišemo. Za vsako novost ali popravek naredimo svojo vejo:

```bash
git checkout main
git pull
git checkout -b feature/ime-veje
```

Ko je delo končano, vejo pushamo in odpremo pull request v `main`:

```bash
git push -u origin feature/ime-veje
```

Poimenovanje vej:
- `feature/...` za nove funkcionalnosti
- `fix/...` za popravke
- `docs/...` za dokumentacijo

Sporočila commitov so kratka in povedo, kaj je bilo narejeno, npr. `feat: filtriranje po kategoriji na backendu` ali `fix: napaka pri datumu`.

Preden spremembo oddaš, preveri, da se backend zažene, da frontend gre skozi `npm run build` in da v commit niso zašli `node_modules`, `target` ali `.env`.

## Standardi kodiranja

- Imena razredov so v PascalCase (`StrosekController`), imena metod in spremenljivk v camelCase (`findByKategorija`).
- Imena domenskih stvari so v slovenščini (`Strosek`, `kategorija`, `znesek`), tehnični izrazi pa v angleščini (`controller`, `repository`).
- Backend je ločen na plasti controller, repository in model. V kontrolerju ni SQL-a, filtriranje in grupiranje je v poizvedbah v repozitoriju.
- Frontend uporablja funkcijske komponente in hooke (`useState`, `useEffect`). Komponente so v PascalCase, datoteke imajo končnico `.jsx`.
- Gesel in ključev ne pišemo v kodo, ampak v okoljske spremenljivke.
- Odkomentirane stare kode in nepotrebnih izpisov ne pušamo v repozitoriju.
- Pred commitom na frontendu zaženemo `npm run lint`.
