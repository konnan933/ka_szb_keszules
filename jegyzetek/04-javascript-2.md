# Jegyzet – 04. JavaScript 2. rész (Promise, async/await, Fetch)

## Az aszinkronitás problémája
- A JavaScript alapvetően **aszinkron**: pl. `loadScript(src)` után a betöltött script függvénye még nem érhető el azonnal (a script aszinkron töltődik).
- **Callback** megoldás: a műveletnek átadunk egy callback függvényt, ami a befejezéskor (pl. `script.onload`) fut le.
- Sok egymásra épülő aszinkron művelet + hibakezelés → mélyen egymásba ágyazott callbackek = **"callback hell" / pyramid of doom** (nehezen olvasható).

## Promise
- A **Promise** egy objektum, ami **majd a jövőben** ad vissza egy értéket – ezért ideális aszinkron műveletek kezelésére.
- **Három állapot**: **pending** (függőben, result: undefined) → **fulfilled** (sikeres, result: value) VAGY **rejected** (hiba, result: error). Pendingből indul, fulfilled/rejected-ben végződik (utána nem változik).
- Létrehozás: `new Promise((resolve, reject) => { ... })` – az executor `resolve(value)`-t vagy `reject(error)`-t hív.

### Eredmény feldolgozása
- `.then(success, error)`: a Promise lefutásakor hívódik; siker → success handler, hiba → error handler (opcionális).
- `.catch(f)`: csak hiba (rejected) esetén fut.
- `.finally(f)`: minden esetben lefut (siker és hiba is), de nem tudja, melyik volt; tipikusan takarításra (pl. loading indikátor eltüntetése).

### Promise chain és API
- **Chain**: `promise.then(...).then(...).then(...)` – a láncban a köztes then visszatérési értéke megy tovább (ez NEM ugyanaz, mint ugyanazon promise-on háromszor `.then()`-t hívni, az három párhuzamos ág).
- `Promise.all(promises)`: megvárja az összeset; ha bármelyik hibázik, az egész hibával tér vissza.
- `Promise.allSettled(promises)`: megvárja az összeset, mindegyikről visszaadja status (fulfilled/rejected) + value/reason.
- `Promise.race(promises)`: az **első befejeződő** (siker vagy hiba) eredményét adja.
- `Promise.any(promises)`: az **első sikeresen** befejeződőt; ha mind hibás, AggregateError.

## async / await
- `async function` → mindig **Promise-szal** tér vissza (nem-promise visszatérést Promise-ba csomagol). `f().then(...)`.
- `await promise` (csak async függvényben): **megvárja** a Promise teljesülését és visszaadja az értékét – szinkron stílusú, olvashatóbb kód.

## Fetch API
- `fetch(url, [options])` – hálózati kérés a szerver felé (régen XmlHttpRequest). Modern böngészőkben, polyfill-lel régiekhez. Támogatja a CORS-t. **Promise-szal** tér vissza.
- A Promise **csak hálózati hibánál** reject-elődik; ha a szerver válaszolt (akár 404/500), sikeres. A `response.ok` jelzi a 200-299 tartományt, `response.status` a kódot. Cross-origin sütiket nem küld alapból.
- A választ **két lépésben** nyerjük: 1) `fetch` → `Response` objektum (headerek, status, ok), 2) a body újabb Promise-szal pl. `response.json()`.
```js
let response = await fetch(url);
if (response.ok) { let json = await response.json(); }
else { alert("HTTP-Error: " + response.status); }
```
- POST: `fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(obj) })`.
