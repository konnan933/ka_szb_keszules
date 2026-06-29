# 5. tétel – JavaScript vs. TypeScript, fejlesztési folyamat, típuskompatibilitás, unió/metszet típusok

> Vázolja fel az alapvető különbségeket a JavaScript és a TypeScript nyelv között! Ismertesse a TypeScript fejlesztési folyamatát! Mit jelent a TypeScript nyelvben a típusok közötti kompatibilitás? Jellemezze a TypeScript unió- és metszettípusait!

*(Forrás: 05-ös PDF – TypeScript)*

---

## 1. JavaScript vs. TypeScript – alapvető különbségek

### A probléma, amire a TS válasz
- A nagy JavaScript kódbázisok **nehezen karbantarthatók** (dinamikus, gyenge típusosság miatt a hibák futásidőben derülnek ki). Anders Hejlsberg (C#, TypeScript): *"You can write large programs in JavaScript. You just can't maintain them."*

### A TypeScript lényege
- A **TypeScript a JavaScript típusos szuperszetje (superset)**:
  - **Minden JavaScript egyben TypeScript is** (visszafelé kompatibilis).
  - A JS dinamikus működését **kiegészíti statikus típusinformációkkal**.
- 2012-ben jelent meg, a Microsoft ingyenes, open source terméke. JavaScriptre fordul, így mindenhol fut, ahol JS (a célzott ECMAScript verzió konfigurálható).

### A főbb különbségek
| Szempont | JavaScript | TypeScript |
|----------|-----------|------------|
| Típusosság | dinamikusan + gyengén típusos | **statikusan + erősen** típusos (a dinamikus is megtartható `any`-vel) |
| Típushibák | **futásidőben** derülnek ki | **fordítási időben** (tsc) |
| Eszköztámogatás | korlátozott | igazi **IntelliSense**, refaktorálás |
| OO | prototípus-alapú, kevés OO konstrukció | osztály/interfész/absztrakt osztály/generikus/enum/láthatóság |
| Futtatás | böngésző/Node közvetlenül | előbb **JS-re fordul** (a futó kód JS) |

### Mit ad a TypeScript?
- Statikus típusellenőrzés → **fordítási idejű hibák a futásidejűek helyett**.
- Igazi IntelliSense (kódkiegészítés).
- Elrejti a JavaScript "furcsaságait".
- Használhatunk még nem szabványos JS elemeket (fordítás után sima JS lesz).
- Jelentősen javul a karbantarthatóság/olvashatóság → nagy kódbázis is kezelhető.

## 2. A TypeScript fejlesztési folyamata

1. **Forráskód**: `.ts` fájlokat írunk típusinformációkkal.
2. **Fordítás (transpile)**: a **TypeScript Compiler (`tsc`)** egy **source-to-source compiler / transpiler** – a TS-ből **JavaScriptet** generál. A böngészőben/Node-ban ez a JS fut (online: TS Playground).
3. **A fordítás eredménye**: a kapott JavaScript **NEM tartalmazza** a típusinformációkat → a lefordított JS továbbra is dinamikusan típusos. (A típusok csak fordításidőben léteznek, "type erasure".)
4. **Eszközök a folyamat körül**:
   - **NPM / Yarn**: csomagok, típusdefiníciók, osztálykönyvtárak beszerzése.
   - **Webpack / MSBuild / Browserify / JSPM**: csomagolás, disztribúció.
   - **Gulp / Grunt**: automatizálási szkriptek. **tsc CLI**: parancssoros fordítás.
   - IDE támogatás: Visual Studio, VS Code, WebStorm, stb.
5. **Külső JS integráció**: meglévő JS forrásokat a hiányzó típusinfókkal (**`.d.ts`** típusdeklarációs fájlokkal, pl. `@types` npm csomagok) kiegészítve **típusosan** használhatunk, megtartva a statikus típusrendszert (IntelliSense + fordítási hibák a JS könyvtárakhoz is).

## 3. Típuskompatibilitás: strukturális típusosság

A TypeScript-ben **NEM a típus neve számít, hanem a benne lévő tagok** – ez a **strukturális típusosság** (structural typing), szemben a Java/C# nominális (név szerinti) típusosságával.

### Definíciók
- **Strukturális típusosság**: egy A objektum a B típussal **strukturálisan kompatibilis**, ha A megvalósítja a B által leírt **strukturális interfészt**.
- **Strukturális interfész**: egy típus **publikusan elérhető tagváltozóinak és függvényeinek halmaza**.

### Példa
```ts
interface Named { name: string; }
class Person { id: string; name: string; }
let john: Named = new Person();   // OK: Person rendelkezik name-mel
```
Ha viszont a `Named`-nek lenne `shortName: string` tagja is, és a `Person`-nek nincs:
```ts
// Error: Type 'Person' is not assignable to type 'Named'.
//        Property 'shortName' is missing in type 'Person'.
```
Tehát egy érték akkor adható értékül egy típusnak, ha **legalább a megkívánt struktúrát** tartalmazza – akkor is, ha sosem nevezte meg azt a típust/interfészt (implicit interfészmegvalósítás).

### Type inference (típuskikövetkeztetés)
A fordító sok helyen **kikövetkezteti** a típust (értékadásból, kifejezésfából), így nem mindig kell explicit típusannotáció. A cél, hogy a script-nyelvi rugalmasságot keret közé emelje a kifejező erő csökkentése nélkül.

## 4. Unió- és metszettípusok

Meglévő típusokból új típusokat építhetünk – a strukturális típusossággal összhangban.

### Unió típus (`|`) – "VAGY"
- Az objektum **vagy az egyik, vagy a másik** típusú (property-kkel rendelkezik).
```ts
function printId(id: number | string) {
  if (typeof id === "string")  console.log(id.toUpperCase()); // itt id: string
  else                         console.log(id);               // itt id: number
}
type sizes = 'small' | 'medium' | 'large';   // string literálok uniója
```
- A használathoz gyakran **type narrowing** (típus szűkítés) kell (`typeof`, `Array.isArray`), hogy a fordító tudja, az adott ágban melyik konkrét típus van.
- Speciális esetei a **literál típusok** uniója (string/szám literálok), pl. `-1 | 0 | 1`, `number | "auto"`.

### Metszet típus (`&`) – "ÉS"
- Az új típus a kiinduló típusok **összes tagját egyszerre** tartalmazza (szemben az unióval, ahol vagy-vagy).
```ts
interface Sizable { size: number; }
type Labeled = { label: string; };
type SizableLabel = Sizable & Labeled;   // van size ÉS label is

function print(title: SizableLabel) {
  console.log(`label ${title.label} is size ${title.size}`);
}
print({ label: "Morning", size: 10 });   // OK
```
- Az `&` tehát **kombinálja/bővíti** a típusokat: a SizableLabel-hez tartozó objektumnak `size`-ja ÉS `label`-je is kell legyen.

### Unió vs. metszet összefoglalva
| | Unió `\|` | Metszet `&` |
|--|-----------|-------------|
| Jelentés | VAGY (az egyik típus) | ÉS (mindkét típus tagjai) |
| Tagok | a közös/szűkített rész használható biztosan | mindkét típus összes tagja megvan |
| Tipikus | `number \| string`, literál uniók | típusok bővítése/kombinálása |

---

### Kapcsolódó tételek
- A const/var/let, null-kezelés, type narrowing, overload: [[tetel-06]].
- Annotációk, interface, class, generikus, dekorátor: [[tetel-07]].
