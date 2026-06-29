# Jegyzet – 06. React (első előadás)

## Kliens oldali render – a probléma
- HTML-t generálni nem nehéz (`div.innerHTML = template string`), de:
  - A teljes HTML cseréje **villog**, **lassú** (10-500 ms), és **elveszti az állapotot** (fókusz, input tartalma).
  - Konkrét elemet keresni/módosítani (`querySelector`) működik (jQuery), de a kód **erősen függ a HTML felépítésétől** → karbantarthatóság rossz.
- **Megoldás**: keretrendszer, ami a megadott HTML-t legyártja, **frissíteni** képes (nem villog, nem lassú, nem veszti el az állapotot), opcionálisan adatkötést és jó toolingot ad.
- Vizsgált keretrendszerek: **React** (csak UI könyvtár, legnépszerűbb), Vue (csak UI), Angular (teljes keretrendszer).

## Kompozíció (Composite minta)
- A felhasználói felület **hierarchikus → fa struktúra**; az azonos elemek → újrafelhasználás → **komponensek**.
- Egymásba ágyazható komponensek: egy szülő, 0 vagy több gyerek. Lehet levél (input, nincs gyereke) vagy fix gyerekszámú (pl. split container).
- **Komponens**: dekompozíció (bonyolult felület részekre bontása); felelősség + egységbezárás (csak magán belül, de ott mindenért); nézet (HTML) leírása, interakció (események/adatkötés), állapotkezelés; újrafelhasználás.
- **Öröklés kerülendő** (React ajánlás): props-on keresztül specializálunk. OOP-vel: van osztály/példány, egységbezárás, publikus interfész, belső állapot, absztrakció; **nincs öröklés, polimorfizmus, heterogén kollekció** (vagy nincs is osztály, csak függvény).

## Alkalmazás tervezése
- **Dekompozíció**: komponensekre bontás (iteratív, addig amíg a fejlesztő átlátja); design (mi hova kerül, egymásra hatás, CSS).
- **Statikus verzió (drótváz)**: dinamikus adat nélkül; gyors visszajelzés; kód-újrafelhasználás azonosítása (ami csak adatban tér el → komponens).
- **Állapot**: a minimális szükséges állapot (kiválasztott elem, belépett user, begépelt szöveg). Nem állapot a konstans/adatfüggetlen paraméter. Hozzárendelés globális szolgáltatáshoz vagy komponenshez (lokális); tipikusan a levelek felé toljuk, és annak a részfának a gyökerébe tesszük, ahol már kell.
- **Események és adatkötés**: kétirányú? (1) nézet változik → állapot; (2) állapot változik → nézet. Angular: kétirányú adatkötés. **React: nincs adatkötés, szülő felé visszahívás (callback) alapon adunk vissza.**

## React alapok
- Komponens = **függvény** (vagy osztály), ami **ReactElement**-eket ad vissza renderelés során.
```js
function Greeter(p) { return createElement("h1", null, "Hello, ", p.name, "!"); }
render(createElement(Greeter, { name: "Leo" }), document.body);
```
- A `createElement` JS objektumot (h1) hoz létre, **nem HTML szöveget**.

### JSX / TSX
- **JSX** (Babel által fordított): egyszerűsített szintaxis, ami `createElement` hívásokká fordul.
```jsx
function Greeter(p) { return <h1>Hello, {p.name}!</h1>; }
render(<Greeter name="Leo" />, document.body);
```
- **TSX** = típusos JSX: látjuk, milyen propsot vár a komponens; típusellenőrzés fordításidőben, kódkiegészítés (`p: { name: string }`).
- **Attribútumok JS szintaxis szerint**: `class` és `for` foglalt → **`className`** és **`htmlFor`** (preactben lehet `class`). Nincs `classList` (kódból állítjuk elő; classcat/classnames segédkönyvtár).
- **Feltételes attribútum**: true/false/undefined érték (`disabled`, `required`), vagy spread (`<input {...attrs} />`).

### Virtuális DOM (lásd tétel 8)
- Probléma az újrarenderelésnél: teljes HTML csere villog/lassú/állapotvesztés; csak a változások módosítása is lassú (JS lassan éri el a natív DOM-ot).
- **Megoldás: virtuális DOM** – külön fa JS objektumokkal (**ReactElement**), nem nyers HTML. Kisebb, gyorsabb, a változtatások nem rögtön látszanak.
- **React fa működése**: állapotváltozáskor újragenerálódik a Virtual DOM → az előző és új Virtual DOM **különbségéből (diff)** előáll a parancslista (valódi HTML-változtató parancsok) → végrehajtás (re-render). **State change → Compute diff → Re-render.**
- **Következmény**: a HTML-t közvetlenül változtatni nem szabad (a React nem észleli, és felülírja).
- **Komponens vs ReactElement**: a komponens függvény/osztály, ami ReactElementeket ad vissza (van állapota, életciklusa); a ReactElement-ekből áll össze a Virtual DOM, ami a HTML-t előállítja.
- **Nem szokásos logika**: nincs valódi adatkötés (de van `{}` látszat), nincs nézeti sablon (de van JSX/TSX látszat). Minden változásra újrahívja a függvényt → nulláról újra a teljes fa → fa szinkronizáció. Meglepő módon gyors.

## props (szülő → gyerek adatfolyam) (lásd tétel 8)
- A komponens **publikus interfésze, tulajdonságai**; kívülről (szülőtől) elérhető. JSX-ben mint HTML attribútum (`<Greeter name="Leo" />`), minden a **props objektumban** landol. TS ellenőrzi (hiányzó kötelező / nem létező property → hiba).
- **Adatkötésnek látszó `{}`**: adat beillesztése (nem csak szöveg). A `{}`-en kívül a sablon van, belül csak **kifejezés** lehet (if/for nem; helyettük `?:`, `map`).
- Nem szöveges érték `{}`-ben (`size={14}`); bármilyen JS típus, akár másik komponens.
- **Egyirányú adatkötés**: a props belülről nem változtatható (paraméterként viselkedik); minden rendereléskor a szülőtől kapjuk újra; **nem alkalmas állapot tárolására**.
- Átvétel: `props`-ként, vagy **object destructuring** (`{ name }`), `...rest` továbbadás (`<Greeter {...rest} />`). **Opcionális** (`name?`) → undefined ha nincs, alapérték destructuringgel (`date = new Date()`). **Spread** több prop átadására (sorrend számít, később felülír).
- **children**: a gyerekek a `children` propban; TS-ben **ReactNode** típus (tömb, string, komponens, szám, boolean, null, undefined).

## Hooks – függvény komponens állapota
- Nem kell osztály; kevesebb/olvashatóbb kód. A függvény komponens **nem tud többet** az osztálynál (lényegében annak render függvénye), de máshogy oldja meg (hookokkal): állapot (**useState**), komplex állapot (**useReducer**), életciklus (**useEffect**), belső változó (**useRef**).
- **Probléma**: a függvény minden hívásnál újrainicializálja a lokális változókat → hogyan tároljuk az állapotot a hívások közt, és honnan tudjuk, hogy újra kell futtatni?
- **Megoldás**: a függvényen kívül tárolt állapotot a függvény indulásakor lokális változókra képezzük; az állapotváltozás explicit (a keretrendszer értesül → újrarenderel).

### useState
```js
const [count, setCount] = useState(0);  // alapérték; [jelenlegi érték, beállító fv]
```
- Kéri az alapértéket, kétlemű tömböt ad (array destructuring). Első: a jelenlegi érték (`const`, ne állítsuk közvetlenül). Második: a beállító függvény (`setCount`) – meghívva újrarenderel az új értékkel; tipikusan eseménykezelőben.
- **Merge** (osztálynál `setState`): csak a megadott felső szintű állapotokat állítja (shallow), a többi marad.
- **Aszinkron setState**: nem azonnal állít (React összefogja a változásokat). Probléma, ha az előző értéket használjuk és többször állítjuk → **függvényes forma**: `setState(c => c + 1)` (mindig az aktuális állapotot kapja).
- **Állapot azonosítása**: a **useState hívások SORRENDJE** azonosítja az állapotot (nincs név/azonosító). Ezért a hookokat **mindig a függvény elejére**, és **NEM feltételes blokkba** (if/while) kell tenni.

## Kompozíció – React megoldása
- A felület leírása **kóddal** (`render`), hibrid (nem tisztán deklaratív). A render egy **fát** ad vissza, a szinkronizációt a keretrendszer végzi.
- **Egymásba ágyazás**: statikus gyerekek (fixen), feltételes (`&&`, `?:`, `??`), generált (`.map`). Több React fa is lehet (több konténer), de ne túl sok.
- **Feltételes gyerekek**: `&&` (a második tagot adja, ha az első igaz; falsy → React nem rendereli; üres: false/null/undefined/[]; nem üres de falsy: '', 0); `?:`.
- **Lista (`.map`)**: tömböt ad vissza; **`key` attribútum** kell (egyedi a tömbön belül, nem globálisan, tipikusan DB ID) – ebből tudja a fa-szinkronizáció, melyik új/törölt/változott. Ha nincs jó key → index (átrendezésnél lassú); új elemnek nem-létező ID (-1, "boo").
- **Több gyökérelem**: tömbként vagy `<Fragment>` / `<>` – fontos, ha egy wrapper div elrontaná a layoutot (pl. flexbox). Felesleges plusz HTML elem kerülendő.
