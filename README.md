# RBD Dashboard 2026 — Server

Express.js backend pro RBD Dashboard. Hostuje dashboard i ukládá data.  
Kolegové nepotřebují žádné klíče — stačí URL.

---

## Nasazení na Render.com (zdarma, 5 minut)

### 1. Připrav GitHub repozitář

Struktura repozitáře:
```
RBD-Dashboard-2026/
├── server.js
├── package.json
├── render.yaml
└── public/
    └── index.html
```

Nahraj všechny tyto soubory do GitHubu.

### 2. Vytvoř Web Service na Render.com

1. Jdi na [render.com](https://render.com) → **New → Web Service**
2. Připoj repozitář
3. Nastavení se načte automaticky z `render.yaml`
4. Klikni **Create Web Service**

> ⚠️ Zvol **Web Service** (ne Static Site) — potřebuješ Node.js server.

### 3. Nastav Persistent Disk (důležité!)

Bez disku se data smažou při každém restartu serveru.

1. V Render dashboardu → tvůj service → **Disks**
2. **Add Disk**:
   - Name: `rbd-data`
   - Mount Path: `/data`
   - Size: 1 GB (zdarma)
3. Uložit

> Disk je součástí `render.yaml` — může se nastavit automaticky.

### 4. Hotovo!

Dashboard bude dostupný na:  
`https://rbd-dashboard-2026.onrender.com`

Sdílej URL s kolegy — žádné klíče, žádná konfigurace.

---

## Environment Variables (volitelné)

Nastav v Render → Environment:

| Proměnná | Výchozí | Popis |
|----------|---------|-------|
| `DATA_DIR` | `/data` | Cesta k perzistentnímu disku |
| `PORT` | `3000` | Port serveru (Render nastaví automaticky) |
| `RBD_WRITE_KEY` | *(prázdné)* | Pokud nastavíš, musí ho klienti poslat v hlavičce. Nech prázdné pro interní tým. |

---

## API Endpoints

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| `GET` | `/api/load` | Načte uložená data |
| `POST` | `/api/save` | Uloží data (JSON body) |
| `GET` | `/api/health` | Health check |
| `GET` | `/*` | Servíruje dashboard (index.html) |

---

## Lokální spuštění (pro testování)

```bash
cd server/
npm install
node server.js
# → http://localhost:3000
```

Data se uloží do `./rbd_data.json`.

---

## Poznámky

- **Render free tier** se po 15 min nečinnosti uspí → první načtení trvá ~30 s
- Pokud chceš zabránit uspání: nastav Render health check nebo uptime monitor
- Data jsou v `/data/rbd_data.json` — lze stáhnout přes Render Shell
