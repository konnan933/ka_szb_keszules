# 8. tétel – JSX/TSX, virtuális DOM, props, input kezelés, useSyncExternalStore

> Jellemezze a JSX, TSX szintaxisokat! Mi a virtuális DOM és miért van rá szükség? Mi a props Reactban és hogyan használjuk függvény és osztály komponensek esetében? Hogyan kezeljük a felhasználói inputot Reactban? Mi a useSyncExternalStore és hogyan használjuk?

*(Forrás: 06-os PDF – React 1, és 07-es PDF – React 2 az useSyncExternalStore-hoz)*

---

## 1. JSX és TSX szintaxis

A React komponens egy **függvény** (vagy osztály), ami a renderelés során **ReactElement**-eket ad vissza – nem HTML szöveget. Az elemeket alapból a `createElement` függvénnyel hoznánk létre:
```js
function Greeter(p) { return createElement("h1", null, "Hello, ", p.name, "!"); }
```

### JSX
- A **JSX** egy egyszerűsített, HTML-szerű szintaxis, amit egy fordító (**Babel**) átalakít a fenti `createElement` hívásokra:
```jsx
function Greeter(p) { return <h1>Hello, {p.name}!</h1>; }
render(<Greeter name="Leo" />, document.body);
```
- A `{}` (kapcsos zárójel) adat beillesztésére szolgál a sablonba; **csak kifejezés** lehet benne (if/for nem, helyettük `?:`, `&&`, `.map`).

### TSX
- A **TSX = típusos JSX** (TypeScripttel). Előnye: **látjuk, milyen propsot vár a komponens**, a típusellenőrzés miatt **fordításidőben előjönnek a hibák**, és működik a kódkiegészítés:
```tsx
function Greeter(p: { name: string }) { return <h1>Hello, {p.name}!</h1>; }
```

### Attribútumok
- Az attribútumok a **JS szintaxist** követik. Mivel a `class` és `for` foglalt kulcsszavak, helyettük **`className`** és **`htmlFor`** írandó (preactben nincs ez a megkötés). Nincs `classList` – a class listát kódból állítjuk elő (classcat/classnames segédkönyvtárral).
- Bár úgy tűnik, HTML-t írunk, valójában **kódra fordul** át.

## 2. Virtuális DOM és miért van rá szükség

### A probléma
A komponensek fa-hierarchiában vannak, mindegyik tudja, milyen HTML-t kell generálnia. Újrarendereléskor:
1. **A teljes HTML cseréje**: villog, lassú, **elveszti az állapotot** (fókusz, input tartalma).
2. **Csak a változások módosítása**: a JS **lassan éri el** a natív HTML DOM elemeket/attribútumokat.

### A megoldás: virtuális DOM
- Legyen egy **külön fa**, amiben nem nyers HTML elemek, hanem **JS objektumok** (**ReactElement**) vannak, és gyors rajtuk a változáskezelés. Minden HTML elemnek megvan a JS objektum "megfelelője". Kisebb, gyorsabb, a változtatások nem rögtön látszanak.
- A React komponensek renderelés során ezeket az objektumokat hozzák létre (nem HTML szöveget).

### A React fa működése (diffing)
1. Amikor változik a komponens **állapota**, **újragenerálódik a Virtual DOM**.
2. Az **előző és az új Virtual DOM különbségéből (diff)** előáll a **parancslista** (valódi HTML-változtató parancsok).
3. A React ezt **végrehajtja** a böngésző DOM-ján.

Sematikusan: **State change → Compute diff → Re-render** (csak a ténylegesen változott részeket módosítja).

### Következmény
A HTML-t **közvetlenül változtatni nem szabad**: a React nem észleli (nem írja vissza), és ha a React fában változik valami, felülírja.

**Komponens vs ReactElement**: a komponens függvény/osztály (van állapota, életciklusa), ami ReactElementeket ad vissza; a ReactElement-ekből áll össze a Virtual DOM, ami a HTML-t előállítja.

## 3. props – mi az és hogyan használjuk

A **props** (properties) a komponens **publikus interfésze, tulajdonságai**; kívülről, a **szülő felől** elérhető (szülő → gyerek adatfolyam).

- JSX/TSX-ben mint HTML attribútum állítjuk be (`<Greeter name="Leo" />`); minden így beállított tulajdonság a **`props` objektumban** landol. TS ellenőrzi: hibát dob, ha nem létező propot állítunk, vagy hiányzik egy kötelező.
- Nem szöveges érték `{}`-ben: `<Greeter name="Leo" size={14} />` – bármilyen JS típus, akár másik komponens is átadható.
- **Egyirányú adatkötés**: a props **belülről nem változtatható** (paraméterként viselkedik); minden rendereléskor a szülőtől kapjuk újra (az előző renderelés propjai elvesznek). **Nem alkalmas a komponens állapotának tárolására!**

### Függvény vs. osztály komponens esetében
- **Függvény komponens**: a props a **függvény paramétere**. Átvehető egészként (`props`) vagy **object destructuringgal**:
```tsx
function Greeter(props: { name: string }) { return <h1>Hello, {props.name}!</h1>; }
function Greeter({ name }: { name: string }) { return <h1>Hello, {name}!</h1>; }
```
  Opcionális prop (`name?`) → undefined ha nincs; alapérték destructuringgel (`date = new Date()`). `...rest` továbbadás (`<Greeter {...rest} />`), spread több prop átadására (sorrend számít, később felülír).
- **Osztály komponens**: ott **csak `props`-ként** vehető át (a `this.props`-on keresztül), destructuring a paraméterben nincs.
- **children**: a beágyazott gyerekek a `children` propban érkeznek; TS-ben **ReactNode** típus (tömb, string, komponens, szám, boolean, null, undefined). Megjelenítés: `{children}`.

## 4. Felhasználói input kezelése

A React-ban **nincs (kétirányú) adatkötés**, ezért az inputot **eseménykezelőkkel** kezeljük, és az állapotot explicit állítjuk.

- Az események a JSX-ben mint propok jelennek meg, JS-szintaxis szerint (camelCase): `onClick`, `onChange`, `onInput`, stb. Értékük egy függvény:
```tsx
const [count, setCount] = useState(0);
return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
```
- **Controlled component** (vezérelt mező): az input `value`-ját az állapotból adjuk, és `onChange`-ben az állapotot frissítjük – így a React fa marad az "igazság forrása":
```tsx
const [text, setText] = useState("");
return <input value={text} onChange={e => setText(e.target.value)} />;
```
- Az állapotváltozás (`setText`) → a komponens újrarenderel → az új érték jelenik meg. Mivel a HTML-t közvetlenül nem szabad módosítani, mindig az állapoton keresztül megy a kör: **nézet (esemény) → állapot → új nézet**.

## 5. useSyncExternalStore

A `useSyncExternalStore` egy React hook, amellyel a komponens egy **React-en kívüli ("external") adatforráshoz / store-hoz** tud feliratkozni úgy, hogy a React renderelése konzisztens (szinkron) maradjon.

- **Mire kell?** A useState/useReducer a React saját állapotát kezeli. Ha viszont az adat egy **React-en kívüli store-ban** van (globális állapot, böngésző API, aszinkron forrás – hálózat, timer, WebSocket, vagy egy saját publish-subscribe store), akkor a React magától nem tud róla. A `useSyncExternalStore` köti be ezt biztonságosan (a Concurrent rendering melletti "tearing" – inkonzisztens olvasás – elkerülésével).
- **Mit vár?** Egy olyan objektumot/osztályt, aminek van:
  1. **`subscribe(callback)`** – feliratkozás a store változására; a `callback`-et hívni kell, ha a store változik, és **visszaad egy leiratkozó (unsubscribe) függvényt**;
  2. **`getSnapshot`/`getValue`** – kiolvassa a store **aktuális értékét**;
  3. belül egy **callback (listener) listát** üzemeltet.
```tsx
import { useSyncExternalStore } from 'react';
const globalProp = new GlobalStore(12);              // globálisan létrehozva
export function Comp() {
  let value = useSyncExternalStore(globalProp.subscribe, globalProp.getValue);
  return <span>{value}</span>;
}
```
- Amikor a store értesíti a feliratkozót (a `subscribe`-nak átadott callback meghívásával), a React újraolvassa a snapshotot és **újrarendereli** a komponenst. Beállítás: `globalProp.setValue(...)`. (A `useSyncExternalStore` belül `useEffect`-et és `useState`-et használ.)

**GlobalStore<T> minta** (a store implementációja):
- `#listeners` callback-lista + `#value`, a konstruktor kezeli a kezdő értéket; `getValue()` kiolvas.
- `subscribe(cb)` **immutable** mintával lecseréli a listát (`[...listeners, cb]`) és filteres **leiratkozót** ad vissza – így iterálás közben nem változik a lista.
- `setValue(v)` `Object.is`-szel (≈`===`) néz egyenlőséget, és tényleges változáskor **minden listenert meghív**.

---

### Kapcsolódó tételek
- Függvény vs osztály komponens, életciklus: [[tetel-09]].
- useState, useRef, useReducer, lifting state, aszinkron: [[tetel-10]].
