# 7. tétel – Típus annotációk, aliasok, interface, class, generikusok, dekorátorok

> Ismertesse a típus annotációkat, aliasokat, interface és class deklarációkat TypeScriptben! Mutassa be a TypeScript generikus típusparamétereit! Mire jók a dekorátorok?

*(Forrás: 05-ös PDF – TypeScript)*

---

## 1. Típus annotációk

A TypeScript strukturálisan típusos: **nem a típus neve számít, hanem a benne lévő tagok**. A tagokat többféleképpen megadhatjuk; a legközvetlenebb a **type annotation**: a tagokat `{}` jelek között, név nélkül felsoroljuk.

```ts
// A paraméter típusa egy "object type" annotáció:
function print(person: { name: string; age: number }) {
  console.log(`${person.name} is ${person.age} year(s) old`);
}
print({ name: "Luke", age: 26 });
```

- A változó típusát a neve után írt `: típus` adja meg (`let x: number`), vagy a fordító kikövetkezteti (type inference).
- **Opcionális tag (`?`)**: paraméter vagy property lehet opcionális, ekkor **undefined** értéket vesz fel:
```ts
function print(name: string, age?: number) {
  console.log(`${name} is ${age ?? "unknown"} years old`);
}
```
  Ugyanez unióval is kifejezhető: `age: number | undefined` (és a `typeof` mint type guard használható).

## 2. Type alias

A **type alias** a típus annotációnak **nevet ad** – így újrafelhasználható, olvashatóbb:
```ts
type Point = { x: number; y: number; };
function printCoord(pt: Point) {
  console.log("x: " + pt.x);
  console.log("y: " + pt.y);
}
printCoord({ x: 100, y: 100 });

type ID = number | string;     // unió típusra is
type bool = false | true;
```

## 3. Interface (interfész)

Az **interface** szintén nevesített típust ad; tagokat definiál névvel és típussal. Egy interfész definiálhat:
- **tagváltozót**, **függvényt**, **függvény-szignatúrát**, **konstruktor-szignatúrát**, **indexelhető típust**.

```ts
interface Point { x: number; y: number; }
function printCoord(pt: Point) { console.log(pt.x, pt.y); }
printCoord({ x: 100, y: 100 });
```

- **Strukturális típusosság**: nem kell explicit "implements" – ha egy objektum megfelel a struktúrának, az interfész típusába illik:
```ts
let myObj = { size: 10, label: "Size 10 Object" };
interface LabelledValue { label: string; }
function printLabel(o: LabelledValue) { console.log(o.label); }
printLabel(myObj);    // OK: myObj-nek van label-je
```
- **Funkciót leíró típus** (call signature): `interface filterInt { (items: string[], query: string): string[]; }` – ekvivalens a `type filterFunc = (items: string[], query: string) => string[]` aliasszal.

### interface vs. type alias
Nagyon hasonlóak (mindkettő nevesít típust). Az interfész inkább objektumok/osztályok szerződéséhez, kiterjeszthető (`extends`) és összeolvasztható (declaration merging); a type alias rugalmasabb (uniók, primitívek, tuple). A vizsga szempontjából: mindkettő tagokat ír le, strukturálisan ellenőrződnek.

## 4. Class (osztály) deklarációk

A TypeScript osztályokban **támogatott**: osztályok, interfészek (explicit+implicit megvalósítás), **absztrakt osztályok**, **öröklés**, **láthatósági módosítók**, **statikus** tagok. **Nem támogatott**: valódi metódus overloading, valódi többszörös öröklés, típusonként több konstruktor.

```ts
abstract class Animal {
  abstract makeSound(): void;            // absztrakt metódus
  static allAnimalsCount = 0;            // osztályszintű (statikus) változó
  constructor(public readonly name: string) {  // tulajdonság létrehozása + readonly
    Animal.allAnimalsCount++;
  }
  move(): void { console.log("roaming..."); }   // nem absztrakt metódus
}

class Dog extends Animal {               // öröklés
  protected bones: number = 0;           // leszármazotti láthatóság
  constructor(name: string, public kind: DogKind) {
    super(name);                         // ős inicializálása a this előtt kötelező
    this.bones++;
  }
  makeSound(): void {                    // absztrakt metódus megvalósítása
    console.log(`Wooof! I am ${this.name}.`);  // tag eléréshez mindig this.
  }
}
```

Fontos részletek:
- **Láthatósági módosítók**: alapértelmezés **public**; `private`, `protected`, `readonly`. A konstruktor paraméterben megadott módosító egyben tulajdonságot is létrehoz.
- **`private`** csak **fordításidőben** tilt (futásidőben JS-ben indexeléssel elérhető `s["secretKey"]`). Az **`#` mező** (JS) **erősen védett** privát.
- **Accessors** (get/set, ~Java/C# property): azonos láthatóság/típus, elég az egyik; a használat látszólag a sima mezőé.
- **Indexer**: `[member: string]: number` – minden tagnak meg kell felelnie az indexer típusának (nem get/set, nem típusos a "ismeretlen" tagokra).
- **Backtick string interpoláció**: `` `${this.name}` ``.

## 5. Generikus típusparaméterek

A generikusok **típusparaméterezett** típusokat/függvényeket tesznek lehetővé (mint más OO nyelvekben), így a kód típusbiztos és újrafelhasználható.

```ts
// Generikus függvény:
function firstElement<Type>(arr: Type[]): Type | undefined { return arr[0]; }

// Generikus osztály:
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
let g = new GenericNumber<number>();   // generikus példány
g.zeroValue = 0;
g.add = (x, y) => x + y;
```

- **Típuskényszer (constraint)**: a generikus paraméternek megszabhatjuk, hogy egy adott struktúrát teljesítsen (`extends`):
```ts
interface Lengthwise { length: number; }
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);   // típusbiztos: T-nek biztosan van length-je
  return arg;
}
```
A constraint biztosítja, hogy a generikus kódban csak a megkövetelt tagokra hivatkozzunk (a `length` itt garantáltan létezik).

## 6. Dekorátorok – mire jók?

- A **dekorátorok** az **aspektus-orientált programozás** kellékei; más nyelvekben **attribútum** (C#) vagy **annotáció** (Java) néven ismertek. **Metaprogramozás**: olyan kódot írunk, ami másik (felhasználói adatot kezelő) kódot dolgoz fel/módosít.
- A dekorátor **megváltoztatja a dekorált nyelvi elem** (metódus, osztály, mező, getter/setter) **működését**, anélkül, hogy az eredeti elem kódját módosítanánk. Lehet: **lecserélni** a dekorált elemet, **beleszólni az inicializálásba**.
- **A dekorátor egy függvény**: megkapja az eredeti elemet (`originalMethod`) és a kontextust (`context`), és visszaadhat egy helyettesítő elemet.

```ts
function loggedMethod(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);
  function replacementMethod(this: any, ...args: any[]) {
    console.log(`LOG: Entering method ${methodName}.`);
    const result = originalMethod.call(this, ...args);   // eredeti hívása
    console.log(`LOG: Exiting method ${methodName}.`);
    return result;
  }
  return replacementMethod;
}

class Dog {
  constructor(public name: string) {}
  @loggedMethod                        // dekorátor alkalmazása
  bark() { console.log(`Woof, my name is ${this.name}.`); }
}
// dog.bark() kiírja: belépés -> Woof... -> kilépés
```

- **Paraméterezhető** (dekorátor-gyár): a függvény egy dekorátor függvényt ad vissza, így pl. testreszabható naplóüzenet (`@loggedMethod("Dog")`).
- Tipikus felhasználás: naplózás, validáció, jogosultság-ellenőrzés, dependency injection, keretrendszer-metaadatok (pl. Angular `@Component`).

---

### Kapcsolódó tételek
- JS vs TS, fejlesztési folyamat, strukturális típusosság, unió/metszet: [[tetel-05]].
- const/var/let, null kezelés, type narrowing, overload: [[tetel-06]].
