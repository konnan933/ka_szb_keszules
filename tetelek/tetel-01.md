# 1. tétel – Weboldal, kiszolgálás, weboldal vs. webalkalmazás, fejlesztői környezet

> Mi a weboldal, és hogyan történik a weboldalak kiszolgálása? Miben tér el egy weboldal egy webalkalmazástól? Milyen specialitásai vannak a fejlesztési környezetnek?

*(Forrás: 01-es PDF – Webes architektúra, HTTP, HTML)*

---

## 1. Mi a weboldal?

A **weboldal** egy böngészőben megjeleníthető dokumentum, amelyet a böngésző tölt le és jelenít meg. Felépítéséhez tartozó erőforrások:
- **HTML** – a struktúra (jelölőnyelv, ami leírja a böngészőnek, hogyan épül fel az oldal),
- **CSS** – a megjelenés,
- **JavaScript** – a viselkedés/interaktivitás,
- **képek, média** stb.

Egy weboldal letöltése jellemzően **több HTTP kérésből** áll: külön kérés megy a HTML-re, a CSS-re, az egyes képekre, videókra – ezek akár különböző szerverekről (web szerver, ads szerver, video szerver) is érkezhetnek.

## 2. Hogyan történik a kiszolgálás? (Webes architektúra)

A klasszikus többrétegű architektúra:

**Kliens (böngésző / mobil kliens) → Internet → Web szerver → Alkalmazás szerver → Adatbázis szerver**

### Web szerver két szempontból
- **Hardver**: internetre kapcsolt számítógép, amin fut a web szerver szoftver és amin a kiszolgálandó fájlokat tárolják.
- **Szoftver**: olyan alkalmazás, amely
  - egy adott **porton figyeli** a beérkező kéréseket,
  - **feloldja az URL-eket**, és ez alapján statikus vagy dinamikus tartalmat szolgáltat,
  - megérti és kiszolgálja a beérkező **HTTP kéréseket**,
  - szabályozza, mit és hogyan lehet elérni a weben keresztül.

A website beállításai: fizikai útvonal a fájlokhoz, port, milyen felhasználó nevében fusson a kiszolgáló processz, kell-e bejelentkezés, szükséges-e HTTPS.

### Kommunikáció: request–response (pull model)
- Mindig **a kliens kezdeményez**, a szerver csak válaszol.
- A kérés egy adott URL-re küldött, megfelelően formázott csomag.
- A szerver feldolgozza a kérést és előállítja a szöveges HTTP **válaszüzenetet**:
  - **Statikus kiszolgálás**: fájlokat szolgál ki az URL → fájlrendszer megfeleltetés alapján.
  - **Dinamikus kiszolgálás**: a tartalmat a kérés paraméterei és az app állapota (memória, DB) alapján állítja elő.

### Statikus vs. dinamikus kiszolgálás
| Statikus | Dinamikus |
|----------|-----------|
| Egyszerű, olcsó, hatékony | Bonyolult, drága, lassabb |
| Tartalom csak a fájlok módosításával frissül | Tartalom újraindítás/telepítés nélkül frissül |

## 3. Weboldal vs. webalkalmazás

A különbség a **kiszolgálás módja** és a **statikus/dinamikus jelleg** mentén ragadható meg, és FONTOS, hogy a "statikus kiszolgálás ≠ statikus weboldal":

- **Statikus weboldal** = csak statikus kiszolgálás: egyszerű HTML fájlok letöltése, a tartalom nem (vagy alig) változik, nincs valódi alkalmazáslogika.
- **Webalkalmazás (dinamikus weboldal)** = interaktív, alkalmazásként viselkedik, állapotot kezel, a felhasználóval párbeszédet folytat.
  - Fontos: a dinamikus weboldal **≠ csak dinamikus kiszolgálás**. Pl. egy **Single Page Application (SPA)** valójában statikus HTML és JS fájlok kiszolgálása, de ezek a fájlok futás közben egy **API-ról töltik le az adatokat**, és a statikus JS kódból módosítják az oldal tartalmát.

Röviden: a weboldal inkább **dokumentum-szemléletű** (tartalom megjelenítése), a webalkalmazás **alkalmazás-szemléletű** (funkcionalitás, állapotkezelés, szerverrel folytatott adatkommunikáció).

## 4. A fejlesztési környezet specialitásai

A webes fejlesztés sajátosságai, amelyek megkülönböztetik más platformoktól:

- **Állapotmentes (stateless) HTTP**: az egyes kérések között a protokoll nem őriz állapotot. Külön gondoskodni kell az állapotkezelésről (cookie, session, local/session storage, URL paraméter, rejtett mező, Authorization fejléc).
- **Több, együttműködő technológia**: HTML (struktúra) + CSS (megjelenés) + JavaScript (viselkedés) együtt, ehhez jön a szerveroldal és az adatbázis.
- **Böngésző-támogatás problémája**: nincs 100%-ban "HTML kompatibilis" böngésző; egyes elemek böngészőnként eltérően viselkednek/jelennek meg. A HTML "mozgó célpont" (folyamatosan változik, a Living Standard frissül). Egy webes projekt legfontosabb kérdése, hogy **mik a minimális támogatott böngészőverziók** – ezeket külön ellenőrizni kell (pl. caniuse.com).
- **Kliens-szerver szétválasztás**: a kód egy része a kliensen (böngészőben), másik része a szerveren fut – más a hibakeresés, más a biztonsági modell.
- **Biztonság a fókuszban**: HTTPS (titkosítás, szerverazonosítás, integritás), tanúsítványok, XSS/XSRF elleni védelem (HttpOnly, SameSite), GDPR cookie-szabályozás.
- **Fejlesztői eszközök**: böngésző Dev Tools (Network tab a hálózati forgalom monitorozására), Postman (REST API tesztelés), web szerver (pl. IIS) konfiguráció, Live Server statikus kiszolgáláshoz.
- **Skálázódási szempontok**: már tervezéskor mérlegelni kell a kliens- vs. szerveroldali állapottárolás skálázódását (sok felhasználó vs. nagy adatmennyiség), szerver farm esetén a terheléselosztást (server affinity / state server).

---

### Kapcsolódó tételek
- A HTTP részletei és a REST is itt érintettek, de a [[tetel-02]] az HTML/CSS-re, a webes biztonság (HTTPS, cookie) szintén ehhez a PDF-hez tartozik.
