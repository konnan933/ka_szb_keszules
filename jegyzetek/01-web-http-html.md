# Jegyzet – 01. Webes architektúra, HTTP, HTML

## Webes architektúra
- Rétegek: **Kliens** (böngésző / mobil kliens) → **Internet** → **Web szerver** → **Alkalmazás szerver** → **Adatbázis szerver**.
- Statikus tartalom: HTML, JS, CSS, képek a web szerverről.

### Web szerver
- **Hardver**: internetre kapcsolt gép, ezen fut a web szerver szoftver, itt tárolják a kiszolgálandó fájlokat.
- **Szoftver**: adott porton figyeli a kéréseket, feloldja az URL-eket (statikus/dinamikus tartalom), megérti és kiszolgálja a HTTP kéréseket, szabályozza a hozzáférést.
- **Website beállításai**: fizikai útvonal, port, milyen user nevében fusson a processz, bejelentkezés, HTTPS szükségessége.

## HTTP kommunikáció
- **Request-response (pull model)**: mindig a kliens kezdeményez, a szerver válaszol.
- **User agent**: bármilyen alkalmazás ami HTTP kérést tud küldeni (böngésző, mobil kliens, RSS olvasó).
- Egy weboldal letöltése **több HTTP kérésből** áll (HTML, CSS, képek, video külön kérésekkel, akár külön szerverekről).

### Statikus vs dinamikus kiszolgálás
- **Statikus**: egyszerű, olcsó, hatékony; tartalom csak fájlok módosításával frissül.
- **Dinamikus**: bonyolult, drága, lassabb; tartalom újraindítás/telepítés nélkül frissül (kérés paraméterei + app állapot alapján).
- Statikus kiszolgálás ≠ statikus weboldal. SPA = statikus HTML+JS kiszolgálás, ami API-ról tölti az adatokat.

### Kérés/válasz felépítése
- **Kérés**: Request line (`GET /doc/test.html HTTP/1.1`) + headers + üres sor + body.
- **Válasz**: Status line (`HTTP/1.1 200 OK`) + headers + üres sor + body.

### HTTP állapotmentes (stateless)
- Kérések között nincs állapotmegőrzés. Megoldás: cookie, session, rejtett mező, URL paraméter, HTTP fejléc (pl. Authorization Bearer token).
- **Session**: első és utolsó kérés közti tranzakciók, időkorlátos (pl. 20 perces sliding timeout).

### Kapcsolatkezelés (TCP alatta)
- HTTP/1.0: minden kéréshez új TCP kapcsolat.
- HTTP/1.1: pipelining, kapcsolat nyitva marad (Connection: Close-ig).
- HTTP/2: egyetlen kapcsolaton multiplexelés.
- HTTP/3: QUIC (UDP-re épül).

### URL felépítése
`protocol://username:password@FQDN:port/path/file?var1=value1&var2=value2#fragment`
- Részek: scheme, subdomain, domain, TLD, path, file, query string, fragment.
- A **fragment nem jut el a szerverre**, a kliens dolgozik vele.
- **Absolute** vs **Relative** URL (utóbbi: dokumentumhoz vagy root-hoz relatív).
- `http://www.google.com@www.bme.hu` → bme.hu töltődik be (phishing veszély).

### Metódusok
- GET (letöltés), POST (adat felküldése/létrehozás), PUT/PATCH (frissítés), DELETE (törlés), HEAD (csak fejléc, nincs body), OPTIONS (támogatott metódusok), TRACE (diagnosztika).
- **Biztonságos (safe)**: nincs mellékhatás (GET, HEAD, OPTIONS, TRACE).
- **Idempotens**: többszöri végrehajtás = egyszeri hatás. Safe + PUT, DELETE. POST/PATCH általában nem idempotens. POST-Redirect-GET (PRG) pattern.

### Fejléc mezők (RFC 2616)
- Szerver: Date, Server. Tartalom: Accept, Accept-Encoding, Accept-Language, Content-Type/Length/Disposition/Encoding.
- Cache: Cache-Control, Expires, If-Modified-Since, Last-Modified, ETag.
- Biztonság: Authorization, WWW-Authenticate, X-Frame-Options, DNT.

### Státuszkódok
- 1xx info (100 Continue, 101 Switching), 2xx siker (200 OK, 201 Created, 204 No content), 3xx redirect (301 Moved permanently, 302 Found, 304 Not modified), 4xx kliens hiba (400, 401, 403, 404, 405, 410, 413, 414), 5xx szerver hiba (500, 503).

### REST
- Erőforrás alapú (URI) webes API, adat JSON/XML-ben, HTTP metódusokat használ.
- POST (létrehoz, szerver ad URI-t), PUT (létrehoz/lecserél, kliens adja URI-t és teljes adatot), PATCH (részleges frissítés, hatékonyabb), DELETE.
- **Backend as a service** (pl. Firebase): adatstruktúrából automatikus DB + CRUD REST végpontok.
- Postman: REST API tesztelő kliens.

## HTML
- **Hypertext Markup Language** – jelölőnyelv, a weboldal struktúráját írja le a böngészőnek.
- Történet: 1991 első HTML, XHTML 1.0/2.0 (zsákutca), 2012 HTML5 (megengedő, visszafelé kompatibilis), ma **HTML Living Standard** (WHATWG).

### HTML elem felépítése
- Nyitó tag `<p>`, tartalom, lezáró tag `</p>`. Üres elem nincs lezáró tag (`<img>`, `<br>`).
- **Attribútumok**: nyitó tagben, `név="érték"`, bool attribútumnál érték elhagyható (`disabled`).
- Gyakori attribútumok: `id`, `title`, `class`, `style` (inline style kerülendő).

### Helló világ szerkezet
- `<!doctype html>`, `<html>` (gyökér), `<head>` (metaadat, CSS link), `<body>` (megjelenő tartalom).
- `<head>`: charset, title, viewport meta, CSS link; JS-t a body vége elé érdemes.

### Szemantikus oldalváz
- `<header>`, `<nav>`, `<aside>`, `<section>`, `<article>`, `<footer>`.
- Előny: jelentéssel bírnak (`<div>`-nek nincs), böngésző/keresőmotor/felolvasó értelmezheti, SEO.

### Blokk vs inline elem
- **Blokk**: új sorban (`<div>`, `<p>`, lista, footer). **Inline**: előző elem mögött (`<span>`, link, bold).

### Gyakori elemek
- Bekezdés `<p>`, formázás `<b>/<i>/<u>`, szemantikus `<strong>/<em>`.
- Link `<a href="..." target="_blank">`, `mailto:`.
- Kép `<img src alt width/height>` (csak egyik méretet adjuk meg).
- Listák `<ul>/<ol>` + `<li>`. Táblázat `<table>`, `<tr>`, `<td>`, `<thead>`, `<tbody>`, `<th scope>`, `<caption>`.
- Audio/video: `<audio>/<video controls>` + `<source>` (több formátum fallback).

### HTML űrlapok
- `<form action="..." method="get/post">`: `<label>`, `<input type>`, `<button>`/`<input type="submit">`.
- input típusok: text/password/number, radio/checkbox, button/submit/reset, file, date-félék, email/range/search/tel/url/color. Többsoros: `<textarea>`.
- `<label for="id">` a beviteli mezőhöz köti (kattintásra fókusz).
- input attribútumok: placeholder, readonly, disabled, autocomplete, autofocus.
- `<select>` + `<option>` + `<optgroup>`, szűrhető `<datalist>`.
- Fájl feltöltés: `<input type="file" multiple>`, `enctype="multipart/form-data"`.

### Validáció (HTML, JS nélkül)
- Attribútumok: `required`, `pattern` (regex) + `title`, `maxlength`, `min/max/step`. `novalidate` kikapcsolja.
- Validációs API: willValidate, validity (ValidityState), validationMessage, checkValidity(), setCustomValidity().
- Bootstrap: szép validációs megjelenés.

## Állapotmegőrzés
- **Kliens oldali tárolás** (minden kérésnél utazik): URL paraméter, rejtett mező, cookie, local/session storage, IndexedDB, (virtuális) file system.
  - Előny: nem igényel szerver erőforrást, jól skálázódik felhasználószámra. Hátrány: méretkorlát, sávszélesség, MITM láthatja.
- **Szerver oldali tárolás** (csak session ID utazik): előny a kliensoldali hátrányok megszűnése. Hátrány: memóriaigény, szerver farm → server affinity vagy state server (single point of failure).

### Cookie (RFC 6265)
- Memória a HTTP-hez. SessionID-t küld le, böngésző visszaküldi. Szöveges, nem futtatható.
- Tartalom: Name, Value, Expiration date, Path (alap "/"), Domain, Secure (csak HTTPS), HttpOnly (JS ne férjen hozzá).
- Típusok: **session cookie** (böngésző bezárásig), **permanent/persistent** (diszkre, "Remember me").
- Fejlécek: `Set-Cookie` (létrehozás), `Cookie` (visszaküldés). Törlés: üres tartalom + múltbeli lejárat.
- **3rd party cookie**: cross-site tracking. **GDPR**: figyelmeztetni kell, típusonként kikapcsolható.
- Biztonság: HTTPS+Secure (eavesdropping), HMAC/aláírás (tampering), HttpOnly (XSS), SameSite Strict/Lax (XSRF), `__Host-` prefix.

## HTTPS
- HTTP + SSL/TLS. Nem önálló protokoll ("HTTP over SSL"). Port 443, `https://` séma.
- Funkciók: **szerver azonosítás** (authentication), **titkosítás** (encryption, eavesdropping ellen), **integritás** (tampering ellen). Mixed content warning ha van HTTP tartalom.

### Tanúsítvány (X.509 certificate)
- Trusted 3rd party (CA) igazolja a szerver hitelességét. Certificate chain (Root CA → Intermediate CA → szerver).
- Részei: signature algorithm, issuer, valid from/to, subject, public key, thumbprint, SAN (alternatív FQDN-ek).
- **Privát kulcs** nem része a tanúsítványnak, a szerveren keletkezik, nem jut el a CA-hoz.
- Készítés: CSR (kulcspár generálás, csak public kulcs a kérelemben) → feltöltés CA-hoz → befejezés a szerveren → HTTPS binding.
- **Self-signed**: olcsó/gyors/titkosít, de nem azonosít, MITM-mel kijátszható.
- **Érvényes, ha**: kiállító hiteles (Trusted Root CA), nem járt le, az adott szerverre állították ki (CN/SAN = FQDN), nem vonták vissza (CRL / OCSP).
- Wildcard `*.example.com` (1 szint, EV nem támogatja).
- **TLS handshake**: ClientHello → ServerHello+Certificate → ClientKeyExchange (szimmetrikus kulcs titkosítva a public kulccsal) → titkosított adat. TLS 1.2 = 2 roundtrip, TLS 1.3 = 1 roundtrip, HTTP/3 QUIC mindig titkosított.
