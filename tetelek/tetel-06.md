# 6. tétel – const/var/let, null kezelés, type narrowing, overload szignatúrák

> Mi a különbség a const, var és let kulcsszavak között TypeScriptben? Hogyan kezeli a TypeScript a null értéket? Mit jelent a típus szűkítés (type narrowing)? Mik az overload szignatúrák és hogyan használjuk őket?

*(Forrás: 05-ös PDF – TypeScript)*

---

## 1. const, var és let

| Kulcsszó | Hatókör (scope) | Újraértékadás | Megjegyzés |
|----------|-----------------|---------------|------------|
| **`var`** | **függvényhez** kötött (function scope), nem blokkhoz | igen | a függvényen kívül a globális névtér |
| **`let`** | **blokkhoz** kötött (block scope, `{}`) | igen | ES6 óta |
| **`const`** | **blokkhoz** kötött | **nem** (immutábilis) | létrehozáskor inicializálni kell |

```ts
let var1 = "Bodri";        // string típusú (kikövetkeztetve)
var1 = 6;                  // Error: '6' is not assignable to type 'string'.

const var4 = "Kókusz";     // string konstans
var4 = "Banán";            // Error: Cannot assign to 'var4' (constant)
const var3;                // Error: 'const' declarations must be initialized.

if (Math.random() < 0.5) {
  let var5 = "Morzsi";     // csak a blokkban látszik
  var var6 = "Puffancs";   // a függvényben (blokkon kívül is) látszik
}
console.log(var5);         // Error: Cannot find name 'var5'.
console.log(var6);         // OK
```

- A **`var` veszélye**: nem veszi figyelembe a blokkokat → könnyen "kicsúszik" a változó, és globális névteret szennyez. Ezért TS/modern JS-ben a `let`/`const` ajánlott (alapból `const`, és csak ha kell, `let`).
- **Típus**: explicit megadható a változó neve után (`let x: number`), vagy az értékadásból kiderül (type inference). Ha egyikből sem következtethető → a típus **`any`** lesz.

## 2. A null érték kezelése

### JavaScript háttér
- **`undefined`**: inicializálatlan változó vagy nem létező property értéke (számmá NaN). **`null`**: üres, "nem létező" érték, amit explicit be kell állítani (számmá 0). Mindkettő **falsy** és egyben **típus** is. (`typeof null === "object"` – ismert bug.)
- Alapból a változók lehetnek null/undefined, és a fordító nem szól → futásidejű hibák forrása.

### strictNullChecks
- A fordító **`strictNullChecks`** flagjének bekapcsolásával a `null` és `undefined` típusok **nem lesznek többé részhalmazai az összes többi típusnak**. Ekkor:
```ts
let num: number;
num = null;   // Error: Type 'null' is not assignable to type 'number'.
```
- Ha engedni akarjuk a nullt, **explicit unió típussal** kell jelezni:
```ts
let num: number | null;
num = null;   // OK
```

### Segítő nyelvi elemek a null-kezeléshez
- **Non-null assertion (`!`)**: a fordítónak jelzi, hogy az érték biztos nem null/undefined → `x!.toUpperCase()`. **Nincs futásidejű ellenőrzés**, csak a fordítót befolyásolja (ha mégis null, futásidejű hiba lesz).
- **Opcionális láncolás (`?.`, "Elvis")**: a tagot csak akkor éri el, ha a változó nem null/undefined (különben a visszatérés `undefined`):
```ts
if (foo?.bar?.baz) { ... }     // helyett: if (foo && foo.bar && foo.bar.baz)
```
- **Null coalescing (`??`)**: a jobb oldalt adja vissza, ha a bal oldal null vagy undefined:
```ts
let x = foo ?? bar();          // helyett: foo !== null && foo !== undefined ? foo : bar()
```
  (Fontos: a `??` csak null/undefined-re vált, a `||` viszont minden falsy értékre – pl. 0, '' is.)

## 3. Type narrowing (típus szűkítés)

A **típus szűkítés** azt jelenti, hogy a fordító **követi a kódban végzett típusellenőrzéseket**, és az egyes ágakban ennek megfelelően, **szűkebb** típussal dolgozik tovább.

```ts
function doSomething(x: string | null) {
  if (x === null) {
    // itt x: null
  } else {
    // itt a fordító tudja: x nem null  ->  x: string
    console.log("Hello, " + x.toUpperCase());   // biztonságos
  }
}
```

A szűkítés tipikus eszközei (**type guard**-ok):
- **`=== null` / `!== null`** összehasonlítás,
- **`typeof`** vizsgálat (`typeof id === "string"` → az ágban `id: string`),
- **`Array.isArray(x)`** (`string[] | string` szűkítése),
- **`in`** operátor, **`instanceof`**.

A type narrowing teszi biztonságossá az **unió típusok** és a `null`-os típusok használatát: a szűkítés után a fordító csak a megengedett műveleteket engedi az adott ágban.

## 4. Overload szignatúrák

### Miért kell?
A JavaScript-ben (és így a TS futásidőben) **nincs valódi metódus overloading**: nem hozhatunk létre két azonos nevű metódust, akkor sem, ha paramétereikben különböznek (a később deklarált nyer). Ezért **típusonként több konstruktor sincs**, és a paraméterek elhagyhatók (undefined értéket vesznek fel).

### Az overload szignatúrák megoldása
A TypeScript-ben egy metódusnak/függvénynek lehet **több overload szignatúrája** (csak a típusinterfész leírása), de **egyetlen implementáció** tartozik hozzá. Az **implementációs szignatúra közvetlenül nem hívható** – csak a megadott overload szignatúrák.

```ts
// Két hívható overload szignatúra:
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
// Egyetlen implementáció (kompatibilis, opcionális paraméterekkel):
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}

const d1 = makeDate(12345678);   // OK (1 paraméteres overload)
const d2 = makeDate(5, 5, 5);    // OK (3 paraméteres overload)
const d3 = makeDate(1, 3);       // Error: nincs 2 paraméteres overload
```

### Használat / szabályok
- Az overload szignatúrákban a paraméterek típusai **kompatibilisek** kell legyenek az implementációval; a paraméterek lehetnek **opcionálisak** (`?`), ekkor undefined értéket vehetnek fel.
- A fordító a hívás helyén a megadott overload szignatúrák közül választja ki a megfelelőt, és hibát ad, ha egyik sem illik (mint a `makeDate(1, 3)` esetén).
- Lényeg: a JS-ben hiányzó overloadot a TS **fordításidőben, a hívások típusos ellenőrzésével** pótolja – a tényleges logika egyetlen implementációban van.

---

### Kapcsolódó tételek
- Strukturális típusosság, unió/metszet részletesen: [[tetel-05]].
- Annotáció, interface, class, generikus, dekorátor: [[tetel-07]].
