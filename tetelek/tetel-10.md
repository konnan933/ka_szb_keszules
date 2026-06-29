# 10. tétel – Belső állapot (useState, useRef, useReducer), lifting state, aszinkron hívások

> Hogyan tárolja a belső állapotot a függvény és az osztály komponens (useState, aszinkronitás, useRef, useReducer)? Mi a lifting state, mire használjuk? Hogyan dolgozunk aszinkron hívásokkal Reactban?

*(Forrás: 06-os PDF – React 1, és 07-es PDF – React 2)*

---

## 1. Állapot az osztály komponensben

- A `Component`-nek van **`state`** tagja (a **második típusparaméter** a típusa). Kezdeti értékét a konstruktorban (`this.state = {count:0}`) vagy mezőként (`state = {count:0}`) adjuk meg.
- Állítani **kizárólag `this.setState(...)`-tel** lehet – ez egyben **rajzolást is kivált** (egy sima tagváltozó nem). A `setState` **merge**-el: csak a megadott felső szintű mezőket írja, a többit békén hagyja.
- A belső változó (`this.x` mező) ezzel szemben nem vált ki rendert.

## 2. Állapot a függvény komponensben – useState

A függvény komponens minden híváskor újrainicializálná a lokális változókat, ezért az állapotot **a függvényen kívül** tárolja a React, és híváskor leképezi.

```tsx
const [count, setCount] = useState(0);   // [jelenlegi érték, beállító fv]
```
- Kéri az **alapértéket**, és egy kételemű tömböt ad (array destructuring): az **első** a jelenlegi érték (`const`, közvetlenül ne írjuk!), a **második** a **beállító függvény** – meghívva újrarenderel az új értékkel (tipikusan eseménykezelőben).
- **Az állapotot a `useState` hívások SORRENDJE azonosítja** (nincs név/azonosító). Ezért a hookokat **mindig a függvény elejére**, és **soha nem feltételes blokkba** (if/while) kell tenni.

### Aszinkron setState
- A `set…` **nem azonnal** állít: a React **összefogja (batch-eli)** a változásokat, és utána egyszer renderel. Probléma, ha ugyanabban a körben az **előző értékre** támaszkodva többször állítunk (pl. `setCount(count+1)` kétszer → csak egyet lép).
- Megoldás a **függvényes forma**, ami mindig az aktuális állapotot kapja:
```tsx
setCount(c => c + 1);   // biztosan a legfrissebb értékből számol
```
- (Osztálynál ugyanez: `setState(s => ({count: s.count+1}))`.)

## 3. useReducer – komplex állapot

- **Komplex** = összetett logika az új állapot meghatározásában. `useState`-tel a logika szétdarabolódhat az eseménykezelőkbe; a **`useReducer`** kiszervezi egy függvénybe (alternatíva: Redux, ritkábban).
- **reducer**: a **régi állapotot (`state`)** és egy **változtató adatot (`action`)** kapja, és visszaadja az **új állapotot** (tipikusan `switch (action.type)`).
```tsx
function counterReducer(state: {count:number}, action: {type:"inc"|"dec"|"reset"}) {
  switch (action.type) {
    case "inc":   return { count: state.count + 1 };
    case "dec":   return { count: state.count - 1 };
    case "reset": return { count: 0 };
  }
}
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  return <button onClick={() => dispatch({ type: "inc" })}>{state.count}</button>;
}
```
- A komponens csak **`dispatch(action)`**-t hív. **useState vs useReducer**: reducer akkor, ha az állapotváltoztató adat absztrahálva van, az előző állapottól függ, több művelet/átmenet van. **Valójában a `useState` belül egy `useReducer`-t hív** (ahol a reducer egyszerűen visszaadja az action-t).

## 4. useRef – függvénykomponens tagváltozója

- Visszaad egy objektumot **egyetlen `current` tulajdonsággal**. Írható/olvasható (mint tagváltozó), **minden renderben ugyanaz az objektum** (*stable identity*), és **írása NEM okoz rendert**.
- Ez teszi a függvény komponenst "egyenrangúvá" az osztállyal (e nélkül néha osztály kéne, vagy állapottal kellene trükközni, hogy ne renderelődjön újra).
- **Két fő használat**:
  1. **HTML elem referencia**: a `ref` attribútum egy `current` tulajdonságú objektumot vár.
     ```tsx
     let inputRef = useRef<HTMLInputElement>(null);
     return <input ref={inputRef} />;   // pl. inputRef.current.focus()
     ```
     Az első renderkor `current` még `null`, csak utána / eseményre van beállítva.
  2. **Tagváltozó / cache**: számított, generált értékek tárolása rendertől függetlenül.
- **Tisztaság (pure)**: ha render során nem használjuk → tiszta (ajánlott; pl. a `ref` attribútum). Ha csak olvassuk → még teljesül az "azonos bemenet, azonos kimenet". Ha render közben **írjuk és olvassuk is** → nekünk kell gondoskodni a helyességről, a React nem segít.

## 5. Lifting state (állapot felemelése)

Ha egy állapotot **több komponens** használ:
- Tegyük az állapotot a **közös, legközelebbi szülőbe**.
- **`props`** formájában küldjük **le** a gyerekeknek.
- **`onChange`** (visszahívás) formájában küldjük **fel** a szülőnek, ha változik.

```tsx
function Parent() {
  const [text, setText] = useState("");
  return <div>
    <ChildA text={text} onChange={setText} />   {/* írja */}
    <ChildB text={text} />                       {/* olvassa */}
  </div>;
}
```
- **Jól működik**, ha az állapot lokális és csak pár komponenst érint.
- **Nem szép**, ha az állapot szétterjedt (a UI-on mindenfelé kell), vagy nagyon mélyre kell küldeni közömbös komponenseken keresztül – ilyenkor **globális állapot** / **Context** / külső store (`useSyncExternalStore`) a megoldás.

## 6. Aszinkron hívások Reactban

- A React **nem támogatja külön**, de **nem is tesz ellene** az aszinkronitásnak. **A `render` és minden hook szinkron**, és a **`useEffect` nem fogad el `async` függvényt** (mert az Promise-t adna vissza, amit a React takarító kódnak várna).
- Async függvényt **meghívhatunk** (ha nem await-elünk magában a hookban). `await` használható pl. **eseménykezelőben** (`async`-ra jelölve, de **ne adjon vissza semmit** – Promise-ra nem vár se React, se DOM).
- **Hálózati erőforrás letöltése** `useEffect`-ben, **IIFE** async függvénnyel:
```tsx
function useJsonResource(uri: string) {
  let [json, setJson] = useState<string>();
  useEffect(() => {
    let mounted = true;                          // él-e még a komponens?
    (async function () {
      let x = await fetch(uri);
      let j = await x.json();
      if (mounted) setJson(j);                   // csak ha még mounted
    })();
    return () => { mounted = false; };           // takarítás
  }, [uri]);                                     // uri változásra újra
  return json;
}
```
- A **`mounted` flag** azért kell, mert ha a komponens előbb szűnik meg, mint ahogy az adat megjönne, a `setJson` figyelmeztetést okozna – és **React-ben nincs beépített "mounted?" lekérdezés**, nekünk kell nyilvántartani.

---

### Kapcsolódó tételek
- JSX/TSX, virtuális DOM, props, input, useSyncExternalStore: [[tetel-08]].
- Függvény vs osztály komponens, életciklus (useEffect), komponens átadása: [[tetel-09]].
- Promise, async/await, Fetch (JS oldalról): [[tetel-04]].
