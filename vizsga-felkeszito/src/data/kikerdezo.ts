// Kikérdező: minden tételhez pontonként egy feleletválasztós kérdés.
// A kérdések a tétel összefoglalójának (és a teljes kidolgozásnak) minden
// pontját lefedik – végigkérdezik az adott témát.

export interface ExamQ {
  q: string;
  options: string[];
  correct: number; // 0-alapú index
  explanation: string;
}

export const KIKERDEZO: Record<number, ExamQ[]> = {
  1: [
    {
      q: "Mi a weboldal a kiszolgálás szempontjából?",
      options: [
        "Egyetlen HTTP kérésben letöltött bináris csomag",
        "Böngészőben megjeleníthető dokumentum (HTML/CSS/JS/képek), amelynek betöltése több HTTP kérésből áll",
        "Kizárólag a szerveren futó program, ami nem jelenik meg a kliensen",
      ],
      correct: 1,
      explanation: "A weboldal böngészőben megjeleníthető dokumentum (HTML, CSS, JS, képek), és a betöltése jellemzően több HTTP kérésből tevődik össze.",
    },
    {
      q: "Mi a klasszikus 3-rétegű webarchitektúra helyes sorrendje?",
      options: [
        "Kliens (böngésző) → Web/App szerver → Adatbázis",
        "Kliens → Adatbázis → Web/App szerver",
        "Web szerver → Kliens → Adatbázis",
      ],
      correct: 0,
      explanation: "A 3-rétegű felépítés: a kliens (böngésző) a web/alkalmazás szerverrel kommunikál, az pedig az adatbázissal.",
    },
    {
      q: "Melyik NEM feladata a webszerver szoftvernek?",
      options: [
        "Port figyelése és az URL feloldása",
        "HTTP kérések kezelése, statikus és dinamikus kiszolgálás",
        "A böngésző DOM-jának közvetlen módosítása",
      ],
      correct: 2,
      explanation: "A webszerver portot figyel, URL-t old fel, HTTP-t kezel és tartalmat szolgáltat. A böngésző DOM-ját a kliensoldali JS módosítja, nem a szerver.",
    },
    {
      q: "Mit jelent a statikus kiszolgálás?",
      options: [
        "A tartalmat futásidőben generálja az adatbázisból",
        "Az URL → fájlrendszer megfeleltetés alapján kész fájlokat ad vissza",
        "Csak HTTPS-en keresztül működik",
      ],
      correct: 1,
      explanation: "Statikus kiszolgálásnál a szerver az URL alapján a fájlrendszerből veszi elő és adja vissza a kész fájlt (egyszerű, gyors, olcsó).",
    },
    {
      q: "Mi alapján állítja elő a választ a dinamikus kiszolgálás?",
      options: [
        "Mindig ugyanazt a statikus fájlt adja vissza",
        "A kérés paraméterei és az alkalmazás állapota (memória, DB) alapján, futásidőben generálja",
        "A böngésző verziószáma alapján",
      ],
      correct: 1,
      explanation: "A dinamikus kiszolgálás a kérés paraméterei és az alkalmazás állapota (pl. adatbázis) alapján futásidőben állítja elő a tartalmat.",
    },
    {
      q: "Mi jellemzi a webalkalmazást a weboldallal szemben?",
      options: [
        "Dokumentum-szemléletű, csak tartalmat jelenít meg",
        "Alkalmazás-szemléletű: állapotkezelés, API-kon keresztüli szerverkommunikáció (pl. SPA)",
        "Egyáltalán nem használ JavaScriptet",
      ],
      correct: 1,
      explanation: "A weboldal dokumentum-szemléletű (tartalom), a webalkalmazás alkalmazás-szemléletű: állapotot kezel és API-kon keresztül kommunikál (pl. Single Page Application).",
    },
    {
      q: "Miért mondjuk, hogy egy SPA statikus kiszolgálást használ?",
      options: [
        "Mert nem módosítja a DOM-ot",
        "Mert a HTML/JS/CSS statikus fájlként töltődik le, és a JS futásidőben kér adatot API-ról (JSON)",
        "Mert egyáltalán nem kommunikál a szerverrel",
      ],
      correct: 1,
      explanation: "Az SPA statikusan letölti a HTML/CSS/JS állományokat, majd a kliensoldali JS futásidőben, API-n keresztül (JSON) tölti be dinamikusan az adatokat.",
    },
    {
      q: "Miért van szükség cookie-ra / sessionre / tokenre a webfejlesztésben?",
      options: [
        "Mert a HTTP állapotmentes (stateless), önmagában nem köti össze a kéréseket",
        "Mert a HTTP nem tud képeket átvinni",
        "Mert a böngésző nem támogatja a JavaScriptet",
      ],
      correct: 0,
      explanation: "A HTTP állapotmentes, ezért az egymást követő kérések összekapcsolásához (állapot megőrzéséhez) cookie, session, web storage vagy token kell.",
    },
  ],
  2: [
    {
      q: "Mi a HTML?",
      options: [
        "Programozási nyelv vezérlési szerkezetekkel",
        "Jelölőnyelv a weboldal struktúrájának leírására (HTML Living Standard a szabvány)",
        "Stíluslap-nyelv az elemek megjelenéséhez",
      ],
      correct: 1,
      explanation: "A HTML jelölőnyelv (markup), a weboldal struktúráját írja le; szabványa a HTML Living Standard. A megjelenés a CSS dolga.",
    },
    {
      q: "Melyik a HTML dokumentum kötelező vázának helyes felépítése?",
      options: [
        "<!DOCTYPE html>, <html>, <head>, <body>",
        "<page>, <style>, <content>",
        "<html>, <main>, <data>",
      ],
      correct: 0,
      explanation: "A kötelező váz: <!DOCTYPE html>, <html>, azon belül <head> (meta, title, css link) és <body> (tartalom, scriptek).",
    },
    {
      q: "Mi az előnye a szemantikus elemeknek (<header>, <nav>, <article>)?",
      options: [
        "Gyorsabbá teszik a hálózati átvitelt",
        "Jelentéssel bírnak: javítják a SEO-t és az akadálymentesítést",
        "Automatikusan stílusozzák az oldalt",
      ],
      correct: 1,
      explanation: "A szemantikus elemek jelentést hordoznak, ezáltal javítják a keresőoptimalizálást (SEO), az akadálymentesítést és a kód olvashatóságát.",
    },
    {
      q: "Mi a különbség a blokk és az inline elem között?",
      options: [
        "A blokk mindig új sorban kezdődik (div, p), az inline sorban folytatódik (span, a)",
        "Az inline elem mindig új sort kezd",
        "Nincs köztük különbség",
      ],
      correct: 0,
      explanation: "A blokk elem új sorban kezdődik és kitölti a szélességet (div, p, listák); az inline soron belül marad és csak a szükséges helyet foglalja (span, a, strong).",
    },
    {
      q: "A <label> 'for' attribútuma mire mutasson?",
      options: [
        "Az input 'name' attribútumára",
        "Az input 'id' attribútumára",
        "Az input típusára (type)",
      ],
      correct: 1,
      explanation: "A label 'for' attribútuma az input 'id'-jával egyezik meg (kliensoldali összekötés, fókusz). A 'name' a szerveroldali űrlap-beküldéshez kell.",
    },
    {
      q: "Melyik a kliensoldali űrlap-validáció eszköze?",
      options: [
        "required, pattern (regex), min/max attribútumok + a JS Validation API",
        "SQL constraintek az adatbázisban",
        "HTTP státuszkódok",
      ],
      correct: 0,
      explanation: "Kliensoldalon a required/pattern/min/max attribútumok és a JS Validation API (willValidate, validity, setCustomValidity) végzik a validációt.",
    },
    {
      q: "Mi a CSS feladata?",
      options: [
        "Az oldal struktúrájának leírása",
        "Az elemek stílusának (megjelenésének) meghatározása",
        "A szerveroldali logika futtatása",
      ],
      correct: 1,
      explanation: "A CSS (Cascading Style Sheets) az elemek megjelenését (stílusát) határozza meg, szelektor + deklarációs blokk formájában.",
    },
    {
      q: "Melyik kombinátor jelöli a KÖZVETLEN gyermeket CSS-ben?",
      options: ["szóköz (összes leszármazott)", "> (közvetlen gyermek)", "~ (összes testvér)"],
      correct: 1,
      explanation: "A > a közvetlen gyermeket jelöli. A szóköz az összes leszármazottat, a ~ az összes testvért, a + a közvetlen szomszédot.",
    },
    {
      q: "Melyik a CSS specifikusság (erősség) helyes sorrendje?",
      options: [
        "Elem > Class > ID > Inline",
        "Inline (1000) > ID (100) > Class/Attr/Pseudo-class (10) > Elem/Pseudo-elem (1)",
        "ID > Inline > Elem > Class",
      ],
      correct: 1,
      explanation: "Erősségi sorrend: inline stílus (1000) > ID (100) > class/attribútum/pszeudo-osztály (10) > elem/pszeudo-elem (1). Az !important mindent felülír.",
    },
  ],
  3: [
    {
      q: "Milyen típusrendszerű a JavaScript?",
      options: [
        "Statikusan és erősen típusos, előzetes fordítással",
        "Dinamikusan és gyengén típusos; a motor sorról sorra értelmezi és futtatja",
        "Típus nélküli nyelv",
      ],
      correct: 1,
      explanation: "A JS dinamikusan és gyengén típusos szkriptnyelv; a motor előzetes fordítás nélkül, sorról sorra értelmezi, hiba esetén leáll.",
    },
    {
      q: "Melyik a kliensoldali JavaScript tipikus feladata?",
      options: [
        "DOM manipuláció, eseménykezelés, aszinkron kommunikáció (fetch/JSON), kliensoldali tárolás",
        "Adatbázis-kezelés a szerveren",
        "Közvetlen operációsrendszer-hívások",
      ],
      correct: 0,
      explanation: "Kliensoldalon a JS a DOM-ot kezeli, eseményeket figyel, aszinkron kommunikál (fetch/JSON) és kliensoldalon tárol (localStorage, IndexedDB).",
    },
    {
      q: "Mi a közös a böngésző és a Node.js JavaScript-környezetében?",
      options: [
        "Mindkettőben van window és document objektum",
        "A nyelvmag (ECMAScript) azonos; a Browser API-k (window, DOM) csak böngészőben vannak",
        "Mindkettőben azonos a fájlrendszer API",
      ],
      correct: 1,
      explanation: "Az ECMAScript nyelvmag mindkettőben azonos, de a Browser API-k (window, document, DOM) csak a böngészőben érhetők el; a Node.js fájlrendszer/hálózati API-kat ad.",
    },
    {
      q: "Mit ad vissza a `typeof null` a JavaScriptben?",
      options: ["'null'", "'object' (ismert nyelv-szintű bug)", "'undefined'"],
      correct: 1,
      explanation: "A typeof null az 'object' értéket adja – ez egy korai, visszafelé kompatibilitás miatt megtartott nyelvi hiba.",
    },
    {
      q: "Melyik NEM falsy érték?",
      options: ["0", "'' (üres string)", "'0' (a nullát tartalmazó string)"],
      correct: 2,
      explanation: "A falsy értékek: false, 0, NaN, '' (üres string), null, undefined. A '0' nem üres string, ezért truthy.",
    },
    {
      q: "Mi a különbség a == és a === között?",
      options: [
        "Nincs különbség",
        "A === a típust is ellenőrzi (nincs konverzió), a == implicit konverziót végez",
        "A == a szigorúbb, típust is ellenőriz",
      ],
      correct: 1,
      explanation: "A === szigorú egyenlőség: típust és értéket is ellenőriz konverzió nélkül. A == laza egyenlőség: implicit típuskonverziót végez.",
    },
    {
      q: "Mit jelent, hogy a függvény 'first-class citizen' a JavaScriptben?",
      options: [
        "Mindig elsőként fut le a programban",
        "Értékként kezelhető: változóba tehető, paraméterként átadható, visszatérési értékként visszaadható",
        "Csak osztályon belül definiálható",
      ],
      correct: 1,
      explanation: "A first-class citizen azt jelenti, hogy a függvény teljes értékű érték: változóhoz rendelhető, paraméterként átadható (callback) és visszaadható.",
    },
  ],
  4: [
    {
      q: "Hogyan valósul meg az öröklés a JavaScriptben alapvetően?",
      options: [
        "Valódi osztályokkal a háttérben",
        "Prototípus-lánccal: minden objektumnak van prototípusa (egy másik objektum vagy null)",
        "Interfészek implementálásával",
      ],
      correct: 1,
      explanation: "A JS prototípus alapú: minden objektumnak van egy prototípusa (másik objektum vagy null), a háttérben nincsenek valódi osztályok.",
    },
    {
      q: "Hol jön létre egy property property-ÍRÁSKOR a prototípus-láncban?",
      options: [
        "Mindig a prototípuson",
        "Mindig a konkrét objektumon (a prototípust nem módosítja)",
        "Sehol, írás nem lehetséges",
      ],
      correct: 1,
      explanation: "Olvasáskor a lánc mentén felfelé keres; íráskor viszont mindig a konkrét objektumon jön létre az érték, a prototípus érintetlen marad.",
    },
    {
      q: "Mivel érhető el egy objektum prototípusa?",
      options: [
        "obj.prototype",
        "Object.getPrototypeOf(obj) vagy __proto__",
        "obj.super",
      ],
      correct: 1,
      explanation: "A prototípus elérése Object.getPrototypeOf(obj) vagy __proto__ útján történik; a beállítás Object.setPrototypeOf()-fal.",
    },
    {
      q: "Mi a kapcsolat a `new User()` példány és a konstruktor között?",
      options: [
        "példány.__proto__ === User.prototype",
        "példány.prototype === User.__proto__",
        "Nincs köztük kapcsolat",
      ],
      correct: 0,
      explanation: "A new operátorral létrehozott példány __proto__-ja a konstruktor prototype objektumára mutat – a prototype és a __proto__ nem azonos!",
    },
    {
      q: "Mi az ES6 class a háttérben?",
      options: [
        "Teljesen új, prototípustól független mechanizmus",
        "Szintaktikai cukor a prototípus-lánc felett; az osztályok nem hoistolódnak",
        "Csak TypeScriptben létező konstrukció",
      ],
      correct: 1,
      explanation: "Az ES6 class szintaktikai cukor a prototípus-lánc felett (extends, super, instanceof); az osztályok nem hoistolódnak, deklaráció előtt nem használhatók.",
    },
    {
      q: "Miért van szükség aszinkron végrehajtásra a böngészőben?",
      options: [
        "Mert a JS többszálú, és párhuzamosítani kell",
        "Mert a JS egyszálú, a hosszú blokkoló műveletek lefagyasztanák a UI-t",
        "Mert a hálózat mindig lassú",
      ],
      correct: 1,
      explanation: "A JS a böngészőben egyszálú, egyszerre egy kód fut; a blokkoló műveletek megakasztanák a UI-t, ezért kell aszinkron végrehajtás.",
    },
    {
      q: "Mikor veszi ki az Event Loop a callback sor első elemét?",
      options: [
        "Azonnal, megszakítva a futó kódot",
        "Amikor a hívási verem (call stack) teljesen kiürült",
        "Véletlenszerű időközönként",
      ],
      correct: 1,
      explanation: "Az Event Loop csak akkor emel be egy callbacket a sorból, ha a hívási verem kiürült – ezért a callbackek nem szakítják meg egymást (nincs versenyhelyzet).",
    },
    {
      q: "Mik a Promise állapotai?",
      options: [
        "open, closed",
        "pending → fulfilled (sikeres) VAGY rejected (hiba)",
        "start, stop, error",
      ],
      correct: 1,
      explanation: "A Promise pending (függő) állapotból fulfilled (teljesült) vagy rejected (elutasított) állapotba kerül; láncolható (.then/.catch/.finally).",
    },
    {
      q: "Melyik Promise-kombinátor vár az ÖSSZESre, de az első hibánál azonnal elhasal?",
      options: ["Promise.allSettled", "Promise.all", "Promise.race"],
      correct: 1,
      explanation: "A Promise.all az összesre vár, de ha egy is rejectel, azonnal elhasal. A allSettled mindegyik státuszát megvárja, a race az első késszel tér vissza.",
    },
    {
      q: "Mi az async/await?",
      options: [
        "Új szál (thread) indítása",
        "Szintaktikai cukor a Promise-okhoz: szinkron kinézetű aszinkron kódot ad",
        "Blokkoló várakozás a fő szálon",
      ],
      correct: 1,
      explanation: "Az async/await szintaktikai cukor a Promise-ok felett: szinkron olvashatóságú, de valójában nem blokkoló aszinkron kódot eredményez.",
    },
    {
      q: "Mi a closure (lezárás)?",
      options: [
        "Egy lezárt, többé nem hívható függvény",
        "A belső függvény megőrzi a külső (befoglaló) függvény változóit annak lefutása után is",
        "Egy privát osztálymező",
      ],
      correct: 1,
      explanation: "A closure olyan függvény, ami 'emlékszik' a létrehozáskori (lexikális) környezetére – a külső függvény változóira annak lefutása után is.",
    },
    {
      q: "Mi jellemzi az arrow function 'this' kezelését?",
      options: [
        "Saját, dinamikus this-e van, mint a sima függvénynek",
        "Nincs saját this-e: a lexikális (befoglaló) környezet this-ét örökli",
        "A this mindig a window objektum",
      ],
      correct: 1,
      explanation: "A nyíl függvénynek nincs saját this-e; a létrehozáskori befoglaló környezet this-ét veszi át, ezért hasznos callbackekben.",
    },
  ],
  5: [
    {
      q: "Milyen viszonyban van a TypeScript és a JavaScript?",
      options: [
        "A TS teljesen más nyelv, nem kompatibilis a JS-sel",
        "A TS a JS szuperszetje: minden érvényes JS egyben érvényes TS, statikus/erős típusokkal kiegészítve",
        "A JS a TS szuperszetje",
      ],
      correct: 1,
      explanation: "A TypeScript a JavaScript szuperszetje: minden JS kód érvényes TS is, de a TS statikus, erős típusrendszert ad a karbantarthatóságért.",
    },
    {
      q: "Mikor derülnek ki a típushibák TypeScriptben?",
      options: [
        "Futásidőben, mint a JS-ben",
        "Fordítási időben (a tsc fordító jelzi)",
        "Sosem derülnek ki",
      ],
      correct: 1,
      explanation: "TS-ben a típushibák fordítási időben (tsc) derülnek ki, szemben a JS-sel, ahol csak futásidőben.",
    },
    {
      q: "Mi a TypeScript fejlesztési folyamata?",
      options: [
        ".ts forrás → tsc transpiler → böngészőben futtatható tiszta JS",
        ".ts forrás közvetlenül fut a böngészőben",
        ".ts forrás → natív gépi kód",
      ],
      correct: 0,
      explanation: "A .ts forrást a tsc (source-to-source) transpiler tiszta JavaScriptté fordítja, ami már futtatható a böngészőben.",
    },
    {
      q: "Mit jelent a típuseltörlés (type erasure)?",
      options: [
        "A generált JS nem tartalmaz típusinformációt; a típusok csak fordításkor léteznek",
        "A típusok futásidőben is ellenőrződnek",
        "A típusok törlik a változókat a memóriából",
      ],
      correct: 0,
      explanation: "A típusok csak fordításidőben léteznek; a kibocsátott JavaScript kód már nem tartalmaz típusinformációt (type erasure).",
    },
    {
      q: "Mire valók a .d.ts fájlok?",
      options: [
        "Futtatható JavaScript kódot tartalmaznak",
        "Sima JS könyvtárak típusleírására (pl. @types), hogy megmaradjon a típusbiztonság",
        "CSS stílusok leírására",
      ],
      correct: 1,
      explanation: "A .d.ts típusdeklarációs fájlok a sima JS könyvtárak API-ját írják le a fordítónak (IntelliSense, típusellenőrzés), futtatható kód nélkül.",
    },
    {
      q: "Mi alapján kompatibilis két típus a TypeScriptben?",
      options: [
        "A típus neve és deklarációs helye alapján (nominális)",
        "A publikus tagok struktúrája alapján (strukturális típusosság / duck typing)",
        "Csak ha explicit implements szerepel",
      ],
      correct: 1,
      explanation: "A TS strukturálisan típusos: nem a név, hanem a tagok struktúrája dönt. Ha A tartalmazza a B által elvárt tagokat, A kompatibilis B-vel.",
    },
    {
      q: "Mit jelent a `number | string` unió típus?",
      options: [
        "Egyszerre number és string is",
        "Vagy number, vagy string; biztonságos eléréshez type narrowing kell",
        "Egy számokból álló string",
      ],
      correct: 1,
      explanation: "Az unió (|) szerint az érték vagy az egyik, vagy a másik típusú; a típusspecifikus tagok eléréséhez típus-szűkítés (narrowing) szükséges.",
    },
    {
      q: "Mit eredményez a metszet (&) típus?",
      options: [
        "Csak a közös tagokat tartalmazó típust",
        "Az összes kiinduló típus tagját egyszerre tartalmazó (bővített) típust",
        "Üres típust",
      ],
      correct: 1,
      explanation: "A metszet (&) kombinálja a típusokat: az eredmény az összes kiinduló típus tagjait egyszerre tartalmazza.",
    },
  ],
  6: [
    {
      q: "Milyen hatókörű a `var`?",
      options: [
        "Blokk-szintű ({} szerint)",
        "Függvény-szintű (function scope), figyelmen kívül hagyja a blokkokat, és hoistolódik",
        "Kizárólag globális",
      ],
      correct: 1,
      explanation: "A var függvényhez kötött, a {} blokkokat figyelmen kívül hagyja, és hoistolódik (undefined kezdőértékkel) – ezért hibalehetőség.",
    },
    {
      q: "Mi igaz a `const`-ra?",
      options: [
        "Blokk-szintű, nem enged újraértékadást, és inicializálni kell",
        "Függvény-szintű, mint a var",
        "Bármikor újraértékadható",
      ],
      correct: 0,
      explanation: "A const (és let) blokk-szintű; a const nem enged újraértékadást és kötelező inicializálni. TS-ben a let/const az ajánlott.",
    },
    {
      q: "Mi a különbség a null és az undefined között?",
      options: [
        "Az undefined inicializálatlan érték (számmá NaN), a null explicit üres érték (számmá 0)",
        "Teljesen azonosak",
        "A null truthy, az undefined falsy",
      ],
      correct: 0,
      explanation: "Az undefined az inicializálatlan változó/tulajdonság (számmá NaN), a null explicit üres érték (számmá 0); mindkettő falsy.",
    },
    {
      q: "Mit eredményez a strictNullChecks flag bekapcsolása?",
      options: [
        "A null/undefined bármilyen típushoz rendelhető",
        "A null/undefined nem adható más típusnak; explicit unió kell (pl. number | null)",
        "Kikapcsolja a teljes típusellenőrzést",
      ],
      correct: 1,
      explanation: "strictNullChecks mellett a null/undefined nem rendelhető más típushoz; ha megengedjük, explicit unióval kell jelölni (number | null).",
    },
    {
      q: "Mit csinál az opcionális láncolás (x?.y)?",
      options: [
        "Hibát dob, ha x null",
        "Ha x null/undefined, a teljes kifejezés undefined lesz (nincs hiba)",
        "Mindig visszaadja y-t",
      ],
      correct: 1,
      explanation: "Az opcionális láncolás (?.) null/undefined esetén undefined-et ad vissza hiba nélkül. (A ?? null coalescing, a ! non-null assertion.)",
    },
    {
      q: "Mi a type narrowing (típusszűkítés)?",
      options: [
        "A változó típusának szűkítése a kód (pl. if ágak, type guardok) alapján",
        "A típusinformáció törlése a memóriából",
        "Egy memóriaoptimalizálási technika",
      ],
      correct: 0,
      explanation: "A fordító a kód futását elemzi (pl. if ágak, type guardok), és ennek alapján szűkíti a változó lehetséges típusát.",
    },
    {
      q: "Melyik egy type guard?",
      options: [
        "typeof, instanceof, Array.isArray(), in operátor, === null",
        "for, while ciklusok",
        "try/catch blokk",
      ],
      correct: 0,
      explanation: "Type guardok pl.: === null, typeof, instanceof, Array.isArray(), in operátor – ezek alapján szűkít a fordító.",
    },
    {
      q: "Hogyan működik az overload (túlterhelés) a TypeScriptben?",
      options: [
        "A JavaScript natívan támogatja a túlterhelést",
        "Több hívható overload szignatúra + egyetlen közös implementáció, ami közvetlenül nem hívható",
        "Több külön implementációval, mint Java-ban",
      ],
      correct: 1,
      explanation: "JS-ben nincs overload; TS-ben több szignatúrát adunk meg és EGY közös, kompatibilis típusú implementációt (ami közvetlenül nem hívható).",
    },
  ],
  7: [
    {
      q: "Mit jelez az opcionális tag (?) egy object type annotációban?",
      options: [
        "Hogy a tag mindig kötelező",
        "Hogy a tag felveheti az undefined értéket (opcionális)",
        "Hogy a tag privát",
      ],
      correct: 1,
      explanation: "Az object type annotációban a ? opcionális tagot jelöl, ami undefined értéket is felvehet.",
    },
    {
      q: "Mi igaz a type aliasra (pl. `type ID = number`)?",
      options: [
        "Csak objektumtípusra használható",
        "Névvel lát el egy típust (unióra, primitívre, tuple-re is), de NEM olvad össze újradeklarálással",
        "Mindig összeolvad az azonos nevű aliasokkal",
      ],
      correct: 1,
      explanation: "A type alias névvel lát el egy típust (uniókra, primitívekre, tuple-ökre is jó), de nem terjeszthető ki újradeklarálással (nincs declaration merging).",
    },
    {
      q: "Mi az interface egyik egyedi képessége a type-pal szemben?",
      options: [
        "Declaration merging: az azonos nevű interfészek összeolvadnak",
        "Unió típus leírása",
        "Primitív típus átnevezése",
      ],
      correct: 0,
      explanation: "Az interfész kiterjeszthető (extends) és összeolvasztható (declaration merging): az azonos nevű interfészek egyetlen interfésszé folynak össze.",
    },
    {
      q: "Mi kötelező az öröklődő osztály konstruktorában a `this` használata előtt?",
      options: ["return", "a super() hívása", "a new operátor"],
      correct: 1,
      explanation: "Öröklődő (extends) osztálynál a konstruktorban a this használata előtt kötelezően meg kell hívni a super()-t.",
    },
    {
      q: "Miért nem ad a TS `private` valódi futásidejű védelmet?",
      options: [
        "Mert lassabb a kód",
        "Mert csak fordításidőben tilt; a JS-ben indexeléssel elérhető – valódi védelemhez a # JS privát mező kell",
        "Mert teljes védelmet ad futásidőben is",
      ],
      correct: 1,
      explanation: "A TS private csak fordításkor korlátoz; a transpilált JS-ben indexeléssel (obj['x']) elérhető. Valódi futásidejű védelemhez a # privát mező való.",
    },
    {
      q: "Mit csinál a `constructor(public readonly name: string)` rövidítés?",
      options: [
        "Semmit, csak egy paraméter",
        "Automatikusan létrehozza és inicializálja a name tulajdonságot (parameter property)",
        "Csak validálja a paramétert",
      ],
      correct: 1,
      explanation: "A konstruktor-paraméter elé tett módosító (public/private/readonly...) automatikusan deklarálja a mezőt és elvégzi a this.name = name értékadást.",
    },
    {
      q: "Mire való a generikus constraint (pl. `T extends Lengthwise`)?",
      options: [
        "A típus törlésére",
        "A típusparaméter korlátozására, hogy biztosan rendelkezzen a szükséges taggal (pl. length)",
        "A futási sebesség növelésére",
      ],
      correct: 1,
      explanation: "A constraint (T extends X) korlátozza a generikus típusparamétert, így garantált, hogy rendelkezik a szükséges tulajdonságokkal (pl. length).",
    },
    {
      q: "Mi a dekorátor (@decorator) a TypeScriptben?",
      options: [
        "Egy CSS osztály",
        "Függvény, ami az osztály betöltésekor fut, és kódátírás nélkül módosítja a dekorált elem működését (pl. naplózás, DI)",
        "Egy típus alias",
      ],
      correct: 1,
      explanation: "A dekorátor aspektus-orientált metaprogramozási eszköz: olyan függvény, ami betöltéskor fut és módosítja az osztály/metódus/mező viselkedését az eredeti kód átírása nélkül.",
    },
  ],
  8: [
    {
      q: "Mire fordítja a Babel a JSX-et?",
      options: [
        "Közvetlen natív DOM hívásokra",
        "React.createElement() hívásokra",
        "Sima HTML stringre",
      ],
      correct: 1,
      explanation: "A JSX HTML-szerű szintaxis, amit a Babel React.createElement() hívásokra fordít. A TSX ennek típusellenőrzött változata.",
    },
    {
      q: "Hogyan illesztünk JS kifejezést a JSX-be?",
      options: [
        "{} kapcsos zárójelbe; csak kifejezés lehet (if/for helyett ?: , && és .map)",
        "<% %> tagek közé",
        "$() szintaxissal",
      ],
      correct: 0,
      explanation: "JS kifejezést {} közé teszünk a JSX-ben, és csak kifejezés állhat ott (utasítás nem) – ezért használunk ?: , && és .map szerkezeteket.",
    },
    {
      q: "Miért className és htmlFor szerepel a JSX-ben a class és for helyett?",
      options: [
        "Mert ezek gyorsabbak",
        "Mert a class és a for foglalt JavaScript kulcsszavak",
        "Csak véletlen elnevezési döntés",
      ],
      correct: 1,
      explanation: "A class és a for JS kulcsszavak, ezért a JSX className-et és htmlFor-t használ helyettük.",
    },
    {
      q: "Mi a virtuális DOM (vDOM)?",
      options: [
        "Egy második böngészőablak",
        "JS objektumok fája (ReactElement), amivel a React modellezi a felületet",
        "A szerveroldali DOM másolata",
      ],
      correct: 1,
      explanation: "A virtuális DOM JS objektumok (ReactElement) fája, amivel a React leírja a UI-t – gyors, és elkerüli a natív DOM közvetlen manipulációját.",
    },
    {
      q: "Mit csinál a diffing algoritmus állapotváltozáskor?",
      options: [
        "Az egész oldalt újratölti",
        "Összeveti az új és a régi vDOM-ot, és csak a minimális módosítást küldi a valódi DOM-ba",
        "Törli és újraépíti a teljes DOM-ot",
      ],
      correct: 1,
      explanation: "Állapotváltozáskor új vDOM keletkezik, a React összeveti a régivel (diff), és csak a minimálisan szükséges változást hajtja végre a böngésző DOM-ján.",
    },
    {
      q: "Miért tilos a kézi (közvetlen) DOM-módosítás Reactben?",
      options: [
        "Mert a React nem értesül róla, és a következő rendereléskor felülírja",
        "Mert a böngésző biztonsági okból tiltja",
        "Mert túl lassú",
      ],
      correct: 0,
      explanation: "A React nem tud a kézi DOM-változtatásokról, ezért a következő rendereléskor felülírja azokat – ettől inkonzisztens lenne a felület.",
    },
    {
      q: "Mi a props?",
      options: [
        "A komponens belső, módosítható állapota",
        "A szülőtől kapott írásvédett (read-only) adat – egyirányú adatkötés, a publikus interfész",
        "Egy globális változó",
      ],
      correct: 1,
      explanation: "A props a komponens publikus interfésze: a szülőtől kapott írásvédett adat (egyirányú adatkötés), nem használható állapot tárolására.",
    },
    {
      q: "Hogyan érhető el a props osztálykomponensben?",
      options: ["paraméterként, destructuringgal", "this.props-on keresztül", "a useProps() hookkal"],
      correct: 1,
      explanation: "Osztálykomponensben a props a this.props-on keresztül érhető el; függvénykomponensben paraméterként érkezik.",
    },
    {
      q: "Mi a controlled (vezérelt) input?",
      options: [
        "Az input value-ját a React state adja, és az onChange frissíti a state-et",
        "A DOM maga tárolja az állapotot, a React csak ref-fel olvassa",
        "Egy csak olvasható mező",
      ],
      correct: 0,
      explanation: "Vezérelt mezőnél az input value-ja a React state-hez kötött, és az onChange esemény frissíti a state-et (single source of truth).",
    },
    {
      q: "Mire való a useSyncExternalStore hook?",
      options: [
        "CSS animációk vezérlésére",
        "React-en kívüli store-ok (globális store, WebSocket, böngésző API) bekötésére, tearing-mentes szinkron rendereléssel",
        "Hálózati kérések indítására",
      ],
      correct: 1,
      explanation: "A useSyncExternalStore külső (React-en kívüli) store-ok bekötésére szolgál; subscribe + getSnapshot kell hozzá, és tearing-mentes szinkron renderelést biztosít.",
    },
  ],
  9: [
    {
      q: "Mi jellemzi az osztálykomponenst?",
      options: [
        "A Component osztályból származik, van render()-e, az állapotot this.setState() merge-eli",
        "Sima függvény, ami ReactElementet ad vissza",
        "Nem lehet saját állapota",
      ],
      correct: 0,
      explanation: "Az osztálykomponens a Component leszármazottja, van render() metódusa, props a this.props-ban, state a this.state-ben; a this.setState() merge-el.",
    },
    {
      q: "Miért veszik el a `this` az osztálykomponens eseménykezelőjében?",
      options: [
        "Ez egy React-bug",
        "Mert a JS sima függvényként hívja meg (kontextus nélkül); megoldás: bind a konstruktorban vagy arrow function",
        "Mert a this mindig undefined osztályokban",
      ],
      correct: 1,
      explanation: "Az eseménykezelő referenciáját a React kontextus nélkül, sima függvényként hívja, így a this elveszik. Megoldás: bind a konstruktorban vagy arrow function.",
    },
    {
      q: "Mi a függvénykomponens?",
      options: [
        "Sima függvény, ami propsot kap és ReactElementet ad vissza; állapotot/életciklust hookokkal kezel",
        "Egy CSS osztály",
        "Csak statikus markup, állapot nélkül",
      ],
      correct: 0,
      explanation: "A függvénykomponens egy sima függvény (props → ReactElement); az állapotot és életciklust hookokkal (useState, useEffect) kezeli.",
    },
    {
      q: "Melyik osztály-életciklus metódus fut a megjelenés UTÁN (pl. első adatlekérés helye)?",
      options: ["constructor", "componentDidMount", "render"],
      correct: 1,
      explanation: "A componentDidMount a komponens megjelenése után fut le egyszer – itt szokás pl. hálózati kérést indítani.",
    },
    {
      q: "Mit jelent a useEffect(fn, []) üres függőségi tömbbel?",
      options: [
        "Minden render után lefut",
        "Csak az első render után fut le egyszer (a componentDidMount megfelelője)",
        "Sosem fut le",
      ],
      correct: 1,
      explanation: "Üres függőségi tömbbel (deps=[]) az effekt csak az első render után fut le egyszer – ez felel meg a componentDidMount-nak.",
    },
    {
      q: "Mikor fut le a useEffect cleanup (takarító) függvénye?",
      options: [
        "Kizárólag a komponens unmountolásakor",
        "Unmountkor, ÉS minden effekt-újrafutás előtt, ha a függőség megváltozott",
        "Minden render megkezdése előtt, függetlenül a deps-től",
      ],
      correct: 1,
      explanation: "A cleanup lefut unmountkor, és minden olyankor is, amikor az effekt a függőségek változása miatt újrafut (a régi feliratkozás/timer megszüntetésére).",
    },
    {
      q: "Mi vált ki remountot (és nem csak újrarenderelést)?",
      options: [
        "A props vagy a state változása",
        "A key attribútum megváltozása vagy feltételes renderelés (eltávolítás + újra hozzáadás)",
        "Minden egyes render",
      ],
      correct: 1,
      explanation: "Props/state változás csak újrarenderelést okoz (a konstruktor nem fut újra). Remount a key megváltozásakor vagy feltételes rendereléskor történik.",
    },
    {
      q: "Hogyan adható át egy komponens paraméterként?",
      options: [
        "Sehogy, a komponens nem érték",
        "Renderelt React elemként, children propként, vagy a komponens típusaként (React.ComponentType)",
        "Csak stringként, a nevével",
      ],
      correct: 1,
      explanation: "A komponens érték, ezért propként átadható: renderelt elemként, children propként, vagy a komponens típusaként (React.ComponentType).",
    },
  ],
  10: [
    {
      q: "Mit csinál a this.setState() osztálykomponensben?",
      options: [
        "Teljesen felülírja az állapotobjektumot",
        "Merge-eli az új részállapotot a meglévőbe, és aszinkron batchinget alkalmaz",
        "Azonnal, szinkron módon frissít",
      ],
      correct: 1,
      explanation: "A this.setState() összefésüli (merge) a megadott mezőket a meglévő állapottal, és a frissítéseket aszinkron módon kötegeli (batching).",
    },
    {
      q: "Miért nem tehető hook feltételes ágba (if) vagy ciklusba?",
      options: [
        "Mert lassú lenne",
        "Mert a React a hívási SORREND (index) alapján azonosítja a hookokat; feltételnél a sorrend eltolódna",
        "Mert csak a linter tiltja, technikailag működik",
      ],
      correct: 1,
      explanation: "A React a hookokat a hívási sorrendjük alapján azonosítja (nem név szerint). Ha egy hook feltételhez kötött, a sorrend eltolódik, és az állapotok összekeverednek.",
    },
    {
      q: "Hogyan építsünk megbízhatóan az előző állapotra a setState-ben?",
      options: [
        "Közvetlenül: setState(state + 1)",
        "Funkcionális formával: setState(prev => prev + 1)",
        "Az állapot közvetlen mutálásával",
      ],
      correct: 1,
      explanation: "Az aszinkron batching miatt a közvetlen érték elavult lehet; a funkcionális forma (prev => prev + 1) garantálja az aktuális előző értéket.",
    },
    {
      q: "Mire való a useReducer?",
      options: [
        "Stílusok kezelésére",
        "Komplex állapotkezelésre: (state, action) => newState reducer + dispatch(action)",
        "Hálózati kérésekre",
      ],
      correct: 1,
      explanation: "A useReducer komplex állapothoz való: egy (state, action) => newState reducert és egy kezdőállapotot vár, a komponens dispatch(action)-nel küld eseményt.",
    },
    {
      q: "Mi igaz a useRef-re?",
      options: [
        "Az értékének írása újrarenderelést vált ki",
        "Stabil identitású {current} objektum; az írása NEM vált ki újrarenderelést",
        "Kizárólag DOM-elem hivatkozására használható",
      ],
      correct: 1,
      explanation: "A useRef stabil identitású {current} objektumot ad (minden renderben ugyanaz); az írása/olvasása nem okoz újrarenderelést.",
    },
    {
      q: "Mire használjuk tipikusan a useRef-et?",
      options: [
        "DOM-elem hivatkozására (fókusz, méret) és tagváltozó-szimulációra (cache, timer ID) renderelés kiváltása nélkül",
        "Globális állapot tárolására",
        "CSS stílusok megadására",
      ],
      correct: 0,
      explanation: "A useRef két fő használata: (1) DOM-elem hivatkozás (pl. input fókusz), (2) renderelést nem kiváltó tagváltozó (cache, timer ID) tárolása.",
    },
    {
      q: "Mi a lifting state (állapot felemelése)?",
      options: [
        "Az állapot törlése",
        "A közös állapotot a legközelebbi közös szülőbe helyezzük; propsként le, callbackkel fel",
        "Globális store kötelező használata",
      ],
      correct: 1,
      explanation: "Ha több komponensnek ugyanaz az állapot kell, a legközelebbi közös szülőbe emeljük; lefelé propsként adjuk, felfelé callbackkel frissítjük.",
    },
    {
      q: "Miért nem adható át közvetlenül async függvény a useEffect első paramétereként?",
      options: [
        "Mert a böngészők nem támogatják",
        "Mert az async függvény Promise-t ad vissza, a React viszont (cleanup) függvényt vár visszatérési értékként",
        "Mert leblokkolná a renderelési szálat",
      ],
      correct: 1,
      explanation: "Az async függvény Promise-t ad vissza, amit a React tévesen cleanupként kezelne. Ezért az aszinkron kódot egy belső (IIFE) függvényben indítjuk.",
    },
    {
      q: "Mire való a 'mounted' flag minta aszinkron adatlekérésnél?",
      options: [
        "Stílusváltásra",
        "Hogy unmount után ne frissítsünk állapotot (let mounted = true; cleanupban false)",
        "A kérés gyorsítására",
      ],
      correct: 1,
      explanation: "A mounted flaggel elkerüljük, hogy a megérkező válasz egy már unmountolt komponensen hívjon állapotfrissítőt (cleanupban mounted = false).",
    },
  ],
  11: [
    {
      q: "Hány fő Android komponenstípus van, és melyek?",
      options: [
        "3: Activity, Service, View",
        "4: Activity, Service, Content Provider, Broadcast Receiver",
        "2: Activity és Fragment",
      ],
      correct: 1,
      explanation: "Négy alkalmazás-komponens van: Activity, Service, Content Provider, Broadcast Receiver – bármelyik önállóan aktiválható (akár másik appból is).",
    },
    {
      q: "Melyik komponens végez háttérben futó, UI nélküli feladatot?",
      options: ["Activity", "Service", "Content Provider"],
      correct: 1,
      explanation: "A Service hosszabb ideig háttérben futó feladatot lát el felhasználói felület nélkül (pl. letöltés); más komponens indíthatja vagy bind-olhat hozzá.",
    },
    {
      q: "Mi keletkezik a forráskódból az .apk fordítása során, és hogyan fut?",
      options: [
        "Szabványos Java bytecode (.class), amit a JVM futtat",
        "classes.dex (Dalvik bytecode), amit az ART/Dalvik VM futtat",
        "Natív .exe gépi kód",
      ],
      correct: 1,
      explanation: "A fordító Dalvik bytecode-ot állít elő a classes.dex-be (nem szabványos Java bytecode-ot), amit az Android VM (ART) futtat.",
    },
    {
      q: "Mi kell az aláíratlan apk-ból a telepíthető apk-hoz?",
      options: ["Újratömörítés", "Aláírás egy kulccsal", "Obfuszkáció"],
      correct: 1,
      explanation: "Az aláíratlan apk-t egy kulccsal aláírva kapjuk a telepíthető, terjeszthető aláírt apk-t.",
    },
    {
      q: "Mit tartalmaz az apk állomány?",
      options: [
        "META-INF/ (tanúsítvány, hash-ek), res/, AndroidManifest.xml, classes.dex, resources.arsc",
        "Csak a nyers forráskódot",
        "Kizárólag a képeket és a hangokat",
      ],
      correct: 0,
      explanation: "Az apk tömörített állomány: META-INF/ (CERT, MANIFEST.MF, hash-ek), res/, AndroidManifest.xml, classes.dex és resources.arsc.",
    },
    {
      q: "Miért érdemes obfuszkálni az Android alkalmazást?",
      options: [
        "Mert gyorsabbá teszi a futást",
        "Mert az apk visszafejthető (dex2jar, JD-Gui), így a kód önmagában nincs biztonságban",
        "Mert a Play Store kötelezővé teszi",
      ],
      correct: 1,
      explanation: "Az apk visszafejthető (dex2jar, JD-Gui), ezért a kód nincs biztonságban – emiatt ajánlott az obfuszkálás.",
    },
    {
      q: "Mi a Manifest (AndroidManifest.xml)?",
      options: [
        "Egy kép-erőforrás",
        "XML alkalmazásleíró, ami definiálja a komponenseket; a rendszer indítás és telepítés előtt ellenőrzi",
        "Az alkalmazás adatbázisa",
      ],
      correct: 1,
      explanation: "A Manifest XML alkalmazásleíró, amely definiálja a komponenseket; a rendszer komponens-indítás előtt és telepítéskor is ellenőrzi.",
    },
    {
      q: "Mit kell feltétlenül tartalmaznia a Manifestnek?",
      options: [
        "A java package-et, az engedélyeket, a min. API szintet, a használt funkciókat és a komponensek listáját",
        "A teljes forráskódot",
        "A felhasználói fiókadatokat",
      ],
      correct: 0,
      explanation: "A Manifest tartalmazza a (egyedi azonosítóként szolgáló) java package-et, a kért engedélyeket, a minimum API szintet, a használt funkciókat/könyvtárakat és a komponensek listáját.",
    },
    {
      q: "Melyik komponens regisztrálható kódból is (nem csak a Manifestben)?",
      options: ["Activity", "Broadcast Receiver (registerReceiver)", "Content Provider"],
      correct: 1,
      explanation: "A Manifestben nem szereplő Activity/Service/Content Provider nem látható a rendszernek; kivétel a Broadcast Receiver, ami kódból (registerReceiver) is regisztrálható.",
    },
  ],
  12: [
    {
      q: "Mi az Activity?",
      options: [
        "Egy háttérben futó szolgáltatás",
        "Tipikusan egy képernyő (ablakként elképzelhető), amin a felhasználó műveletet végez",
        "Egy adatbázis-tábla",
      ],
      correct: 1,
      explanation: "Az Activity tipikusan egy képernyő (ablak), amin a felhasználó valamilyen műveletet végez; egy app több, lazán csatolt Activity-ből áll.",
    },
    {
      q: "Melyik az Activity három fő állapota?",
      options: [
        "Running, Sleeping, Closed",
        "Resumed/running, Paused, Stopped",
        "Start, Pause, End",
      ],
      correct: 1,
      explanation: "A három fő állapot: Resumed/running (előtérben, focus), Paused (látszik, de másik van előrébb), Stopped (nem látható).",
    },
    {
      q: "Melyik callbackben érdemes menteni, mielőtt egy másik Activity előtérbe kerül?",
      options: ["onResume()", "onPause()", "onDestroy()"],
      correct: 1,
      explanation: "Az onPause() biztosan lefut, mielőtt egy másik Activity előrébb kerül – ide érdemes tenni a mentést (pl. DB-be).",
    },
    {
      q: "Mi a 'látható' (visible) élettartam az Activity életciklusában?",
      options: [
        "onCreate() → onDestroy()",
        "onStart() → onStop()",
        "onResume() → onPause()",
      ],
      correct: 1,
      explanation: "A látható élettartam az onStart()-tól az onStop()-ig tart; a teljes élettartam onCreate→onDestroy, az előtér onResume→onPause.",
    },
    {
      q: "Mit mentsünk az onSaveInstanceState() Bundle-jébe?",
      options: [
        "Perzisztens adatot (pl. DB tartalmát)",
        "Belső változókat és UI-elemek értékét (NEM perzisztens adatot)",
        "A teljes képernyő bitképét",
      ],
      correct: 1,
      explanation: "Az onSaveInstanceState Bundle-jébe átmeneti UI-állapot (belső változók, mezőértékek) való, NEM perzisztens adat – arra DB/SharedPreferences van.",
    },
    {
      q: "Ha A elindítja B-t, mi a helyes callback-sorrend?",
      options: [
        "A.onStop() → B.onCreate() → B.onResume()",
        "A.onPause() → B.onCreate(), B.onStart(), B.onResume() → A.onStop()",
        "B.onResume() → A.onPause() → A.onStop()",
      ],
      correct: 1,
      explanation: "A sorrend: A.onPause() → B.onCreate/onStart/onResume → A.onStop(). Ezért az A→B átadott adat mentése A.onPause()-ában történjen.",
    },
    {
      q: "Hogyan működik az Activity Back Stack?",
      options: [
        "FIFO sorként (ami először jött, először megy)",
        "LIFO veremként: az előtérben lévő a tetején; a Vissza gomb a legfelsőt veszi le",
        "Véletlen sorrendben",
      ],
      correct: 1,
      explanation: "A Back Stack LIFO verem: az előtérben lévő Activity van a tetején, új indításkor a tetejére kerül, a Vissza gomb a legfelsőt veszi le.",
    },
    {
      q: "Mi az Intent?",
      options: [
        "Egy felhasználói felületi elem",
        "Passzív adatstruktúra, ami futásidejű (késői) kötést valósít meg komponensek között",
        "Egy háttérszál",
      ],
      correct: 1,
      explanation: "Az Intent passzív adatstruktúra, ami futásidejű kötést valósít meg komponensek (Activity, Service, Broadcast Receiver) között, az Android runtime-on keresztül.",
    },
    {
      q: "Mi az implicit Intent?",
      options: [
        "Megnevezi a konkrét cél komponenst",
        "Az elvégzendő akciót (és adatot) írja le, nem a komponenst – más app funkciójához",
        "Csak a saját appon belül használható",
      ],
      correct: 1,
      explanation: "Az implicit Intent az akciót/adatot írja le (nem a komponenst); a rendszer keres hozzá komponenst (több találatnál választó dialógus, nullánál ActivityNotFoundException).",
    },
    {
      q: "Hogyan ad vissza eredményt egy hívott Activity?",
      options: [
        "return utasítással",
        "setResult(resultCode, intent) + finish(), a hívó onActivityResult()-ban dolgozza fel",
        "Egyszerű putExtra() önmagában",
      ],
      correct: 1,
      explanation: "A hívott oldal a finish() előtt setResult(resultCode, intent)-tel jelez; a hívó az onActivityResult(requestCode, resultCode, data)-ban dolgozza fel.",
    },
  ],
  13: [
    {
      q: "Miből áll egy Android app a forráskódon kívül?",
      options: [
        "Csak képekből",
        "Erőforrásokból (képek, hangok, szövegek, XML layout/menü/animáció/stílus)",
        "Csak egyetlen XML fájlból",
      ],
      correct: 1,
      explanation: "Az app forráskódból ÉS erőforrásokból áll (képek, hangok, szövegek, XML-ben definiált layout/menü/stílus); ez szétválasztja a kódot és a tartalmat.",
    },
    {
      q: "Hogyan hivatkozunk erőforrásra a Kotlin/Java kódból?",
      options: ["@típus/név", "R.típus.név (pl. R.drawable.logo)", "#név"],
      correct: 1,
      explanation: "Kódból R.típus.név formában (pl. R.layout.activity_main, R.string.hello); XML-ből @típus/név formában hivatkozunk.",
    },
    {
      q: "Mit NE tegyünk az R.java állománnyal?",
      options: [
        "Hivatkozzunk rá a kódból",
        "Kézzel módosítsuk (a rendszer generálja automatikusan)",
        "Olvassuk belőle az azonosítókat",
      ],
      correct: 1,
      explanation: "Az R.java-t a rendszer (SDK eszköz) generálja az erőforrás-azonosítókkal; kézzel SOHA nem szabad módosítani.",
    },
    {
      q: "Mi az erőforrás-minősítő (qualifier)?",
      options: [
        "Egy engedély a Manifestben",
        "A könyvtárnévhez fűzött postfix (pl. values-hu, drawable-hdpi, layout-large), ami alapján a rendszer választ",
        "Egy Kotlin osztály",
      ],
      correct: 1,
      explanation: "A minősítő a könyvtárnévhez fűzött postfix (pl. values-hu, drawable-hdpi); futásidőben ez alapján választja ki a rendszer a készülékhez illő erőforrást.",
    },
    {
      q: "Miért nem kell minden méret/sűrűség kombinációt megadni az erőforrásokhoz?",
      options: [
        "Mert a rendszer dp alapján skáláz és a sűrűség szerint átskálázza a képeket",
        "Mert a fejlesztő ezt letilthatja",
        "Mert csak egyetlen képernyőméret létezik",
      ],
      correct: 0,
      explanation: "A UI dp alapján skálázódik, a képeket a rendszer a kijelző sűrűsége szerint átskálázza, így nem kell minden kombinációt kézzel megadni.",
    },
    {
      q: "Hogyan oldható meg a lokalizáció Androidon?",
      options: [
        "Kódból, if-ekkel a nyelv alapján",
        "A könyvtár minősítőjével (pl. res/values-hu/strings.xml), az alapértelmezett a res/values/",
        "Csak külön fordítóprogrammal",
      ],
      correct: 1,
      explanation: "A nyelvet/régiót a könyvtár minősítője adja (res/values-hu/ stb.); ha nincs megfelelő, az alapértelmezett res/values/-re esik vissza a rendszer.",
    },
    {
      q: "Mi a Fragment?",
      options: [
        "Egy önálló, külön telepíthető alkalmazás",
        "A képernyő egy nagyobb részéért felelős, újrafelhasználható objektum, mindig Activity-hez csatoltan",
        "Egy adatbázis-tábla",
      ],
      correct: 1,
      explanation: "A Fragment a képernyő egy nagyobb részéért felelős, újrafelhasználható objektum, amely mindig egy Activity-hez csatoltan jelenik meg.",
    },
    {
      q: "Melyik fragment-callbackben adjuk vissza a megjelenítendő View-hierarchiát?",
      options: ["onAttach()", "onCreateView()", "onDetach()"],
      correct: 1,
      explanation: "Az onCreateView()-ban kell visszaadni (inflate-elni) a fragment nézet-hierarchiáját; a binding csak onCreateView és onDestroyView között érvényes.",
    },
    {
      q: "Mi a dinamikus fragment-csatolás eszköze?",
      options: [
        "A layoutba égetett <fragment> tag",
        "A FragmentManager + FragmentTransaction (add/remove/replace, addToBackStack, commit)",
        "Egy implicit Intent",
      ],
      correct: 1,
      explanation: "Dinamikus csatolásnál a FragmentManager-rel indított FragmentTransaction (add/remove/replace, addToBackStack, commit) tölti be futásidőben a fragmentet egy ViewGroupba.",
    },
    {
      q: "Hogyan kommunikálnak a fragmentek egymással?",
      options: [
        "Közvetlenül, egymás metódusait hívva",
        "Közvetve: az Activity közvetít, tipikusan egy interfészen keresztül",
        "Kizárólag globális változókon át",
      ],
      correct: 1,
      explanation: "A fragmentek egységbe zártak, ezért nem közvetlenül kommunikálnak: az Activity közvetít (tipikusan interfészen át), így nem függnek egymástól.",
    },
  ],
  14: [
    {
      q: "Melyik a kulcs-érték alapú, alaptípusokat tároló megoldás?",
      options: ["SQLite adatbázis", "SharedPreferences / DataStore", "Content Provider"],
      correct: 1,
      explanation: "A SharedPreferences (és modern utódja, a DataStore) alaptípusokat tárol kulcs-érték párként – beállításokhoz, UI-állapothoz, auto-loginhoz.",
    },
    {
      q: "Mire ideális a SharedPreferences?",
      options: [
        "Nagy bináris fájlok tárolására",
        "Beállításokra, UI-állapotra, auto-loginra (alaptípusok kulcs-érték párként)",
        "Komplex relációs lekérdezésekre",
      ],
      correct: 1,
      explanation: "A SharedPreferences kis méretű alaptípusokhoz (int, String, boolean...) ideális: beállítások, UI-állapot, automatikus bejelentkezés.",
    },
    {
      q: "Mi az ORM alapelve?",
      options: [
        "Osztálynév → tábla, objektum → tábla egy sora, mező → oszlop",
        "Minden adat JSON-ként tárolódik",
        "Csak gyorsítótárazás a memóriában",
      ],
      correct: 0,
      explanation: "Az ORM (Object-Relation Mapping) objektumokat tárol relációs DB-ben: osztálynév → tábla, objektum → sor, mező → oszlop.",
    },
    {
      q: "Mi a Room az Androidon?",
      options: [
        "Egy teljesen új adatbázismotor az SQLite helyett",
        "Absztrakciós réteg az SQLite felett (@Entity, @Dao, @Database)",
        "Egy hálózati kommunikációs könyvtár",
      ],
      correct: 1,
      explanation: "A Room a Google ORM-je: absztrakciós réteg az SQLite felett, három fő elemmel: @Entity (tábla), @Dao (műveletek), @Database (RoomDatabase).",
    },
    {
      q: "Mi jellemzi az internal storage-ot?",
      options: [
        "Bármely app és a felhasználó is hozzáfér",
        "Privát: kizárólag az adott app éri el (openFileOutput/openFileInput)",
        "Mindig az SD-kártyán van",
      ],
      correct: 1,
      explanation: "Az internal storage privát: csak az adott app éri el (se a user, se más app); írás openFileOutput, olvasás openFileInput.",
    },
    {
      q: "Mire kell figyelni az external storage használatánál?",
      options: [
        "Semmire, mindig elérhető",
        "Bármikor elérhetetlenné válhat → Environment.getExternalStorageState() ellenőrzés; WRITE_EXTERNAL_STORAGE engedély kell",
        "Hogy mindig privát marad",
      ],
      correct: 1,
      explanation: "Az external storage nyilvános és bármikor elérhetetlenné válhat, ezért használat előtt ellenőrizni kell az állapotát (getExternalStorageState), és engedély (WRITE_EXTERNAL_STORAGE) kell hozzá.",
    },
    {
      q: "Mi a korszerű megoldás listák megjelenítésére Androidon?",
      options: ["ListView", "RecyclerView", "Egyszerű TextView"],
      correct: 1,
      explanation: "A korszerű listamegjelenítő a RecyclerView (a régi ListView/GridView helyett).",
    },
    {
      q: "Mi a RecyclerView fő előnye?",
      options: [
        "Az összes listaelemet előre létrehozza a memóriában",
        "Kikényszeríti a ViewHolder mintát és újrahasznosítja a kigörgetett sorok view-jait (nincs folyamatos findViewById)",
        "A teljes listát külön szálon rendereli",
      ],
      correct: 1,
      explanation: "A RecyclerView a kötelező ViewHolder mintával és a sornézetek újrahasznosításával gyors, sima görgetést ad – nincs folyamatos findViewById.",
    },
    {
      q: "Melyik Adapter-metódus fújja fel (inflate) a saját sor-layoutot?",
      options: ["onBindViewHolder()", "onCreateViewHolder()", "getItemCount()"],
      correct: 1,
      explanation: "Az onCreateViewHolder() fújja fel a saját sor-layoutot és csomagolja ViewHolderbe; az onBindViewHolder() köti be a pozícióhoz tartozó adatot.",
    },
    {
      q: "Mivel érünk el egy Content Providert?",
      options: [
        "Közvetlenül a háttéradatbázissal",
        "A ContentResolverrel (query → Cursor, insert → URI), a CONTENT_URI alapján",
        "Egy explicit Intenttel",
      ],
      correct: 1,
      explanation: "A Content Providert a ContentResolver éri el (query → Cursor, insert → URI, update/delete → sorok száma); az azonosító a CONTENT_URI (content://authority/path).",
    },
  ],
  15: [
    {
      q: "Melyik a rövid távú (kb. <4 cm), NDEF formátumú kommunikáció?",
      options: ["HTTP", "NFC", "UDP"],
      correct: 1,
      explanation: "Az NFC rövidtávú (kb. <4 cm) vezeték nélküli kommunikáció NDEF formátummal (tag↔telefon vagy telefon↔telefon).",
    },
    {
      q: "Melyik internet-alapú protokoll megbízható és kapcsolat-orientált?",
      options: ["UDP", "TCP (java.net.Socket)", "NFC"],
      correct: 1,
      explanation: "A TCP kapcsolat-orientált és megbízható (java.net.Socket/ServerSocket); az UDP gyors, de nem garantálja a kézbesítést.",
    },
    {
      q: "Mi igaz az UDP-re a TCP-vel szemben?",
      options: [
        "Megbízható és sorrendhelyes",
        "Gyors, de nem garantálja a csomag megérkezését (kapcsolatmentes)",
        "Mindig titkosított",
      ],
      correct: 1,
      explanation: "Az UDP kapcsolatmentes és gyors, de nem garantálja a kézbesítést/sorrendet – ott jó, ahol a csomagvesztés nem kritikus (valós idejű média, játék).",
    },
    {
      q: "Mire kell figyelni a HTTP kommunikáció megvalósításakor?",
      options: [
        "Semmi különösre",
        "INTERNET engedély; a hívás külön szálon (ANR ellen); válaszkód-ellenőrzés; timeout; hibakezelés",
        "Csak GET kérés használható",
      ],
      correct: 1,
      explanation: "HTTP-nél kell az INTERNET engedély, a hívást külön szálon kell végezni (~5 mp után ANR), ellenőrizni a válaszkódot, timeoutot állítani és hibát kezelni.",
    },
    {
      q: "Hogyan frissíthető a UI a háttérszálon megérkezett eredmény alapján?",
      options: [
        "Közvetlenül a háttérszálról",
        "runOnUiThread / View.post / Handler / Retrofit Callback / Coroutine (Dispatchers.Main) segítségével",
        "Sehogy, a UI nem frissíthető",
      ],
      correct: 1,
      explanation: "A UI-t csak a fő szálból szabad módosítani, ezért vissza kell térni oda: runOnUiThread, View.post, Handler, Retrofit Callback vagy Coroutine (Dispatchers.Main).",
    },
    {
      q: "Melyik tipikus adatformátum és a hozzá tartozó feldolgozó?",
      options: [
        "JSON (JSONObject/JSONArray) és XML (SAX/DOM)",
        ".exe és .dll",
        ".apk és .dex",
      ],
      correct: 0,
      explanation: "Tipikus formátumok: JSON (JSONObject/JSONArray, GSON/Moshi), XML (SAX eseményvezérelt / DOM fába olvas), CSV.",
    },
    {
      q: "Mi a Retrofit?",
      options: [
        "Egy felhasználói felületi keretrendszer",
        "OkHttp-re épülő REST library; a kéréseket annotációkkal írjuk le, a JSON↔objektum konverzió automatikus",
        "Egy beágyazott adatbázis",
      ],
      correct: 1,
      explanation: "A Retrofit OkHttp-re épülő REST library: a HTTP kéréseket annotációkkal írjuk le, a JSON↔objektum konverziót automatikusan végzi (call.enqueue Callback).",
    },
    {
      q: "Mikortól kell a veszélyes engedélyeket futásidőben kérni?",
      options: [
        "Mindig is így volt",
        "Android 6 (API 23) óta",
        "Csak Android 10 óta",
      ],
      correct: 1,
      explanation: "Android 6 (API 23) óta a veszélyes engedélyeket futásidőben kell elkérni; korábban telepítéskor mind, egyszerre kérte a rendszer.",
    },
    {
      q: "Melyik engedélyt adja meg a rendszer automatikusan (a Manifest alapján)?",
      options: [
        "A veszélyes engedélyt (pl. CAMERA)",
        "A normál engedélyt (pl. INTERNET)",
        "Egyiket sem, mindet kódból kell kérni",
      ],
      correct: 1,
      explanation: "A normál engedélyeket (pl. INTERNET) a rendszer automatikusan megadja a Manifest alapján; a veszélyeseket futásidőben, kódból kell kérni.",
    },
    {
      q: "Mi a veszélyes engedély kérésének helyes menete?",
      options: [
        "requestPermissions → checkSelfPermission",
        "checkSelfPermission → (opc. rationale) → requestPermissions → onRequestPermissionsResult",
        "Elég csak az onRequestPermissionsResult-ot implementálni",
      ],
      correct: 1,
      explanation: "A menet: checkSelfPermission (megvan-e) → opcionálisan shouldShowRequestPermissionRationale → requestPermissions → az eredményt az onRequestPermissionsResult kezeli.",
    },
  ],
  16: [
    {
      q: "Mi a Jetpack Compose?",
      options: [
        "XML-alapú felépítésű UI-rendszer",
        "Modern, deklaratív UI-toolkit: Kotlin kóddal (@Composable) írjuk le a UI-t",
        "Egy beágyazott adatbázis",
      ],
      correct: 1,
      explanation: "A Jetpack Compose modern, deklaratív UI-toolkit: a fejlesztő Kotlin kóddal (@Composable függvényekkel) írja le a UI-t, a motor generálja a felületet.",
    },
    {
      q: "Mi a Compose előnye a klasszikus View keretrendszerhez képest?",
      options: [
        "Több XML-t igényel",
        "Kevesebb kód, nincs XML layout, jobb újrafelhasználhatóság, egyszerűbb állapot szerinti frissítés",
        "Csak Java nyelven használható",
      ],
      correct: 1,
      explanation: "A Compose előnye: kevesebb kód, nincs XML layout, nincs UI-widget építés, jobb újrafelhasználhatóság, és átjárható a régi View toolkit-tel.",
    },
    {
      q: "Melyik a három fő Compose layout?",
      options: [
        "Column, Row, Box",
        "Linear, Relative, Constraint",
        "Grid, Table, List",
      ],
      correct: 0,
      explanation: "A három fő Compose layout: Column (egymás alatt), Row (egymás mellett), Box (egymásra rétegezve).",
    },
    {
      q: "Mi a deklaratív paradigma lényege Compose-ban?",
      options: [
        "A UI-elemeket ID alapján, objektumként módosítjuk",
        "A UI-elemek nem érhetők el objektumként; ugyanazt a Composable-t hívjuk meg új argumentumokkal",
        "Közvetlenül a böngésző DOM-ját írjuk",
      ],
      correct: 1,
      explanation: "A Compose deklaratív: a UI-elemek nem érhetők el objektumként (nincs ID-referencia); a frissítés úgy történik, hogy a Composable-t új argumentumokkal hívjuk meg.",
    },
    {
      q: "Mi a Recomposition?",
      options: [
        "Az alkalmazás teljes újraindítása",
        "A kompozíció újrafuttatása állapotváltozáskor; csak az érintett (az állapotot használó) Composable-eket frissíti",
        "A memória felszabadítása",
      ],
      correct: 1,
      explanation: "A Recomposition a Composable-ek újrafuttatása állapotváltozáskor; intelligens, mert csak azokat futtatja újra, amelyek a megváltozott állapotot használják.",
    },
    {
      q: "Mi igaz a Compose 5 szabálya szerint?",
      options: [
        "A Composable-ek csak szigorúan szekvenciálisan futhatnak",
        "Tetszőleges sorrendben/párhuzamosan futhatnak, a recomposition kihagyható és megszakítható (optimista)",
        "Mindig a teljes UI-fa újrarajzolódik",
      ],
      correct: 1,
      explanation: "Az 5 szabály szerint a Composable-ek tetszőleges sorrendben/párhuzamosan futhatnak, a recomposition kihagyja a változatlanokat és megszakítható – ezért legyenek idempotensek, mellékhatás-mentesek.",
    },
    {
      q: "Mi a különbség a remember és a rememberSaveable között?",
      options: [
        "Nincs különbség",
        "A rememberSaveable a recompositionön túl a konfiguráció-változást (pl. képernyő-elforgatás) is túléli",
        "A remember teszi perzisztenssé az adatot a lemezen",
      ],
      correct: 1,
      explanation: "Mindkettő megőrzi az állapotot a recompositionök között; a rememberSaveable ezen felül a konfiguráció-változást (pl. forgatás) is túléli.",
    },
    {
      q: "Mi a State Hoisting?",
      options: [
        "Az állapot végleges törlése",
        "Az állapot kiemelése value + onValueChange párral, így a Composable stateless lesz (single source of truth)",
        "Egy globális változó bevezetése",
      ],
      correct: 1,
      explanation: "A State Hoisting az állapotot value (érték) + onValueChange (esemény) párral emeli ki a hívóba/ViewModelbe, így a Composable stateless lesz – single source of truth.",
    },
    {
      q: "Melyik side effect indít coroutine-t a kompozícióhoz kötve?",
      options: ["SideEffect", "LaunchedEffect", "DisposableEffect"],
      correct: 1,
      explanation: "A LaunchedEffect coroutine scope-ban futtat (a kulcs változására újra); a SideEffect minden recomposition után fut, a DisposableEffect onDispose-zal takarít.",
    },
    {
      q: "Mik az MVVM elemei Compose-ban?",
      options: [
        "ViewModel (logika), View (@Composable), Model (entitások/repository)",
        "Model, View, Controller",
        "Kizárólag a ViewModel",
      ],
      correct: 0,
      explanation: "MVVM Compose-ban: ViewModel (üzleti logika, állapot), View (@Composable, ami megfigyeli az állapotot), Model (entitások/repository).",
    },
    {
      q: "Miért előnyösebb a Coroutine a klasszikus Thread-nél háttérmunkára?",
      options: [
        "Mert drágább, de pontosabb",
        "Mert olcsó, és aszinkron, de szekvenciálisan leírt kódot ad (viewModelScope, Dispatchers.IO/Main)",
        "Mert mindig egyetlen szálon fut",
      ],
      correct: 1,
      explanation: "A Coroutine olcsó (a szálak számának sokszorosa indítható), aszinkron, de szekvenciálisan írható; scope (viewModelScope) és Dispatcher (IO/Default/Main) vezérli.",
    },
    {
      q: "Mire való a LazyColumn / LazyRow (lazy loading)?",
      options: [
        "Az összes listaelem előtöltésére",
        "Csak a látható elemek renderelésére (hatékony nagy listáknál)",
        "Hálózati kérések indítására",
      ],
      correct: 1,
      explanation: "A Lazy komponensek (LazyColumn/Row/Grid) csak a képernyőn látható elemeket renderelik, így nagy listáknál is hatékonyak.",
    },
    {
      q: "Mire való a Flow, és miben más, mint a suspend függvény?",
      options: [
        "A Flow egyetlen értéket ad vissza, mint a suspend függvény",
        "A Flow egymás után több értéket bocsát ki (aszinkron adatfolyam: producer → collect), míg a suspend függvény egyet ad",
        "A Flow egy új szálat indít",
      ],
      correct: 1,
      explanation: "A Flow aszinkron adatfolyam, ami egymás után több értéket emittál (producer → opc. intermediate → consumer .collect); a suspend függvény ezzel szemben egyetlen értéket ad vissza.",
    },
  ],
};
