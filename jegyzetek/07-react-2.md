# Jegyzet – 07. React (második előadás)

## Osztály komponensek
- Kezdetben **csak osztály komponens** volt; a **függvény komponens 2019-től** van, és nagyot lendített a népszerűségen. A függvény komponens **logikailag az osztály komponens `render` függvénye**.
- Osztály komponens: valódi (JS/TS) osztály, ami a **`Component`-ből származik**. Egységbe zárás, **kötelező `render`** függvény. **Első típusparaméter a props típusa** (`Component<{name:string}>`), **második a state típusa** (`Component<Props, State>`). Lehetnek belső változói (pl. `renderCount`).
- **Konstruktor**: ha van, megkapja a propsot és **átadja az alaposztálynak** (`super(props)`).
- **Állapot osztályban**: a `Component`-nek van **`state`** tagja. Kezdeti érték `{count:0}`, beállítani **csak `setState`-tel** lehet (máshogy nem!), ami **rajzolást is kivált** (szemben egy sima tagváltozóval).
- **`this` probléma**: eseménykezelőként `onClick={this.inc}` átadva a `this` nincs hozzákötve → `Cannot read properties of undefined (reading 'setState')`. Megoldások: **(1) bind** a konstruktorban (`this.inc = this.inc.bind(this)`); **(2) arrow function** a JSX-ben (`onClick={()=>this.inc()}`), mert az arrow a külső szkóp `this`-éhez kötődik.
- **Előny/hátrány**: OO mintát jobban követi, bonyolult komponensnél jobban látszik, mi történik; elvileg többet tud (belső változók – de ez ritka, `useRef`-fel megoldható). Hátrány: hosszabb kód, `this` probléma (mindenhol arrow vagy bind).

## Életciklus (osztály)
- Fázisok: **Mounting → Updating → Unmounting**.
- Beavatkozási helyek (a keretrendszer hívja): **`constructor`** (létrehozás), **`render`** (a React fa előállítása), **`componentDidMount`** (első rajzolás után), **`componentDidUpdate`** (többi rajzolás után, ritka), **`componentWillUnmount`** (eldobás előtt). (Továbbiak az ábrán: `getDerivedStateFromProps`, `shouldComponentUpdate`, `getSnapshotBeforeUpdate`.)
- Tipikus példa: `componentDidMount`-ban `setInterval(()=>this.forceUpdate(),1000)`, `componentWillUnmount`-ban `clearInterval`. (Az óra mutatása `new Date().toLocaleTimeString()`.)
- **Mikor jön létre / szűnik meg?** A szülő `render`-e hozza létre (mounting → konstruktor). Remounting (új konstruktor) csak ha: **a `key` változik** (listában!), vagy **feltételes renderelésnél** újra létrejön. Ha **csak a props/state változik → NINCS remount**, csak a `render` fut újra. (Példák a slide-okon: prop-változás → nincs remount; key-változás → remount; feltételes render → remount.)

## Életciklus (függvény) – useEffect
- A függvény komponensnek **nincs visszahívható életciklus függvénye** (a `render` maga a függvény); a többit **`use…` függvényekkel** érjük el.
- **`useEffect(fn, deps)`** az életciklus kezelő: függvényt adunk át, ami **minden rajzolás után** meghívódik (a függőségtől függően). Ha a függvény **visszaad egy függvényt**, az a **takarító kód** (componentWillUnmount idejében fut).
- Át kell állni **state-re**, mert csak az vált ki rajzolást (nincs `this.forceUpdate`). Példa: `useState("")` + `useEffect(()=>{ let t=setInterval(...); return ()=>clearInterval(t); }, [])`.
- **2. paraméter (függőség)**:
  - **`[]` üres tömb** → csak az első render után egyszer (= `componentDidMount`), tipikusan külső eseményre feliratkozáshoz.
  - **`[delay]` props/érték** → a függőség változására újra (≈ `shouldComponentUpdate` szűrés).
  - **nincs megadva (undefined)** → minden render után (= `componentDidUpdate`).
- **Takarító kód**: a visszaadott függvény fut le **(a) unmountkor**, **(b) újrahíváskor** (mert változott a függőség). Nem kötelező visszaadni.
- **Páros hívás**: `useEffect` mindig **párban** hívja a függvényt és a takarítót. Render csak akkor jöhet, ha még egyik sem futott (első render), vagy a függvény pont eggyel többször futott, mint a takarító.
- Megfeleltetés: `forceUpdate`→`useState` set-tel; `componentDidMount`→`useEffect [ ]`; `componentDidUpdate`→`useEffect` undefined deps; `componentWillUnmount`→`useEffect` visszaadott függvénye; `shouldComponentUpdate`→deps tömbben a props.

## Felhasználói bemenet
- **Eseménykezelés**: HTML elemek eseményeire iratkozunk fel, név: **`on`+HTML esemény neve PascalCase** (`onClick`, `onInput`, `onChange`); értéke függvény. Több száz esemény elérhető.
- **input és társai**: állapotot tárolnak: `<input type=text>` (textbox), `type=file` (fájlválasztó), `<textarea>` (multiline), `<select>` (combobox), `type=checkbox`. **Nincs állapota**, csak eseményt vált ki: `<input type=button>`.
- **state-ben tárolt állapot** (controlled): `value={text}` + `onInput={e=>setText(e.currentTarget.value)}`. **`onInput`** minden változásra jön (validálni lehet), **`onChange`** csak fókuszvesztésre! `setText`-re újrarenderel, de az input már azonos a state-tel, így nem történik semmi.
- **Érték a callbackben**: text/textarea/select → `e.currentTarget.value`; checkbox/radio → `e.currentTarget.checked`.
- **Alapérték props-ból**: `useState(defaultText ?? "")`, és opcionális `onChange?.()` visszahívás a szülő felé.

## Komplex állapot – useReducer
- **Komplex** = összetett logika az új állapot meghatározásában. A `useState` alapú megoldásnál a logika szétdarabolódhat az eseménykezelőkbe. Kiszervezés: **`useReducer`** hook (vagy Redux, ritkábban).
- **reducer**: függvény, ami a **régi állapotot (`state`)** és a **változtató adatot (`action`)** kapja, és az új állapotot adja vissza (tipikusan `switch (action.type)`).
- **Beüzemelés**: `const [state, dispatch] = useReducer(counterReducer, {count:0})`; az eseménykezelők **`dispatch({type:"inc"})`**-et hívnak.
- **useState vs useReducer**: reducer akkor, ha az állapotváltoztató adat absztrahálva van, az előző állapottól függ, több művelet/átmenet van. **A `useState` belül egy `useReducer`-t hív** (a reducer egyszerűen visszaadja az action-t).

## Elosztott állapot
- **Lifting state**: ha egy állapotot több komponens használ, tegyük a **közös, legközelebbi szülőbe**; **props**-ként le a gyerekeknek, **`onChange`**-ként fel a szülőhöz. Jó, ha lokális és csak pár komponenst érint. Nem szép, ha szétterjedt vagy nagyon mélyre kell küldeni közömbös komponenseken át.
- **Globális állapot**: globális változóba tehető. Ha konstans, kész. Egyébként **változás-értesítésről gondoskodni kell**: feliratkozási lista, minden használó komponens fel/le iratkozik, beállításkor minden érintettet újrarenderelünk. A változás lehet szinkron (komponens írja) vagy aszinkron (hálózat, timer).
- **Feliratkozási lista** kell globális állapothoz, aszinkron hívásokhoz (hálózat, külső könyvtár), timerhez. A DOM is üzemeltet ilyet (`addEventListener`/`removeEventListener`, Event Dictionary pattern), és más API-k is (WebSocket, XHR).

### useSyncExternalStore (lásd tétel 8)
- React-en **kívüli store**-hoz köti a komponenst. Kell egy osztály, aminek van: **`subscribe(callback)`** (feliratkozás, visszaad egy **leiratkozó** függvényt), **`getSnapshot`/`getValue`** (érték kiolvasása), és belül **callback listát** üzemeltet.
- Használat: `let value = useSyncExternalStore(globalProp.subscribe, globalProp.getValue);`
- **GlobalStore<T> példa**: `#listeners` callback-lista + `#value`; konstruktor kezeli a kezdő értéket; `getValue()`; `subscribe(cb)` **immutable** mintával lecseréli a listát (`[...listeners, cb]`) és visszaad egy filteres leiratkozót (így iterálás közben nem változik); `setValue(v)` `Object.is`-szel néz egyenlőséget (≈`===`), és változáskor minden listenert meghív. Belül a `useSyncExternalStore` `useEffect`-et és `useState`-et használ.

## Context – állapot öröklés a fában
- **Környezettől függő állapot**: mindenhol jelen van (globális), mindenhol más lehet az értéke (lokális), **öröklődik a React fában**. Design pattern: **Property Inheritance** (mint font, WPF DependencyProperty). Leggyakrabban globális állapot helyett, hogy mindenhol azonos legyen.
- Használat: **`createContext(null)`** (létrehozás default értékkel) → **`<ThemeContext.Provider value={theme}>...</Provider>`** (beállítás részfára) → **`useContext(ThemeContext)`** (kiolvasás). Ha megváltozik, render hívódik.
- **Írható context**: tárolhat objektumot/függvényt is; `value={{theme, toggleTheme}}` (érték + változtató fv) → useState-szerű, de a Providerrel felülírható a részfára. A ThemeProvider komponens a `children`-t öleli körbe; az app gyökerébe kerül (`<ThemeProvider><App/></ThemeProvider>`).

## useRef – függvénykomponens tagváltozója
- Visszaad egy objektumot **egyetlen `current` tulajdonsággal**. Írható/olvasható (mint tagváltozó), **minden renderben ugyanaz az objektum** (stable identity), és **írása NEM okoz rendert**.
- Ez biztosítja a függvény komponensek "egyenrangúságát" az osztály komponensekkel (e nélkül néha osztályt kéne, vagy állapottal trükközni). Tipikus: cache, számított értékek, animáció (`requestAnimationFrame`), HTML elem referencia.
- **Tisztaság (pure)**: ha render során nem használjuk → tiszta (ez az ajánlás, pl. `ref` attribútum). Ha csak olvassuk → még teljesül az "azonos bemenet, azonos kimenet". Ha írjuk **és** olvassuk is → nekünk kell gondoskodni a helyességről, a React nem segít.
- **Felhasználás**: HTML elem referencia (`ref={inputRef}`, a `ref` objektumot vár `current` tulajdonsággal); tagváltozó (cache). Pl. fókusz: `inputRef.current.focus()`.

## Funkcionális programozás
- A modern React célja **pure function-szerű** komponensek: nem változtat olyan adatot, amit nem ő hozott létre; azonos bemenetre azonos kimenet (debug módban **kétszer hív render-t** ellenőrzésként). Motiváció: bizonyos hibák nem léteznek, komplexitás csökkentés.

## Hol legyen az állapota egy komponensnek? (saját hook)
- Írhatunk **saját hook**-ot, ami `useState`-et használ; **annak a komponensnek** az állapotát kezeli, amelyik meghívja. Működik, mert a `useState` **sorrend alapú**.
- **Hasonló az OOP-hez**: egységbe zárás (a hook kezeli/védi az adatot), absztrakció, életciklus (az adat együtt él/hal a komponenssel). De minden másban eltér – React-ben kell gondolkodni.
- **Logika kiszervezés** hookokkal: kód-újrafelhasználás, dekompozíció. Csak funkcionális környezetben működik (számít a sorrend és a tisztaság). **Mindenhol hook**: ha látunk rá lehetőséget, csináljuk meg (akkor is ha egyszer használjuk) – nem lassít, csak egy függvény.

## async-await és React
- React **nem támogatja külön** az aszinkron programozást, de **nem is tesz ellene**. `render` szinkron, minden hook szinkron, **`useEffect` nem fogad el async függvényt**.
- Viszont meghívhatunk async függvényt (ha nem await-elünk a hookban); await használható pl. eseménykezelőben (`async`-ra jelölve, de **nem adhat vissza semmit**, mert Promise-ra nem vár se React, se DOM).
- **Hálózati erőforrás letöltése**: `useEffect`-ben **IIFE** async függvény + `fetch`/`json` + `setJson`. Probléma: ha a komponens előbb szűnik meg, mint az adat megjön → figyelmeztetés. Megoldás: **`mounted` flag** (`let mounted=true; ... if(mounted) setJson(...); return ()=>mounted=false;`), mert React-ben nincs beépített "mounted?" lekérdezés.

## Komponens átadása paraméterként
- Általában **gyerekként** (`children`) adunk át komponenst (esetek 90+%-a) – jól működik, de nem tudjuk módosítani. Paraméterként háromféleképp: **React elem**, **komponens (típus)**, **függvény**.
- **MessageBox use-case** (icon/buttons/children):
  - **1) React elem**: `icon={<Icon icon="warning"/>}`, felhasználás `props.icon ?? <Icon icon="info"/>`. Hátrány: nehéz a propsot változtatni (`cloneElement`).
  - **2) Komponens**: `icon={Icon}` + külön `iconProps={{icon:"warning"}}`; `let IconComponent = props.icon ?? Icon; <IconComponent {...iconProps}/>`. Hátrány: külön kell a props.
  - **3) Függvény**: `icon={()=><Icon icon="warning"/>}`, felhasználás `props.icon?.() ?? <Icon icon="ok"/>`. Mindent tudhat, de készülni kell rá; legköltségesebb (nem vészes). **Mindhárom megoldást használják.**
