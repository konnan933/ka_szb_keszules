# 9. tétel – Függvény vs. osztály komponensek, életciklus, komponensek átadása paraméterként

> Mi a különbség a függvény és osztály komponensek között Reactban? Mutassa be a React életciklus kezelését függvény és osztály komponensek esetében! Hogyan adunk át komponenseket paraméterként Reactban?

*(Forrás: 06-os PDF – React 1, és 07-es PDF – React 2 az életciklushoz)*

---

## 1. Függvény vs. osztály komponensek

A React komponens lehet **függvény** vagy **osztály** – mindkettő ReactElement-eket ad vissza a renderelés során.

### Osztály komponens
- Valódi (JS/TS) osztály, ami a **`Component`-ből származik**; **kötelező `render()`** metódusa adja a nézetet (ReactElementeket). Ez volt az **eredeti** módszer; a függvény komponens 2019-től van.
- **Típusparaméterek**: az **első a props** típusa, a **második a state** típusa (`Component<Props, State>`).
- A propsokat **`this.props`**-on, az állapotot **`this.state`**-en éri el; az állapotot **csak `this.setState(...)`**-tel állíthatja (máshogy nem!), ami egyben **rajzolást is kivált** (szemben egy sima tagváltozóval). Lehetnek belső változói is.
- **Konstruktor**: ha van, megkapja a propsot és átadja az ősnek (`super(props)`); itt állítható a kezdeti `state`.
- **`this` probléma**: ha az eseménykezelőt simán átadjuk (`onClick={this.inc}`), a `this` nincs hozzákötve → `Cannot read properties of undefined (reading 'setState')`. Megoldás: **(1) bind** a konstruktorban (`this.inc = this.inc.bind(this)`), vagy **(2) arrow function** a JSX-ben (`onClick={()=>this.inc()}`), mert az arrow a külső szkóp `this`-éhez kötődik.
- Van explicit **életciklus** (lásd lent): konstruktor, `render`, `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`.

### Függvény komponens
- Egyszerűen egy **függvény**, ami propsot kap paraméterként, és ReactElementet ad vissza.
- **Nem kell osztályt írni** (sok fejlesztő nem szereti az OOP felesleges komplexitását); **kevesebb, tömörebb, olvashatóbb kód**.
- A függvény komponens **nem tud többet** az osztálynál – lényegében annak a `render` függvénye –, csak **máshogy** oldja meg a feladatokat, **hookokkal**:
  - állapot: **`useState`**,
  - komplex állapot: **`useReducer`**,
  - életciklus: **`useEffect`**,
  - belső változó: **`useRef`**.

### Fő különbségek
| Szempont | Osztály komponens | Függvény komponens |
|----------|-------------------|--------------------|
| Forma | `class … extends Component`, `render()` | sima függvény |
| props | `this.props` | paraméter (destructuringgal is) |
| állapot | `this.state` + `this.setState` | `useState` / `useReducer` |
| életciklus | életciklus-metódusok | `useEffect` |
| belső változó | mező (`this.x`) | `useRef` |
| kód | több, OOP | kevesebb, tömörebb |

A modern React a **függvény komponenst + hookokat** ajánlja.

## 2. React életciklus kezelése

Megjegyzés: a React minden állapotváltozásra **újrahívja** a komponens függvényét (újraépíti a Virtual DOM-ot), majd diffeli és csak a változást írja a valódi DOM-ba. Az "életciklus" azt szabályozza, mi történjen a komponens **megjelenésekor (mount), frissítésekor (update) és eltávolításakor (unmount)**.

### Osztály komponensnél (életciklus-metódusok)
- **`constructor`**: kezdeti állapot beállítása.
- **`render`**: a nézet (ReactElement) előállítása (minden rendereléskor).
- **`componentDidMount`**: az első megjelenés (DOM-ba kerülés) után – pl. adatlekérés indítása, feliratkozás.
- **`componentDidUpdate`**: minden frissítés után (prop/állapot változás).
- **`componentWillUnmount`**: eltávolítás előtt – takarítás (leiratkozás, időzítő törlése).

A függvény komponensnek **nincs visszahívható életciklus-függvénye** (a `render` maga a függvény) – a többit a **`use…`** hookok adják.

### Függvény komponensnél (`useEffect`)
- Az életciklust a **`useEffect(effect, deps)`** hook kezeli egységesen. Egy függvényt adunk át, ami a renderelés(ek) után fut; ha az **visszaad egy függvényt**, az a **takarító kód**.
  - **dependency (2.) paraméter** szabja meg, mikor fusson újra az `effect`:
    - **`[]` üres tömb** → csak az első render után egyszer = `componentDidMount` (tipikusan külső eseményre feliratkozás).
    - **`[a, b]` props/érték** → ha `a` vagy `b` változik (≈ `shouldComponentUpdate` szűrés).
    - **nincs megadva (undefined)** → minden render után = `componentDidUpdate`.
  - **cleanup**: az `effect`-ből visszaadott függvény fut le **(a) unmount előtt** (= `componentWillUnmount`), **(b) újrafutás előtt** (ha változott a függőség) – leiratkozás, időzítő törlése.
```tsx
function Time() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000); // mount
    return () => clearInterval(t);                                               // takarítás
  }, []);                                                                        // csak mount-kor
  return <span>{time}</span>;
}
```
- **Páros hívás**: a `useEffect` mindig **párban** hívja a függvényt és a takarítót. Render csak akkor jöhet, ha még egyik sem futott (első render), vagy a függvény pont eggyel többször futott le, mint a takarító.
- A `this.forceUpdate` helyett függvény komponensben **state-tel** (`set…`) kényszerítünk rendert, mert csak az vált ki rajzolást.

### Megfeleltetés (osztály → függvény hook)
| Osztály | Függvény (hook) |
|---------|-----------------|
| `forceUpdate` | `useState` + set… |
| `componentDidMount` | `useEffect(fn, [])` |
| `componentDidUpdate` | `useEffect(fn)` (nincs deps) |
| `componentWillUnmount` | `useEffect` visszaadott függvénye |
| `shouldComponentUpdate` | deps tömbben a props megadása |

### Mikor jön létre / szűnik meg a komponens? (remount)
- A **szülő `render`-e** hozza létre (mounting → konstruktor hívódik).
- **Remount** (új konstruktor) csak akkor: ha a **`key` változik** (listában!), vagy **feltételes renderelésnél**, amikor újra létrejön.
- Ha **csak a props/state változik → NINCS remount**, csak a `render` (ill. a függvény) fut újra.

## 3. Komponensek átadása paraméterként

Mivel a React-ben a komponens egy érték (függvény, illetve a JSX egy ReactElement objektum), **komponens átadható propként** (tulajdonságként) – ez a kompozíció egyik eszköze.

### a) Renderelt elem átadása propként
Bármilyen JS érték (beleértve egy ReactElement-et) átadható propként `{}`-ben:
```tsx
function Layout({ header, content }: { header: ReactNode; content: ReactNode }) {
  return <div>{header}{content}</div>;
}
<Layout header={<h1>Cím</h1>} content={<Greeter name="Leo" />} />
```

### b) children prop
A beágyazott gyerekek a **`children`** propban érkeznek (TS-ben `ReactNode` típus: tömb, string, komponens, szám, boolean, null, undefined):
```tsx
function Header({ name, children }: { name: string; children: ReactNode }) {
  return <div><Greeter name={name} />{children}</div>;
}
<Header name="Leo"><p>extra tartalom</p></Header>
```
A `Header`-en belül a `<p>` a `children`-ben jön, és a `{children}` helyén jelenik meg.

### c) Komponens típusának átadása (render prop / komponens prop)
Magát a komponens **függvényt/típust** is átadhatjuk propként, és a fogadó komponens dönti el, mikor/hogyan rendereli (pl. egy listához, amelynek az elem-megjelenítőjét kívülről kapja):
```tsx
function List({ items, Item }: { items: X[]; Item: React.ComponentType<X> }) {
  return <ul>{items.map(x => <li key={x.id}><Item {...x} /></li>)}</ul>;
}
<List items={data} Item={Dot} />
```
Ez teszi lehetővé az újrafelhasználható, "general" komponenseket, amelyeket props-szal specializálunk (a React **öröklés helyett kompozíciót** ajánl).

---

### Kapcsolódó tételek
- JSX/TSX, virtuális DOM, props, input, useSyncExternalStore: [[tetel-08]].
- useState, useRef, useReducer, lifting state, aszinkron: [[tetel-10]].
