# 3. tétel – Böngészőben futtatott JavaScript, típusok, konverzió, függvény vs. objektum

> Hogyan működik és mire jó a böngészőben futtatott JavaScript nyelv, és miben tér el az azon kívül futtatott változatokban? Ismertesse a nyelvi típusokat, térjen ki az azok közötti konverzióra! Melyek a főbb különbségek függvények és az objektumok között?

*(Forrás: 03-as PDF – JavaScript 1. rész)*

---

## 1. A böngészőben futtatott JavaScript

### Mi a JavaScript, hogyan működik?
- A JavaScript egy **szkriptnyelv**: a JS **motor** sorról sorra olvassa be és hajtja végre az utasításokat, **nincs előzetes fordítás** (szintaktikai/szemantikai ellenőrzés). Hiba esetén az addigi sorok lefutnak, utána a végrehajtás megáll.
- **Dinamikusan típusos** (nem adunk meg típust, a változó típusa változhat) és **gyengén típusos**.
- Eredeti cél: egyszerű, nem csak profiknak szóló nyelv, ami a Java-t kiegészítve **interaktív weboldalakat** tesz lehetővé.

### Mire jó a böngészőben? (kliensoldali szerep)
Egy modern webalkalmazás három pillérje: **HTML** (tartalom/struktúra) + **CSS** (megjelenés) + **JavaScript** (interaktivitás, viselkedés). A böngészőben futó JS:
- **DOM manipuláció** (DOM API): HTML elemek dinamikus létrehozása/törlése/módosítása, stílusuk módosítása futásidőben.
- **Felhasználói interakciók kezelése** (események: click, change, keypress…).
- **Szerver kommunikáció** (XmlHttpRequest / fetch, tipikusan REST API-n, JSON-nal).
- **Kliens oldali tárolás** (Web Storage, IndexedDB).
- A böngészőben a kódból elérhető a `window` (a tab: console, location, history, globális objektumok), a `navigator` (böngésző állapota, nyelv, geolokáció) és a `document` (a DOM).

A `<script src="...">` taggel kötjük be, teljesítmény okból a `</body>` lezáró tag elé. HTML-be ágyazott JS és inline `onclick=""` lehetséges, de átláthatóság/karbantarthatóság miatt nem célszerű.

### Miben tér el a böngészőn kívül futtatott változat?
- A **böngészőben** rendelkezésre állnak a **Browser API-k** (DOM, window, navigator, document, Web Storage, XmlHttpRequest) – ezek a böngésző által biztosított környezet részei, nem a nyelv magja.
- A **böngészőn kívül** (pl. Node.js, vagy más futtatókörnyezet) ezek a böngésző-specifikus objektumok (window, document, DOM) **nem léteznek** – ott más környezeti API-k vannak (pl. fájlrendszer-elérés, hálózati szerverfunkciók). A nyelv magja (ECMAScript) ugyanaz, de a környezet más.
- **Változatok / szabványosítás**: a nyelvet az **ECMAScript** (ECMA-262) szabványosítja, évente új verzióval; a JScript (Microsoft) és a JavaScript a szabványhoz képest plusz funkciókat ad. **Transpilerek** (source-to-source compiler) is léteznek: Babel (új JS → régi JS böngésző-kompatibilitásért), TypeScript (típusos JS), CoffeeScript.
- **JS ≠ Java**: a JavaScript dinamikusan + gyengén típusos, forráskódból töltődik, prototípus-alapú; a Java statikusan + erősen típusos, bájtkódból, osztály-alapú.

## 2. A nyelvi típusok

### Egyszerű (primitív) adattípusok
| Típus | `typeof` |
|-------|----------|
| `number` (0, 3.14) | "number" |
| `bigint` (`1n`) | "bigint" |
| `string` ("foo") | "string" |
| `boolean` (true/false) | "boolean" |
| `undefined` | "undefined" |
| `null` | **"object"** (hivatalosan elismert hiba, kompatibilitás miatt maradt!) |
| `symbol` (ES6) | "symbol" |

### Összetett adattípus és a függvény
- **Object** (`typeof Math` → "object") – kulcs-érték párok tárolója. A tömb is object.
- **Function** (`typeof alert` → "function") – a függvény külön, teljes értékű típus.

### undefined és falsy/truthy
- Értékadás nélkül létrehozott változó **értéke ÉS típusa is `undefined`**.
- Minden érték bool-lá alakítható (`!!x`):
  - **falsy**: `false`, `0`, `NaN`, `''` (üres string), `null`, `undefined`.
  - **truthy**: minden más, beleértve `'0'`, `'valami'`, `[]`, `{}`.
- Figyelem: `new Boolean(false)` **objektum** (truthy!), míg `Boolean(false)` / `!!false` primitív (false).

## 3. Konverzió a típusok között

A JavaScript **gyengén típusos**, így ahol szükséges, **implicit típuskonverziót** végez. A leglátványosabb a `+` operátornál:
- két string → **konkatenáció**, két number → **összeadás**.
- string és number keveredésekor a number stringgé alakul, **balról jobbra** kiértékelve:
```js
let ev = 2020; let honap = 'január';
ev + honap        // '2020január'
ev + honap + 1    // '2020január1'
ev + 1 + honap    // '2021január'  (előbb 2020+1=2021, majd + 'január')
```

### `==` (laza) vs `===` (szigorú) egyenlőség
- `==` **csak az értéket** hasonlítja, típuskonverzióval: `2020 == '2020'` → **igaz**.
- `===` **a típust is** ellenőrzi: `2020 === '2020'` → **hamis**.
- Ezért szám sosem egyenlő szigorúan egy stringgel. Ajánlott a `===` használata.

### Explicit konverzió / kasztolás
- bool-lá: `Boolean(x)` vagy `!!x`. Számból stringbe és vissza: `String()`, `Number()`, `parseInt()`. Objektum ↔ JSON: `JSON.stringify()` / `JSON.parse()`.

## 4. Függvények vs. objektumok – főbb különbségek

### Objektum
- **Kulcs-érték párok tárolója** (kulcs ~ string, érték tetszőleges típus).
- Elérés: `obj.property` vagy `obj['property']`.
- Sajátosság: nem létező property **olvasása** nem hiba, hanem `undefined`; nem létező property **írása** sem hiba, egyszerűen belekerül.
- `typeof obj` → "object".

### Függvény
- A JavaScriptben a **függvény teljes értékű, önálló típus** (`typeof fv` → "function", nem "object"). Ez a leglényegesebb különbség: bár technikailag a függvény is objektum, a `typeof` külön típusként jelöli.
- Mivel teljes értékű típus (**first-class citizen**), a függvény:
  - **változóba tehető** (`let f = function(){...}`),
  - **paraméterként átadható** egy másik függvénynek (callback), és ott meghívható,
  - **visszatérési értékként visszaadható** (ez teszi lehetővé a closure-öket).
- Nincs overload (azonos nevű függvénynél a később deklarált nyer), a paraméterek opcionálisak (hiányzó = undefined), nincs paraméter-/visszatérési típus.

### Összefoglalva a különbségek
| Szempont | Objektum | Függvény |
|----------|----------|----------|
| `typeof` | "object" | "function" |
| Tartalom | kulcs-érték párok (adat) | végrehajtható kód (viselkedés) |
| Hívható? | nem | igen, `()`-vel |
| Hiányzó tag elérése | undefined / belekerül | – |
| Szerep | adat tárolása | first-class: átadható, visszaadható, változóba tehető |

Megjegyzés: a két fogalom összeér – a függvény is rendelkezhet property-kkel (pl. konstruktor függvény `prototype` property-je), és a `new` operátorral konstruktorként objektumot lehet vele létrehozni. Lásd bővebben a [[tetel-04]] (prototípus alapú öröklés).
