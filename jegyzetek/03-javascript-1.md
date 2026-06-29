# Jegyzet – 03. JavaScript 1. rész

## Bevezetés / történet
- Brendan Eich (Netscape), 1995: Mocha → LiveScript → **JavaScript** (Sun licenc). Cél: egyszerű szkriptnyelv interaktív weboldalakhoz, a Java kiegészítésére.
- **JS ≠ Java**: JS dinamikusan + gyengén típusos, forráskódból tölt, prototípus-alapú objektumok (Java: statikus+erős, bájtkód, osztály-alapú).
- **Szkriptnyelv**: motor sorról sorra olvas/végrehajt, nincs előzetes fordítás; hibánál az addigi sorok lefutnak, utána megáll.
- Változatok: JScript (MS), **ECMAScript** (ECMA-262 szabvány, évente új verzió), ActionScript (kihalt), TypeScript (típusos).
- **Transpiler** (source-to-source compiler): Babel (új JS → régi JS), CoffeeScript, TypeScript.
- Szerepe: HTML (tartalom) + CSS (megjelenés) + **JS (interaktivitás/viselkedés)**.
- Beillesztés: `<script src="...">` a `</body>` elé (teljesítmény). Inline és `onclick=""` kerülendő (átláthatóság).

## Nyelvi alapok
- Operátorok: aritmetikai, értékadó, bitenkénti, logikai (`||`, `&&`), összehasonlító (`==`, `===`, `!=`, `!==`). Vezérlés: if/else, switch, for, for..in, while, try/catch/finally, throw. `new`, `delete`, `function`, `return`.

### Változók láthatósága
- **`var`**: function scoping (egész függvényben látható). **`let`** (ES6): block scoping (csak a `{}`-ben). `const` (ES6): konstans, létrehozáskor értéket kell adni, nem módosítható.
- `var`/`let` elhagyásával a változó a globális `window` objektumon jön létre (kerülendő, global scope pollution). `"use strict"` hibát dob ilyenkor.
- **Shadowing**: lokális változó elfedi a külsőt; keresés a legmélyebb szinttől felfelé a globális (window)-ig.

### Típusok (lásd tétel 3)
- **Egyszerű**: number, bigint (`1n`), string, boolean, undefined, null (typeof "object" – hivatalos hiba!), symbol (ES6).
- **Összetett**: Object. És a **function** (typeof "function").
- **Dinamikusan típusos**: nem adunk meg típust, változó típusa változhat. **Gyengén típusos**: operátor működése függ a tárolt értéktől (string + string = konkatenáció, number + number = összeadás).
- **Implicit típuskonverzió**: `2020 + 'január'` = '2020január', `2020 + 1 + 'január'` = '2021január'.
- **`==` vs `===`**: `==` csak értéket (1 == "1" igaz), `===` típust is ellenőriz (1 === "1" hamis).
- **undefined**: értékadás nélküli változó értéke ÉS típusa is undefined (falsy).
- **truthy/falsy**: falsy = false, 0, NaN, '' (üres string), null, undefined. Minden más truthy ('0', '{}', '[]', stb.). `!!x` bool-lá kasztol.
  - `new Boolean(false)` OBJEKTUM (truthy!), `Boolean(false)` / `!!false` primitív (false).
- Idiómák: alapérték `x = x || alapertek`, feltételes futtatás `x && fv()`.

### Objektumok
- Kulcs-érték párok (kulcs ~ string). Elérés: `obj.prop` vagy `obj['prop']`. Nem létező property olvasása → undefined; nem létező írása → belekerül.
- Létrehozás: `new Object()` vagy `{}`. Bejárás: `for(let p in obj)`, `if("név" in obj)`.
- **JSON**: adatleíró szöveges formátum, JS objektum-inicializáláshoz hasonló (property nevek idézőjelben, nincs metódus/komment, egy gyökér). `JSON.parse()` (string→object), `JSON.stringify()` (object→string). AJAX-nál XML helyett.

### Tömbök
- `[...]` vagy `new Array(...)` (typeof "object"). `length`, `push()`, `pop()`, `splice(index, howMany, ...új)`.

### Függvények
- Nem adható meg paraméter/visszatérési típus. Paraméterszám eltérhet (hiányzó = undefined, többlet figyelmen kívül). **Nincs overload** (később deklarált nyer). ES6: alapértelmezett paraméter `b = 4`.
- A **function teljes értékű típus** (átadható paraméterként, visszaadható, változóba tehető).

## DOM és böngésző
- Browser API-k: DOM API (HTML/CSS manipuláció), XmlHttpRequest (szerver, REST), Client Storage. Külső API-k (Google Maps, Twitter).
- **window**: a böngésző tab (console, globális objektumok, location, history). **navigator**: böngésző állapota (nyelv, geolokáció). **document**: a DOM.
- **DOM (Document Object Model)**: a HTML oldal fa-struktúrája, gyökér a document.
- Lekérdezés: `getElementById`, `getElementsByTagName/ClassName/Name`, `querySelector`/`querySelectorAll` (selectorral).
- Létrehozás: `createElement`, `createTextNode`, `appendChild`. Módosítás: `el.textContent`, `el.style.backgroundColor` (camelCase! CSS: kebab-case), `setAttribute('class','...')`.
- Bejárás: firstChild, nextSibling (rekurzív walkTheDOM).

### Események
- Típusok: click, keypress, focus, mouseover, change…
- Regisztráció: inline `onclick=""` (kerülendő), JS-ből `btn.onclick = fv` (csak 1), `addEventListener("click", fv)` (több, sorrendben).
- Csak létező elemhez lehet; `window.onload` után (HTML betöltődött).
- **Event flow**: capture (fentről le) → target → **bubbling** (felgyűrűzés a gyökérig). `stopPropagation()` leállítja.

## Állapotkezelés (Web Storage)
- Cookie problémái: kis méret, minden HTTP kérésben utazik, több ablak nehézkes. Megoldás: **Web/DOM Storage** (kulcs-érték, csak string, komplexhez JSON). Limit ~5MB/origin.
- **sessionStorage**: tab bezárásig, csak az adott ablak. **localStorage**: törlésig, domain összes oldala. API: setItem/getItem/removeItem/clear.
- Cookie vs Storage: méret 4KB vs 5MB; cookie utazik a hálózaton, storage nem; cookie kliens+szerver API + HttpOnly, storage csak kliens + eseménykezelés.

## Haladó függvények (lásd tétel 4 is)
- **Closure**: egymásba ágyazott függvény, a külső láthatóvá teszi a belsőt; a belső megőrzi a létrehozáskori állapotot (belső függvény + állapot).
- Névtelen / **self-executing (IIFE)** függvények: `(function(){...})()`.
- **Modul minta**: IIFE + return-nel privát/publikus tagok elkülönítése (global scope pollution ellen), import/export (`N || {}`) több fájlra.
- **`new` operátor**: konstruktor függvényből új Object-et hoz létre, this-t arra állítja, azzal tér vissza.
- **`this`**: arra az objektumra mutat, amin a függvényt hívjuk (sima hívásnál window). Eseménykezelőben a DOM elemre mutat → `var self = this` / `that` minta.
- **Arrow function** `x => x*x`: tömör, **nincs saját this-e** (a befoglaló kontextus this-ét örökli – jó callbackekben, pl. setInterval). Egy kifejezésnél nincs return; objektum visszaadása `() => ({foo:1})`.

## Prototípus alapú öröklés és ES6 osztályok (lásd tétel 4)
- Objektumnak legfeljebb 1 **prototípusa** (másik objektum vagy null). Property olvasásnál, ha helyben nincs, a prototípusban keres (írni a prototípust nem tudja). Elérés: `__proto__`, `Object.getPrototypeOf/setPrototypeOf`.
- Szabályok: nincs ciklus, prototípus csak objektum/null. A `this` nem változik (a leszármazottra mutat).
- **Konstruktor függvény** `prototype` property-je (≠ `__proto__`): új objektum prototípusa ez lesz; futásidőben bővíthető.
- **Factory minta**: függvény objektumot ad vissza.
- **ES6 `class`**: csak szintaktikai cukor a prototípus-öröklésre. `constructor`, metódusok. Backtick template: `` `(${this.x}, ${this.y})` ``. Osztály nem hoistolódik (deklaráció előtt nem használható, függvény igen). Származtatás `extends`, `super()`/`super.metódus()` (this előtt super() kötelező), `instanceof`.
