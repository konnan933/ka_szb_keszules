# 4. tétel – Prototípus alapú öröklés, egyszálúság, eseményvezéreltség, Promise

> Mit jelent a prototípus alapú öröklés? Mit jelent a JavaScript nyelvben az egyszálúság és az eseményvezéreltség? Hogyan általánosítja a Promise megjelenése a többszálú programozást?

*(Forrás: 03-as PDF – prototípus/closure/this rész, és 04-es PDF – JavaScript 2. rész)*

---

## 1. Prototípus alapú öröklés

A JavaScript nem osztály-alapú, hanem **prototípus-alapú** objektumorientáltságot használ (szemben pl. a Java osztály-alapú modelljével).

### Az alapelv
- Minden objektumnak lehet **legfeljebb egy prototípusa** – ez egy másik **objektum**, vagy `null`, ha nincs.
- Amikor egy objektum egy **property-jét olvasni** akarjuk, de az helyben nem létezik, a motor megnézi, hogy benne van-e a **prototípusban**, és ha igen, azt adja vissza. Ez a keresés a prototípus-láncon felfelé halad.
- **Írni** azonban a prototípus property-jét nem tudjuk (az írás mindig az aktuális objektumra történik).

```js
let o = {};
o.toString();              // "[object Object]" – az Object.prototype-ból jön
'toString' in o.__proto__; // true
o.__proto__ = null;
o.toString();              // TypeError: nincs honnan örökölnie
```

### A prototípus elérése / beállítása
- `obj.__proto__` (getter/setter), `Object.getPrototypeOf(obj)`, `Object.setPrototypeOf(child, parent)`.

```js
let parent = { name: 'x', greet() { console.log(this.name); } };
let child  = { id: "ABC123" };
Object.setPrototypeOf(child, parent);  // child örököl parent-től
child.greet();  // a parent greet-je fut, de this a child
```

### Szabályok
- A prototípus-láncban **nem lehet ciklus**.
- A prototípus csak **objektum vagy null** lehet, primitív típus nem.
- A `this` értékét a prototípus **nem befolyásolja**: ha egy objektumon keresztül a prototípus egy függvényét hívjuk, a `this` továbbra is **az aktuális (leszármazott) objektumra** mutat.

### Konstruktor függvény és a `prototype`
- A **konstruktor függvénynek** van egy `prototype` property-je (ez **NEM** azonos a `__proto__`-val!).
- Amikor a `new` operátorral létrehozunk egy objektumot a konstruktor függvénnyel, akkor az új objektum **prototípusa ez a `prototype` objektum** lesz.
- Így a prototípus **futásidőben bővíthető**, és az új tagok minden öröklött példánynál elérhetővé válnak:
```js
function User(name) { this.name = name; }
let user = new User();
User.prototype.greet = function () { console.log("hello"); };
user.greet();  // "hello" – utólag is elérhető
```

### ES6 `class` – csak szintaktikai cukor
- Az ES6 a `class` kulcsszóval OO-szerű szintaxist ad, de **a háttérben továbbra is prototípus alapú öröklés** marad.
```js
class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  toString() { return `(${this.x}, ${this.y})`; }   // backtick template
}
class ColorPoint extends Point {
  constructor(x, y, color) { super(x, y); this.color = color; }  // super() a this előtt!
  toString() { return super.toString() + ' in ' + this.color; }
}
let cp = new ColorPoint(25, 8, 'green');
cp instanceof ColorPoint;  // true
cp instanceof Point;       // true
```
- `extends` (származtatás), `super()` / `super.metódus()`, `instanceof`. Fontos: az osztály **nem hoistolódik** (deklaráció előtt nem használható, a függvény igen).

## 2. Egyszálúság (single-threaded)

A JavaScript a böngészőben **egyszálú**: egyetlen fő végrehajtási szál van, amelyen a kód fut. Következményei:
- Egyszerre **egy darab kód** fut – nincs klasszikus párhuzamos végrehajtás a fő szálon, így nincsenek a többszálúságra jellemző versenyhelyzetek (race condition) és lockolás a felhasználói kódban.
- Ha egy hosszú, **blokkoló** művelet (pl. nagy ciklus, szinkron hálózati hívás) fut, az **megakasztja az egész oldalt** (a UI nem reagál), mert a szál foglalt.
- Ezért a hosszú/lassú (jellemzően hálózati) műveleteket **aszinkron** módon kell végezni, hogy ne blokkolják a fő szálat. Ehhez kapcsolódik az eseményvezéreltség és a Promise.

## 3. Eseményvezéreltség (event-driven)

- A JavaScript **eseményvezérelt**: a kód nagy része nem azonnal, hanem **eseményekre reagálva** fut le (felhasználói kattintás, billentyűleütés, beérkező hálózati válasz, időzítő lejárta).
- Eseményekre **eseménykezelő (callback) függvényeket** regisztrálunk (`addEventListener("click", fv)`, `window.onload`, `setTimeout`, `setInterval`, vagy aszinkron művelet `onload`-ja).
- Összekapcsolva az egyszálúsággal: a fő szál egy **event loop**-ot futtat, amely sorra veszi a beérkezett eseményeket (a sorból) és lefuttatja a hozzájuk regisztrált callbackeket. Amíg egy callback fut, a többi vár → a callbackeket sosem szakítja meg másik (nincs preempció), ezért nincs versenyhelyzet.
- A DOM-események a fában terjednek: **capture** (fentről le) → **target** → **bubbling** (felgyűrűzés a gyökérig); a `stopPropagation()` leállítja.

### A callback-probléma
A klasszikus aszinkron megoldás a **callback**: az aszinkron műveletnek átadunk egy függvényt, ami a befejezéskor lefut.
```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;
  script.onload = () => callback(script);   // betöltés után fut
  document.head.append(script);
}
```
Sok egymásra épülő művelet + hibakezelés esetén ez mélyen egymásba ágyazott callbackekhez vezet → **"callback hell" (pyramid of doom)**, ami nehezen olvasható és karbantartható.

## 4. Promise és a többszálú programozás általánosítása

A **Promise** egy objektum, ami **majd a jövőben** ad vissza egy értéket (nem most). Ezzel egységes, **láncolható** absztrakciót ad a callback hell helyett, és általánosítja az aszinkron/„párhuzamos” feldolgozás kezelését.

### Állapotok
- **pending** (függőben, result: undefined) → **fulfilled** (sikeres, result: value) VAGY **rejected** (hiba, result: error).
- Pendingből indul és fulfilled/rejected-ben végződik – utána az állapot már nem változik.
```js
let learnWeb = new Promise((resolve, reject) => {
  if (completed) resolve("kész");
  else           reject("nincs kész");
});
```

### Eredmény feldolgozása
- `.then(success, error)`: a Promise befejeződésekor; siker → success, hiba → error handler (opcionális).
- `.catch(f)`: csak hiba (rejected) esetén.
- `.finally(f)`: minden esetben lefut (de nem tudja, sikeres volt-e); takarításra (pl. loading indikátor eltüntetése).

### Hogyan általánosítja a többszálú/aszinkron programozást?
A Promise nem valódi szálakat hoz létre (a JS egyszálú marad), hanem **egységes, kompozícionálható kezelést** ad a "majd később megérkező" eredményekre:
- **Láncolás (chain)**: `promise.then(...).then(...)` – a köztes lépések eredménye továbbadódik, a hibák egyetlen `.catch()`-ben kezelhetők (szemben a sok egymásba ágyazott callback + külön hibakezeléssel).
- **Több aszinkron művelet együttes kezelése** (mintha "párhuzamosan" futnának):
  - `Promise.all(promises)`: megvárja az összeset; ha bármelyik hibázik, az egész hibázik.
  - `Promise.allSettled(promises)`: megvárja az összeset, mindegyikről visszaadja status (fulfilled/rejected) + value/reason.
  - `Promise.race(promises)`: az első befejeződő eredménye.
  - `Promise.any(promises)`: az első sikeresen befejeződő; ha mind hibás, AggregateError.
- **`async`/`await`**: szintaktikai cukor a Promise-okra. Az `async` függvény mindig Promise-szal tér vissza; az `await promise` megvárja az eredményt és szinkron stílusú, olvasható kódot ad:
```js
async function f() {
  let result = await promise;   // megvárja a teljesülést
  alert(result);
}
```

### Gyakorlati alkalmazás: Fetch API
A modern hálózati kommunikáció (`fetch(url, [options])`) Promise-szal tér vissza. A Promise csak hálózati hibánál reject-elődik (404/500-nál nem – `response.ok` jelzi a 200-299-et). A választ két lépésben nyerjük: `fetch` → `Response` (status, ok, headerek), majd `response.json()` (újabb Promise) a body-ra.

---

### Kapcsolódó fogalmak (03-as PDF)
- **Closure**: a belső függvény megőrzi a létrehozáskori állapotot.
- **`this`**: arra az objektumra mutat, amin a függvényt hívjuk; eseménykezelőben a DOM elemre → `var self = this` minta. Az **arrow function**nek nincs saját this-e (a befoglaló kontextusét örökli – ezért hasznos callbackekben, pl. `setInterval(() => this.age++, 1000)`).

---

### Kapcsolódó fogalmak (03-as PDF, a this/closure miatt fontosak az öröklésnél)
- **Closure**: a belső függvény megőrzi a létrehozáskori állapotot.
- **`this`**: arra az objektumra mutat, amin a függvényt hívjuk; eseménykezelőben a DOM elemre → `var self = this` minta. Az **arrow function**nek nincs saját this-e (a befoglaló kontextusét örökli).
