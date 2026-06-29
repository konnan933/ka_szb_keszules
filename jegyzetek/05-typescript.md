# Jegyzet – 05. TypeScript

## Áttekintés
- **JS kihívásai**: nagy JS kódbázisok nehezen karbantarthatók; ECMAScript szabványosítás jó, de az implementációk lassan követték. → új nyelv a JS programozóknak.
- Anders Hejlsberg (Turbo Pascal, Delphi, C#, TypeScript): "You can write large programs in JavaScript. You just can't maintain them."
- **TypeScript = a JavaScript típusos szuperszetje**: minden JS egyben TS; a dinamikus működés **kiegészítése statikus típusinformációkkal**. 2012, Microsoft, ingyenes open source.
- JS-re fordul (mindenhol fut, ahol JS); konfigurálható az ECMAScript célverzió. Erősen visszahat az ECMAScript szabványosításra.

## TS fejlesztési folyamat
- **tsc (TypeScript Compiler)**: source-to-source compiler / **transpiler** – TS-ből JS-t készít, az fut a böngészőben (playground).
- IDE támogatás (VS, VS Code, WebStorm…). Fejlesztéstámogatás: NPM/Yarn (csomag, típusdefiníció), Webpack/MSBuild/Browserify (csomagolás), Gulp/Grunt (automatizálás), tsc CLI.
- **Mit ad?** Statikus típusellenőrzés → **fordítási idejű hibák futási idejű hibák helyett**; igazi IntelliSense; elrejti a JS furcsaságait; még nem szabványos JS elemek használhatók (fordítás után sima JS); jobb karbantarthatóság, nagy kódbázis kezelhetősége.
- **A fordítás eredménye**: a JS NEM tartalmazza a típusinfókat (a lefordított JS továbbra is dinamikusan típusos). Meglévő JS forrás típusinfókkal kiegészítve használható.

## Statikus típusosság
- `var num = 10` → number; `num = "alma"` fordítási hiba. Explicit: `let x: number`.
- **`any`** típus: dinamikus típust reprezentál (bármit felvehet, bárminek értékül adható). Visszatérés a dinamikushoz: `<any>` vagy `as any`. Jó kód nem tartalmaz any-t (nincs IntelliSense, futásidejű hibák). `noImplicitAny` flag.
- **Type assertion** ("típus bizonygatás"): `<string>someValue` vagy `someValue as string` – CSAK a fordítónak szól, **nincs futásidejű ellenőrzés** (≠ cast). JS-szel együttműködésre. Ellentmondó típusinfónál fordítási hiba.

## Kompatibilitás: strukturális típusosság
- **Strukturális típusosság**: egy A objektum a B típussal strukturálisan kompatibilis, ha A megvalósítja a B által leírt **strukturális interfészt** (= a típus publikus tagváltozóinak/függvényeinek halmaza). Nem a típus NEVE számít, hanem a tagok.
- `interface Named { name: string }` + `class Person { id; name }` → `let john: Named = new Person()` OK (mert Person-nek van name-je). Ha Named-nek lenne `shortName` is, és Person-nek nincs → hiba.
- **Type inference**: a fordító kikövetkezteti a típusokat (értékadásból, kifejezésfából).
- Cél: a script-nyelvi "kreatív típus kavalkádot" keret közé emelni a kifejező erő csökkentése nélkül.

## Változódeklarációk
- `var` → függvényhez kötött (külső függvény = globális névtér). `let`/`const` → blokkhoz kötött; `const` immutábilis (létrehozáskor inicializálni kell). Típus explicit vagy értékadásból; különben `any`.

## Null kezelés
- JS: `undefined` (inicializálatlan/nem létező property → NaN), `null` (üres, explicit, → 0). Mindkettő falsy és típus is. `typeof null` → "object" (bug).
- Alapból a változók lehetnek null/undefined → hibák.
- **`strictNullChecks`** flag: a null és undefined NEM lesznek részhalmazai minden típusnak → explicit `number | null` kell, ha engedni akarjuk.
- **Type narrowing (típus szűkítés)**: a fordító követi a típusellenőrzéseket (`if (x === null)`, `typeof`); az else ágban tudja, hogy x nem null. `typeof` mint **type guard**.
- **Non-null assertion `!`**: a fordítónak jelzi, hogy az érték biztos nem null/undefined (`x!.toUpperCase()`) – **nincs futásidejű ellenőrzés**.
- **Opcionális láncolás `?.`** ("Elvis"): tag elérése, ha nem null/undefined (különben undefined): `foo?.bar?.baz`.
- **Null coalescing `??`**: a jobb oldalt adja, ha a bal null/undefined: `foo ?? bar()`.

## Enumok
- 0-tól növekvő sorszámozás (`enum DogKind { Pitbull = 1, Terrier, Corgi }`), reverse enum (number → string: `DogKind[dog]`). String alapú enumok (`Up = "fel"`).

## Literál típusok
- **String literál**: konstans stringekből típus (`"Pitbull" | "Terrier" | "Corgi"`); ismeretlen szövegre fordítási hiba.
- **Szám literál**: konstans számokból (`-1 | 0 | 1`); kapcsolható más típushoz (`number | "auto"`).

## Típus annotáció és alias
- **Type annotation**: tagok `{}`-ben felsorolva, név nélkül: `{ name: string; age: number }`.
- Opcionális `?`: paraméter/property opcionális → undefined (`age?: number`); vagy `number | undefined` (typeof guard).
- **Type alias**: a típus annotációnak nevet adunk: `type Point = { x: number; y: number }`, `type ID = number | string`.

## Unió- és metszettípusok
- **Unió (`|`)**: az objektum VAGY ilyen VAGY olyan property-kkel rendelkezik (`number | string`). Type narrowing-gal (typeof, Array.isArray) szűkíthető. `type sizes = 'small' | 'medium' | 'large'`.
- **Metszet (`&`)**: az új típus a kiinduló típusok **összes** tagját tartalmazza (szemben az unióval): `type SizableLabel = Sizable & Labeled`.

## Interfészek
- Definiálhat: tagváltozót, függvényt, függvény-/konstruktor-szignatúrát, indexelhető típust.
- Hasonló a type aliashoz (tagok névvel+típussal). Strukturális típusosság (`myObj` megfelel az interfésznek, ha megvan a struktúra).
- **Funkciót leíró típus**: `type filterFunc = (items: string[], query: string) => string[]` vagy interfész call szignatúrával.

## Osztályok
- **Támogatott**: osztályok, interfészek (explicit+implicit megvalósítás), absztrakt osztályok, öröklés, láthatósági módosítók, statikus tagok.
- **Nem támogatott**: valódi metódus overloading, valódi többszörös öröklés, típusonként több konstruktor.
- `abstract class`, `abstract makeSound()`, `static`, konstruktor paraméterben `public readonly name` (tulajdonság létrehozása), alapértelmezett láthatóság publikus. Származtatás `extends`, `super()` (this előtt), `protected`. String interpoláció backtickkel.
- **Accessors** (get/set, ~property): azonos láthatóság/típus, elég az egyik. **private** csak fordításidőben tilt (futásidőben indexerrel elérhető); **`#`** erősen védett (JS) privát mező. **Indexer**: `[member: string]: number` (minden tagnak meg kell felelnie; nem accessor).

## Metódus overload
- Nincs valódi overload (azonos név → később deklarált nyer; ezért nincs több konstruktor sem). De egy metódusnak lehet **több overload szignatúrája** + egyetlen implementáció (az impl. szignatúra közvetlenül nem hívható). Pl. `makeDate(timestamp)` / `makeDate(m,d,y)`.

## Generikusok
- Generikus típus/függvény: `class GenericNumber<T>`, `function firstElement<Type>(arr: Type[]): Type`. Példányosítás `new GenericNumber<number>()`.
- **Kényszer (constraint)**: `function f<T extends Lengthwise>(arg: T)` – típusbiztos kezelés.

## Egyéb
- **Spread (`...`, elkenés)**: objektumok/tömbök szétbontása-összeépítése (`{...defaults, food:"rich"}`, `[0, ...first, ...second]`).
- **Dekorátorok**: aspektus-orientált programozás (más nyelvben attribútum/annotáció), metaprogramozás; megváltoztatják a dekorált elem (metódus, osztály, mező, getter/setter) működését. A dekorátor egy függvény (originalMethod + context → replacement). Paraméterezhető (dekorátor-gyár). `@loggedMethod`.
- Egyéb: típusmanipuláció, szimbólumok, iterátor/generátor, névterek, mixinek, segédtípusok (Partial, NonNullable), never.

## Modulok
- Egységbezárás: logikailag összefüggő osztály/függvény/változó egy logikai fájlban. **export** (publikálás) / **import** (konzumálás). Külső függőségek is így. `export class …`, `import { Memory } from './components'`.

## Típusdeklarációs fájlok (.d.ts)
- A fordítónak megadható, hogy a JS mellé típusinfót is exportáljon → **`.d.ts`** (csak típusinfó, nem futtatható, ~C/C++ header).
- Külső JS könyvtár típusosan használható, ha van .d.ts (generálható vagy kézzel). Beszerzés: `@types` npm csomagok (`npm install --save @types/jquery`), `node_modules/@types/`. Így a JS könyvtárakhoz is IntelliSense + fordítási hibák.
