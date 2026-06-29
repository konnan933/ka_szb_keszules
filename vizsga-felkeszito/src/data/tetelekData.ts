export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface OralQuestion {
  question: string;
  answer: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface Topic {
  id: number;
  title: string;
  summary: string[];
  quiz: Quiz;
  oralQuestions: OralQuestion[];
  flashcards: Flashcard[];
}

export const TETELEK_DATA: Topic[] = [
  {
    id: 1,
    title: "1. Weboldal, kiszolgálás, weboldal vs. webalkalmazás, fejlesztői környezet",
    summary: [
      "A weboldal egy böngészőben megjeleníthető dokumentum (HTML, CSS, JS, képek). Betöltése több HTTP kérésből áll.",
      "Klasszikus 3-rétegű architektúra: Kliens (böngésző) -> Web/App szerver -> Adatbázis.",
      "A webszerver szoftver egy porton figyeli a kéréseket, feloldja az URL-eket, HTTP kéréseket kezel, és statikus vagy dinamikus tartalmat szolgáltat (pull model).",
      "Statikus kiszolgálás: Fájlokat ad vissza az URL -> fájlrendszer megfeleltetés alapján (egyszerű, gyors, olcsó).",
      "Dinamikus kiszolgálás: A tartalmat a kérés paraméterei és az alkalmazás állapota (memória, DB) alapján generálja futásidőben.",
      "Weboldal (dokumentum-szemléletű, tartalommegjelenítés) vs. Webalkalmazás (alkalmazás-szemléletű, állapotkezelés, API-kon keresztüli szerverkommunikáció, pl. Single Page Application (SPA)).",
      "Egy SPA statikus kiszolgálást használ (HTML+JS letöltés), de futásidőben API-ról (JSON) dinamikusan tölti be az adatokat.",
      "Fejlesztői környezet specialitásai: Állapotmentes HTTP protokoll (cookie, session, localStorage szükséges), böngésző-támogatás korlátai (caniuse.com), biztonsági fókusz (HTTPS, XSS, XSRF védelem)."
    ],
    quiz: {
      question: "Miért mondjuk, hogy egy SPA (Single Page Application) statikus kiszolgálást használ, ha közben dinamikus tartalommal dolgozik?",
      options: [
        "Mert az SPA nem képes módosítani a böngésző DOM-ját, így a tartalma statikus marad.",
        "Mert a szerverről csak statikus eszközök (HTML, JS, CSS) töltődnek le előre, és a kliensoldali JS kód futás közben kér adatokat API-ról.",
        "Mert az SPA alkalmazások nem használnak HTTP protokollt a szerverrel való kommunikációhoz."
      ],
      correctIndex: 1,
      explanation: "Az SPA lényege, hogy a webszerverről statikus fájlként töltődnek le a HTML, CSS és JavaScript állományok. Miután a JS betöltődött a böngészőben, ő maga végzi a dinamikus adatok lekérését egy API-n keresztül (pl. JSON formátumban) és módosítja a DOM-ot."
    },
    oralQuestions: [
      {
        question: "Mit jelent az, hogy a HTTP protokoll állapotmentes, és hogyan hidalható ez át a gyakorlatban?",
        answer: "A HTTP állapotmentes (stateless), azaz minden kérés független, a szerver alapból nem tudja, hogy a kérés ugyanattól a klienstől jött-e, mint az előző. Áthidalása: (1) Sütik (Cookie-k): a szerver állítja be, a böngésző minden kérésben visszaküldi; (2) Session ID: a szerver memóriájában vagy DB-jében lévő állapothoz kapcsolódó azonosító; (3) Web Storage: localStorage / sessionStorage a kliensen; (4) Authorization fejléc: tokenek (pl. JWT) küldése minden kéréssel."
      },
      {
        question: "Mi a különbség a web szerver hardver és szoftver oldala között?",
        answer: "Hardver oldalról a web szerver egy internetre kapcsolt számítógép, ami a statikus fájlokat (HTML, képek, CSS, JS) tárolja és kiszolgálja. Szoftver oldalról egy olyan alkalmazás (pl. IIS, Nginx, Apache), ami egy megadott porton (HTTP: 80, HTTPS: 443) figyeli a bejövő kéréseket, feloldja az URL-eket, megérti a HTTP protokollt, és előállítja a választ (statikus vagy dinamikus módon)."
      }
    ],
    flashcards: [
      {
        question: "Web szerver szoftver fő feladatai",
        answer: "Portfigyelés, URL-feloldás, HTTP protokoll értelmezése, statikus/dinamikus kiszolgálás."
      },
      {
        question: "Dinamikus kiszolgálás lényege",
        answer: "A válasz tartalmát a kérés paraméterei és a szerver állapota (pl. adatbázis) alapján futásidőben generálja le."
      },
      {
        question: "caniuse.com funkciója",
        answer: "Annak ellenőrzése, hogy az egyes HTML, CSS és JS funkciókat mely böngészőverziók támogatják."
      }
    ]
  },
  {
    id: 2,
    title: "2. HTML, űrlapkezelés, CSS szelektorok",
    summary: [
      "HTML (Hypertext Markup Language): jelölőnyelv a weboldalak struktúrájának leírására. A HTML Living Standard a szabvány.",
      "Kötelező váz: <!DOCTYPE html>, <html>, <head> (meta, title, link css), <body> (tartalom, script tags).",
      "Szemantikus elemek (<header>, <nav>, <aside>, <section>, <article>, <footer>): Jelentéssel bírnak, javítják a SEO-t és akadálymentesítést.",
      "Blokk (mindig új sor, pl. <div>, <p>, listák) vs. Inline (sorban folytatódik, pl. <span>, <a>, <strong>) elemek.",
      "Űrlapkezelés: <form> element (action, method GET/POST), <label> (for='id' összekötés a fókuszhoz), különböző <input> típusok (text, radio, checkbox, date, file).",
      "Kliensoldali validáció: required, pattern (regex), min/max attribútumok, valamint a JS Validation API (willValidate, validity, validationMessage, setCustomValidity).",
      "CSS (Cascading Style Sheets): elemek stílusát határozza meg. Selector + deklarációs blokk.",
      "Szelektor típusok: Egyszerű (tag, .class, #id), Attribútum (pl. a[href$='.hu']), Kombinátorok (> közvetlen gyerek, szóköz összes leszármazott, ~ összes testvér, + közvetlen szomszéd), Pszeudo-osztályok (:hover, :first-child), Pszeudo-elemek (::before, ::after content-tel).",
      "Specifikusság (erősség): Inline stílus (1000) > ID (100) > Class/Attribútum/Pszeudo-osztály (10) > Elem/Pszeudo-elem (1). Azonos erősségnél a későbbi felülírja, mindent felülbírál az !important."
    ],
    quiz: {
      question: "Melyik CSS szabály szelektorának van a legnagyobb specifikussága (legerősebb)?",
      options: [
        "body #wrapper .content p.intro",
        "div.container div.content p",
        "#wrapper p"
      ],
      correctIndex: 0,
      explanation: "Számoljuk ki a specifikusságot! Az első: 1 ID (#wrapper) = 100, 2 Class (.content, .intro) = 20, 2 Elem (body, p) = 2. Összesen: 122. A második: 2 Class = 20, 3 Elem = 3. Összesen: 23. A harmadik: 1 ID = 100, 1 Elem = 1. Összesen: 101. Tehát az első (122) a legerősebb."
    },
    oralQuestions: [
      {
        question: "Miért fontos a <label> elem használata és hogyan köthető össze egy beviteli mezővel?",
        answer: "A <label> elem összeköti a szöveges feliratot a beviteli mezővel. Fontos: (1) Akadálymentesítés: a képernyőolvasók felolvassák a mező funkcióját; (2) UX: a labelre kattintva is a beviteli mezőbe kerül a fókusz (különösen hasznos kis radio/checkbox gomboknál). Összekötés: (A) Explicit módon: a label 'for' attribútumának értéke megegyezik a mező 'id' attribútumával; (B) Implicit módon: az input elemet beágyazzuk a label elemen belülre."
      },
      {
        question: "Hogyan működik a HTML5 Validation API JavaScriptből?",
        answer: "A böngésző beépített validációs állapotokat tárol az elemeken. JS-ből elérhető a 'willValidate' (validálható-e a mező), a 'checkValidity()' (igazat ad, ha valid), és a 'validity' tulajdonság, ami egy ValidityState objektumot ad vissza (pl. valueMissing, patternMismatch, customError logikai mezőkkel). A 'validationMessage' tartalmazza a hibaüzenetet, a 'setCustomValidity(msg)' függvénnyel pedig egyéni hibaüzenetet állíthatunk be, ami érvénytelennek jelöli a mezőt mindaddig, amíg üres stringgel le nem tisztázzuk."
      }
    ],
    flashcards: [
      {
        question: "Szemantikus HTML elemek előnyei",
        answer: "SEO (keresőoptimalizálás), akadálymentesítés (akadálymentes felolvasás), és jobb kód-olvashatóság."
      },
      {
        question: "Blokk vs Inline elem definíció",
        answer: "A blokk elem mindig új sorban kezdődik és kitölti a szélességet (pl. div, p). Az inline elem soron belül marad és csak a szükséges helyet foglalja (pl. span, a)."
      },
      {
        question: "CSS specifikussági szintek",
        answer: "Inline style (1000) > ID (100) > Class/Attr/Pseudo-class (10) > Elem/Pseudo-elem (1)."
      }
    ]
  },
  {
    id: 3,
    title: "3. Böngészőben futtatott JavaScript, típusok, konverzió, függvény vs. objektum",
    summary: [
      "JavaScript: Dinamikusan és gyengén típusos szkriptnyelv. A JS motor sorról sorra értelmezi és futtatja, nincs előzetes fordítás, hiba esetén leáll.",
      "Kliensoldali JS feladatai: DOM manipuláció, eseménykezelés, aszinkron kommunikáció (fetch/JSON), kliensoldali tárolás (localStorage, IndexedDB).",
      "Környezeti különbség: A böngésző biztosítja a Browser API-kat (window, document, DOM, navigator). Node.js-ben ezek nincsenek, helyettük fájlrendszer, hálózati szerver API-k vannak. A nyelvmag (ECMAScript) azonos.",
      "Primitív típusok: number, bigint, string, boolean, undefined, null (typeof null === 'object' egy ismert bug), symbol.",
      "Falsy értékek (minden más truthy): false, 0, NaN, '' (üres string), null, undefined.",
      "Konverzió: A '+' operátornál ha az egyik operandus string, stringgé konvertál és összefűz (balról jobbra kiértékelve). Szigorú egyenlőség (===) típust is ellenőrzi, a laza (==) implicit konverziót végez.",
      "Függvények vs. Objektumok: Az objektum kulcs-érték párok tárolója. A függvény végrehajtható kód, de a JS-ben first-class citizen (változóba tehető, paraméterként átadható, visszatérési értékként visszaadható). typeof fv === 'function'."
    ],
    quiz: {
      question: "Mi lesz a kifejezés értéke a JavaScriptben: `2020 + 1 + 'január'`?",
      options: [
        "'20201január'",
        "'2021január'",
        "NaN"
      ],
      correctIndex: 1,
      explanation: "A kiértékelés balról jobbra történik. Először a `2020 + 1` hajtódik végre (mindkettő number), aminek eredménye a `2021` szám. Ezután ehhez adódik hozzá a `'január'` string. Mivel az egyik string, a szám is stringgé alakul, és összefűződnek: `'2021január'`."
    },
    oralQuestions: [
      {
        question: "Miért tér vissza a `typeof null` az 'object' értékkel a JavaScriptben?",
        answer: "Ez a JavaScript nyelv egyik legelső verziójából származó tervezési hiba (bug). A korai JS motorokban az értékeket típuscímkékkel és értékbitekkel tárolták. Az objektumok típuscímkéje 000 volt, és a null mutató értéke is csupa nullát tartalmazott, így a typeof vizsgálat tévesen objektumnak észlelte. Azért nem javítják ki, mert túl sok meglévő weboldalt törne össze (visszafelé kompatibilitás)."
      },
      {
        question: "Mit jelent az, hogy a függvény 'first-class citizen' a JavaScriptben?",
        answer: "Azt jelenti, hogy a függvény teljes értékű típus, pontosan úgy kezelhető, mint bármilyen más érték (pl. egy szám vagy string). Ez lehetővé teszi, hogy: (1) Változóhoz rendeljük (let f = function(){}); (2) Másik függvénynek paraméterként adjuk át (callback); (3) Függvényből visszatérési értékként adjuk vissza (ez a closure-ök alapja)."
      }
    ],
    flashcards: [
      {
        question: "Falsy értékek listája",
        answer: "false, 0, NaN, '' (üres string), null, undefined."
      },
      {
        question: "== vs === különbség",
        answer: "A == laza egyenlőség, vizsgálat előtt típuskonverziót végez. A === szigorú egyenlőség, konverzió nélkül hasonlítja az értéket és a típust."
      },
      {
        question: "Böngésző vs Node.js környezet",
        answer: "ECMAScript mag megegyezik. A böngészőben van window/document/DOM API; Node.js-ben nincsenek, de van fájlrendszer (fs) és hálózati modul."
      }
    ]
  },
  {
    id: 4,
    title: "4. Prototípus alapú öröklés, egyszálúság, eseményvezéreltség, Promise",
    summary: [
      "Prototípus alapú öröklés: Nincsenek valódi osztályok a háttérben. Minden objektumnak van egy prototípusa (egy másik objektum vagy null).",
      "Property olvasás: Ha az objektumban nem létezik, a prototípus-láncon felfelé keresi. Írás: Mindig a konkrét objektumon jön létre (a prototípust nem módosítja).",
      "A prototípus elérése: Object.getPrototypeOf(obj) vagy __proto__; beállítása: Object.setPrototypeOf().",
      "Konstruktor függvény prototype property-je: Nem azonos a __proto__-val! A new operátorral létrehozott példány prototípusa (__proto__) a konstruktor prototype objektuma lesz.",
      "ES6 class: Szintaktikai cukor a prototípus-lánc felett (extends, super(), instanceof). Az osztályok nem hoistolódnak (nem hívhatók deklaráció előtt).",
      "Egyszálúság: A JS egyszálú a böngészőben, egyszerre egy kód fut. A hosszú blokkoló műveletek lefagyasztják a UI-t, ezért aszinkron végrehajtás kell.",
      "Eseményvezéreltség & Event Loop: Eseménykezelők (callbackek) regisztrációja. A böngésző a callbackeket egy sorba teszi, az Event Loop pedig a hívási verem kiürülése után sorban végrehajtja őket. A callbackek nem szakíthatók meg (nincs versenyhelyzet).",
      "Promise: Jövőbeli érték reprezentációja. Állapotai: pending -> fulfilled (sikeres) VAGY rejected (hiba). Láncolható (.then, .catch, .finally).",
      "Promise kompozíció: Promise.all (összes kell), Promise.allSettled (összes státusza), Promise.race (első kész), Promise.any (első sikeres).",
      "async/await: Szintaktikai cukor a Promise-okhoz, szinkron kinézetű aszinkron kódot ad. Fetch API Promise-szal tér vissza.",
      "Closure (lezárás): A belső függvény megőrzi a kapcsolatot a külső (befoglaló) függvény változóival annak lefutása után is.",
      "this: Dinamikus, arra mutat, amin a függvényt hívták. Az arrow function-nek nincs saját this-e, a lexikális környezete this-ét örökli."
    ],
    quiz: {
      question: "Hogyan kezeli a 'this' kulcsszót az arrow function (nyíl függvény) a JavaScriptben?",
      options: [
        "Dinamikusan határozza meg a hívó kontextus alapján, mint a sima függvények.",
        "Mindig a globális 'window' objektumhoz köti a this értékét.",
        "Nincs saját 'this'-e; a létrehozásakor érvényes befoglaló (lexikális) környezet 'this' értékét örökli meg."
      ],
      correctIndex: 2,
      explanation: "A nyíl függvénynek (arrow function) nincs saját `this` kontextusa. Létrehozásakor a külső (befoglaló) kontextus `this` értékét veszi át és tartja meg véglegesen. Ezért rendkívül hasznos callbackekben, ahol a hívó kontextus megváltozna."
    },
    oralQuestions: [
      {
        question: "Mi a különbség a konstruktor függvény 'prototype' mezője és a példány '__proto__' mezője között?",
        answer: "A 'prototype' a konstruktor függvény egy tulajdonsága. Ez határozza meg, hogy a 'new' kulcsszóval létrehozott példányok milyen prototípus objektumot kapnak meg. A '__proto__' (vagy hivatalosan Object.getPrototypeOf(obj)) a konkrét példányon lévő belső hivatkozás, ami a saját prototípus objektumára mutat. Tehát: 'new User().__proto__ === User.prototype' igaz."
      },
      {
        question: "Hogyan működik a JavaScript Event Loop-ja aszinkron kód futtatásakor?",
        answer: "A JavaScript motor egyszálú, van egy hívási verme (call stack) és egy callback sora (task queue). A szinkron kódok azonnal a stackbe kerülnek és lefutnak. Az aszinkron műveletek (pl. setTimeout, fetch) a háttérben (böngészőben) futnak, és ha befejeződtek, a hozzájuk tartozó callback bekerül a callback sorba. Az Event Loop folyamatosan figyeli a stacket: ha a stack teljesen kiürült, kiveszi a callback sor első elemét, berakja a stackbe, és lefuttatja. Amíg a stackben kód fut, az Event Loop vár, így a callbackek nem szakíthatják meg egymást."
      }
    ],
    flashcards: [
      {
        question: "Promise állapotok",
        answer: "pending (függő), fulfilled (sikeresen teljesült, értékkel), rejected (hibával meghiúsult)."
      },
      {
        question: "Promise.all vs Promise.allSettled",
        answer: "Promise.all megvárja az összeset, de ha akár egy is hibázik, azonnal rejectel. A allSettled mindet megvárja, és tömbben adja vissza az összes státuszát és eredményét."
      },
      {
        question: "Closure (lezárás) definíciója",
        answer: "Olyan függvény, ami 'emlékszik' a létrehozáskori környezetére (lexikális változóira) még a külső függvény lefutása után is."
      }
    ]
  },
  {
    id: 5,
    title: "5. JavaScript vs. TypeScript, fejlesztési folyamat, típuskompatibilitás, unió/metszet típusok",
    summary: [
      "TS a JS szuperszetje: Minden érvényes JS kód egyben érvényes TS is. Statikus és erős típusrendszert tesz a JS-re a karbantarthatóságért.",
      "Fő eltérések: TS-ben a hibák fordítási időben derülnek ki (tsc), JS-ben futásidőben. TS-ben van kódkiegészítés (IntelliSense) és gazdag OOP.",
      "Fejlesztési folyamat: TS forrás (.ts) -> tsc transpiler (source-to-source fordító) -> böngészőben futtatható tiszta JS.",
      "Típuseltörlés (Type erasure): A generált JS kód nem tartalmaz típusinformációt, a típusok csak fordításidőben léteznek.",
      "Külső könyvtárak integrációja: Sima JS könyvtárakhoz típusdeklarációs (.d.ts) fájlokat (pl. @types csomagok) használunk a típusbiztonság megtartására.",
      "Típuskompatibilitás: Strukturális típusosság (structural typing / duck-typing) jellemzi. Nem a típus neve számít, hanem a benne lévő publikus tagok halmaza (struktúrája). Ha A objektum struktúrája tartalmazza legalább a B által elvárt tagokat, akkor A kompatibilis B-vel.",
      "Unió típus (|): Az érték vagy az egyik, vagy a másik típusú lehet (pl. number | string). Használatához típus-szűkítés (type narrowing) kell.",
      "Metszet típus (&): Kombinálja a típusokat (bővítés), a létrejött típus az összes kiinduló típus tagjait egyszerre tartalmazza."
    ],
    quiz: {
      question: "Mit jelent a strukturális típusosság (structural typing) a TypeScriptben?",
      options: [
        "A típusok közötti kompatibilitást a nevük és a deklaráció helye határozza meg, mint Java-ban.",
        "A típusok kompatibilitását kizárólag a bennük található tagok (tulajdonságok és metódusok) struktúrája határozza meg; a típusok neve másodlagos.",
        "A fordító megköveteli, hogy minden osztály explicit módon implementálja az interfészt az 'implements' kulcsszóval."
      ],
      correctIndex: 1,
      explanation: "A TypeScript strukturálisan típusos. Ha egy objektumnak megvannak a cél-interfész által elvárt tulajdonságai és metódusai a megfelelő típussal, akkor a fordító kompatibilisnek tekinti őket, függetlenül attól, hogy az objektum osztálya explicit módon deklarálta-e az interfész megvalósítását."
    },
    oralQuestions: [
      {
        question: "Mi a különbség az unió (|) és a metszet (&) típusok között a tagok elérése szempontjából?",
        answer: "Unió típusnál (pl. `A | B`) típus-szűkítés nélkül csak azok a tagok érhetők el biztonságosan, amelyek mindkét típusban (A-ban és B-ben is) közösen léteznek. Metszet típusnál (pl. `A & B`) az eredményül kapott típus az A és B tulajdonságainak egyesítése, így az összes tag elérhető szűkítés nélkül, mivel az objektumnak egyszerre kell megfelelnie mindkét típusnak."
      },
      {
        question: "Hogyan működnek a `.d.ts` kiterjesztésű fájlok a TypeScriptben?",
        answer: "A `.d.ts` (declaration) fájlok típusdeklarációs állományok. Nem tartalmaznak futtatható JavaScript kódot, csak a típusok leírását (interfészek, típusok, függvény szignatúrák). Arra használatosak, hogy a meglévő, sima JavaScript könyvtárak (pl. lodash, react) API felületét leírják a TypeScript fordító számára, így a fejlesztő megkapja az IntelliSense-t és a fordítási idejű típusellenőrzést a JS könyvtárak használatakor is."
      }
    ],
    flashcards: [
      {
        question: "Type Erasure jelentése",
        answer: "A típusinformációk fordításkor törlődnek, a futó JavaScript kód nem tartalmaz típusvizsgálatokat."
      },
      {
        question: "Strukturális kompatibilitás elve",
        answer: "Az objektum kompatibilis egy típussal, ha rendelkezik legalább a típus által elvárt tagokkal (duck typing)."
      },
      {
        question: "Típus kikövetkeztetés (type inference)",
        answer: "A fordító az értékadásból és kifejezésekből automatikusan meghatározza a változó típusát, ha az nincs explicit megadva."
      }
    ]
  },
  {
    id: 6,
    title: "6. const/var/let, null kezelés, type narrowing, overload szignatúrák",
    summary: [
      "var: Függvényhez kötött (function scope), figyelmen kívül hagyja a blokkokat ({}), hajlamos kicsúszni és globális névteret szennyezni. Hoistolódik (undefined értékkel).",
      "let és const: Blokkhoz kötött (block scope). A const nem enged újraértékadást (inicializálni kell). TS-ben a let/const az ajánlott.",
      "null és undefined: Az undefined az inicializálatlan változó/tulajdonság (számmá NaN). A null explicit üres érték (számmá 0). Mindkettő falsy.",
      "strictNullChecks flag: Bekapcsolásával a null/undefined nem adható értékül más típusnak (pl. number-nek). Explicit unió kell: number | null.",
      "Null-kezelési operátorok: Non-null assertion (x! - biztosan nem null, nincs runtime check), Opcionális láncolás (x?.y - ha null/undefined, a kifejezés undefined lesz), Null coalescing (x ?? y - ha x null/undefined, akkor y lesz az érték).",
      "Type narrowing (típusszűkítés): A fordító elemzi a kód futását (pl. if ágakban) és szűkíti a változó típusát a vizsgálatok (type guard) alapján.",
      "Type guard-ok: === null, typeof, Array.isArray(), instanceof, in operátor.",
      "Overload szignatúrák: JS-ben nincs metódus túlterhelés (overload). TS-ben megadható több hívható overload szignatúra (típusleírás) és egyetlen közös implementáció, ami kompatibilis típusú és közvetlenül nem hívható."
    ],
    quiz: {
      question: "Mi a különbség a null-coalescing (`??`) és a logikai VAGY (`||`) operátorok között JavaScriptben?",
      options: [
        "A `??` csak a null és undefined értékekre vált át a jobb oldalra, míg a `||` minden falsy értékre (pl. 0, üres string, false is).",
        "A `||` csak boolean típusokkal működik, a `??` pedig bármilyen objektummal.",
        "Nincs funkcionális különbség, a `??` csak a TypeScript specifikus változata a `||`-nak."
      ],
      correctIndex: 0,
      explanation: "A `||` operátor minden falsy értékre (mint a `0`, `''`, `false`, `NaN`) a jobb oldali értéket adja vissza. A `??` (null-coalescing) viszont szigorúan csak akkor vált a jobb oldalra, ha a bal oldal `null` vagy `undefined`. Így ha pl. a 0 egy érvényes beállítás, a `??` megtartja a 0-t, míg a `||` felülírná a default értékkel."
    },
    oralQuestions: [
      {
        question: "Miért veszélyes a non-null assertion (!) operátor használata a TypeScriptben?",
        answer: "A non-null assertion operátor (`!`) egy utasítás a fordítónak, hogy hagyja abba a null/undefined miatti aggódást, mert mi garantáljuk, hogy az érték ott van. Ez azonban nem generál semmilyen futásidejű ellenőrző kódot. Ha a változó futásidőben mégis null vagy undefined lesz, a program leáll (kivételt dob / crash-el), amikor megpróbáljuk elérni a tulajdonságait."
      },
      {
        question: "Hogyan működnek az overload szignatúrák TypeScriptben, ha a JavaScript nem támogatja az overloadot?",
        answer: "A TypeScript fordítási időben szimulálja a túlterhelést. Létrehozunk több deklarációs szignatúrát (ezek írják le a megengedett paraméter-kombinációkat), majd megírjuk az egyetlen közös implementációs függvényt. Az implementáció paramétereinek unió típusúnak vagy opcionálisnak kell lenniük, hogy minden szignatúrát ki tudjanak szolgálni. A fordító csak a deklarált overload szignatúrák szerinti hívásokat engedi, a közös implementáció közvetlenül nem hívható."
      }
    ],
    flashcards: [
      {
        question: "var vs let/const hatókör",
        answer: "A var függvény-szintű (function scope), a let/const blokk-szintű (block scope, {})."
      },
      {
        question: "Type narrowing definíciója",
        answer: "A fordító által végzett statikus típus-szűkítés az if/else ágakon belül, a kódbeli típusellenőrzések alapján."
      },
      {
        question: "strictNullChecks hatása",
        answer: "A null és undefined értékeket leválasztja a többi típusról, így azok nem rendelhetők hozzájuk explicit unió nélkül."
      }
    ]
  },
  {
    id: 7,
    title: "7. Típus annotációk, aliasok, interface, class, generikusok, dekorátorok",
    summary: [
      "Típus annotációk: Tagok közvetlen felsorolása {} között (object type annotation). Opcionális tagok (?) undefined értéket vehetnek fel.",
      "Type alias (type ID = number): Névvel lát el egy típust. Használható uniókra, primitívekre, tuple-ökre is. Nem kiterjeszthető újra-deklarálással.",
      "Interface: Szerződés objektumok/osztályok számára. Kiterjeszthető (extends) és összeolvasztható (declaration merging: azonos nevű interfészek összefolynak).",
      "Class: Támogatja az öröklést (extends, super() kötelező a this előtt), absztrakt osztályokat, statikus tagokat és láthatósági módosítókat.",
      "Láthatóság: public (alapértelmezett), private (csak fordításidőben tilt, runtime elérhető indexeléssel; runtime védelemhez a # JS privát mező kell), protected, readonly.",
      "Konstruktor paraméter-tulajdonság: A konstruktor argumentumban megadott módosító (pl. public readonly name: string) automatikusan tulajdonságot hoz létre és inicializál.",
      "Generikusok: Típusparaméterezett osztályok és függvények a kód újrafelhasználhatóságáért. Típuskényszer (T extends Lengthwise) korlátozza a típusokat.",
      "Dekorátorok (@decorator): Aspektus-orientált metaprogramozás. Olyan függvények, amelyek az osztály betöltésekor futnak le, és módosítják a dekorált elem (osztály, metódus, mező) működését anélkül, hogy annak kódját átírnánk (pl. naplózás, DI)."
    ],
    quiz: {
      question: "Hogyan működik a TypeScriptben a konstruktor paraméter-tulajdonság (parameter property) rövidítés?",
      options: [
        "A konstruktor paraméterei előtt megadott láthatósági módosító (pl. public, private) automatikusan deklarál egy azonos nevű mezőt az osztályban, és a konstruktor futásakor hozzárendeli a paraméter értékét.",
        "Ez egy olyan paraméter, amit kötelezően át kell adni a szülő osztály 'super()' hívásának.",
        "Automatikus típuskonverziót hajt végre a paraméteren az osztály példányosítása során."
      ],
      correctIndex: 0,
      explanation: "A TypeScriptben ha a konstruktor paramétere elé odatesszük a `public`, `private`, `protected` vagy `readonly` módosítót, azzal lerövidítjük a kódunkat: a fordító automatikusan létrehozza a tagváltozót az osztályban és a konstruktor elején végrehajtja a `this.field = field` értékadást."
    },
    oralQuestions: [
      {
        question: "Mi a különbség az interfész (interface) és a típus alias (type alias) között a TypeScriptben?",
        answer: "Bár mindkettő alkalmas objektumstruktúrák leírására, van két fő különbség: (1) Deklaráció összeolvadás (declaration merging): az interfészek összeolvadnak, ha azonos néven többször deklaráljuk őket (ez type-nál hiba); (2) Rugalmasság: a type alias alkalmas uniók, primitív típusok átnevezésére, vagy tuple leírására is, míg az interfész csak objektum/függvény struktúrák szerződésére való. OOP-ben interfészt ajánlott használni, de a kettő strukturálisan ellenőrződik."
      },
      {
        question: "Miért mondjuk, hogy a 'private' láthatósági módosító nem nyújt valódi biztonságot futásidőben a TypeScriptben, és mi a megoldás?",
        answer: "A TypeScript `private` kulcsszava csak fordítási időben korlátozza az elérést. A transpilation után a kód tiszta JavaScript lesz, ahol a láthatósági korlátok eltűnnek, így a privát tagok kívülről is elérhetők maradnak (pl. `obj['myPrivateProp']` indexeléssel). Valódi runtime védelemhez a JavaScript natív privát mezőit kell használni, amelyeket a `#` karakterrel kezdünk (pl. `#secretKey`), ezeket a JS futtatókörnyezet szigorúan védi."
      }
    ],
    flashcards: [
      {
        question: "Declaration Merging lényege",
        answer: "Azonos nevű interfészek automatikus összefésülése egyetlen interfésszé a fordító által."
      },
      {
        question: "Generikus constraint célja",
        answer: "A generikus típusparaméter korlátozása (T extends X), hogy biztosan rendelkezzen a szükséges tulajdonságokkal."
      },
      {
        question: "Dekorátorok lényege",
        answer: "Metaprogramozási eszköz; olyan függvény, ami megváltoztatja az osztályok/metódusok viselkedését kódmódosítás nélkül."
      }
    ]
  },
  {
    id: 8,
    title: "8. JSX/TSX, virtuális DOM, props, input kezelés, useSyncExternalStore",
    summary: [
      "JSX/TSX: HTML-szerű szintaxis, amit a Babel fordít le React.createElement() hívásokra. A TSX a típusellenőrzött változat.",
      "JS kifejezések JSX-ben: Kapcsos zárójelbe {} kell tenni. Csak kifejezés lehet benne (if/for nem, helyettük ?: vagy && és .map használatos).",
      "Attribútumok: className (class helyett) és htmlFor (for helyett), a JS kulcsszavak miatt. Nincs classList, segédkönyvtár kell (classcat).",
      "Virtuális DOM (vDOM): JS objektumok fája (ReactElement), amivel a React modellezi a felületet. Gyors és elkerüli a natív DOM közvetlen manipulációját.",
      "Diffing algoritmus: Állapotváltozáskor új vDOM generálódik -> a React összeveti a régivel (diff) -> minimális módosítást küld a böngésző DOM-jába.",
      "Közvetlen DOM módosítás tilalma: A React nem értesül a kézi DOM változtatásokról, így a következő renderelésnél felülírja azokat.",
      "Props: A komponens publikus interfésze, a szülőtől kapott írásvédett (read-only) adatok. Nem használható állapot tárolására. Egyirányú adatkötés.",
      "Függvény vs Osztály props: Függvényben paraméterként érkezik (destructuringgal bontható), osztályban a this.props-on keresztül érhető el.",
      "Controlled component (vezérelt mező): Az input value tulajdonságát a React state-hez kötjük, és az onChange eseményen keresztül frissítjük a state-et.",
      "useSyncExternalStore: React-en kívüli store-ok (globális store, WebSocket, böngésző API) bekötésére szolgáló hook. Biztosítja a szinkron, tearing-mentes renderelést. Vár egy subscribe és egy getSnapshot függvényt."
    ],
    quiz: {
      question: "Miért van szükség a Virtuális DOM-ra a Reactban a közvetlen DOM manipuláció helyett?",
      options: [
        "Mert a böngésző natív DOM elérése és módosítása rendkívül lassú művelet. A vDOM-ban végzett diffing segít kiszámítani a minimálisan szükséges HTML módosításokat, elkerülve a felesleges munkát és az állapotvesztést.",
        "Mert a böngészők biztonsági okokból tiltják a közvetlen DOM manipulációt a modern JavaScript keretrendszerekben.",
        "Mert a vDOM automatikusan lefordítja a CSS fájlokat JavaScript kódra a háttérben."
      ],
      correctIndex: 0,
      explanation: "A natív DOM-hoz való hozzáférés és a teljes HTML cseréje lassú, ráadásul a teljes csere miatt a felhasználó elveszítené az input fókuszokat és a beírt adatokat. A Virtual DOM egy gyors JS reprezentáció, amin a React elvégzi a diffinget, és csak a tényleges változásokat hajtja végre a valódi DOM-ban."
    },
    oralQuestions: [
      {
        question: "Hogyan épül fel a useSyncExternalStore által megkövetelt GlobalStore minta?",
        answer: "A GlobalStore egy React-en kívüli osztály, amelynek a következőket kell nyújtania: (1) egy privát listener callback lista és az aktuális érték tárolása; (2) egy 'getValue()' getter a snapshot visszaadására; (3) egy 'subscribe(callback)' metódus, ami felveszi a listenert a listára, és visszaad egy leiratkoztató (unsubscribe) függvényt. A feliratkozó listát érdemes immutable módon (új tömbként) kezelni, hogy a listenerek hívása közbeni feliratkozások ne okozzanak hibát. Értékváltozáskor (setValue) a store-nak végig kell iterálnia a listenereken és értesítenie kell a React-et a callbackek hívásával."
      },
      {
        question: "Mi a különbség a controlled (vezérelt) és uncontrolled (nem vezérelt) komponensek között Reactban?",
        answer: "A controlled komponensnél az input elem értékét (value) a React állapot (state) határozza meg, és minden változást a React eseménykezelője (onChange) frissít az állapotban (a React az igazság egyetlen forrása). Az uncontrolled komponensnél a HTML DOM maga tárolja az állapotot, és a Reactból egy referenciával (useRef) olvassuk ki az értékét, amikor szükség van rá (pl. űrlap elküldésekor)."
      }
    ],
    flashcards: [
      {
        question: "props definíciója",
        answer: "A komponens külső paraméterei, amelyeket a szülő határoz meg. Belülről írásvédettek (immutable)."
      },
      {
        question: "vDOM diffing működése",
        answer: "State változás -> új vDOM számítás -> összevetés az előzővel -> minimális DOM-frissítési parancsok végrehajtása."
      },
      {
        question: "children prop szerepe",
        answer: "A JSX-ben a nyitó és lezáró tag közé írt beágyazott elemek átadása a komponensnek (típusa ReactNode)."
      }
    ]
  },
  {
    id: 9,
    title: "9. Függvény vs. osztály komponensek, életciklus, komponensek átadása paraméterként",
    summary: [
      "Osztály komponens: A Component osztályból származik, van render() metódusa. props: this.props, state: this.state. Állapotállítás: this.setState(), ami merge-el.",
      "this-kötés osztályokban: Az eseménykezelőkben a this elveszik. Megoldás: bind a konstruktorban, vagy arrow function használata a JSX-ben/osztálymetódusként.",
      "Függvény komponens: Sima függvény, ami propsot kap és ReactElementet ad vissza. Egyszerűbb, tömörebb kód. Állapotot és életciklust hookokkal kezel.",
      "Osztály életciklus metódusok: constructor (state init), render (nézet generálás), componentDidMount (megjelenés után, pl. fetch), componentDidUpdate (prop/state változáskor), componentWillUnmount (eltávolítás előtt, takarítás).",
      "Függvény életciklus (useEffect): A useEffect(effect, deps) hook kezeli. deps = [] -> componentDidMount-nak felel meg. deps = [a, b] -> ha a vagy b változik. deps hiánya -> minden render után.",
      "useEffect cleanup: Az effect függvényből visszaadott takarító függvény, ami unmount előtt és minden újrafutás előtt lefut (leiratkozásokhoz, timerek törléséhez).",
      "Remount vs. Re-render: Csak props/state változáskor nincs remount (konstruktor nem fut le újra), csak a render/függvény fut le. Remount csak key változásakor vagy feltételes renderelésnél történik.",
      "Komponens átadása paraméterként: Mivel a komponens egy érték, átadható propként. (1) Renderelt elem átadása ({content}), (2) children prop, (3) Komponens típusának átadása (List Item={ItemComponent} - React.ComponentType)."
    ],
    quiz: {
      question: "Mikor fut le a `useEffect`-ből visszaadott takarító (cleanup) függvény?",
      options: [
        "Kizárólag a komponens DOM-ból való eltávolításakor (unmount).",
        "A komponens eltávolításakor (unmount), valamint minden egyes effekt-újrafutás előtt, ha a függőségi tömbben megadott értékek módosultak.",
        "Minden egyes renderelés megkezdése előtt, függetlenül a függőségi tömbtől."
      ],
      correctIndex: 1,
      explanation: "A takarító függvény lefut a komponens unmountolásakor (componentWillUnmount szimuláció), de rendkívül fontos, hogy lefut minden olyan alkalommal is a háttérben, amikor az effekt a függőségek változása miatt újra lefutna. Ezzel elkerülhető, hogy a régi feliratkozások vagy timerek aktívak maradjanak (pl. memóriaszivárgás)."
    },
    oralQuestions: [
      {
        question: "Miért van szükség a 'this' explicit kötésére (bind) osztály komponensekben?",
        answer: "A JavaScriptben a metódusok hívásakor a 'this' kontextus dinamikusan dől el. Amikor egy osztálymetódust eseménykezelőként adunk át a JSX-ben (pl. `<button onClick={this.handleClick}>`), a React nem metódusként, hanem sima függvényként fogja meghívni, így a 'this' kontextusa elvész és értéke 'undefined' lesz. A konstruktorban végzett `this.handleClick = this.handleClick.bind(this)` rögzíti a kontextust a példányhoz. Alternatívaként nyílfüggvényes osztálytulajdonságot is használhatunk."
      },
      {
        question: "Hogyan valósítjuk meg a Reactban a kompozíciót az öröklés helyett?",
        answer: "A React nem javasolja az osztály-öröklődési láncok használatát a komponensek testreszabására. Helyette kompozíciót használunk: a komponensek egymásba ágyazhatók a 'children' prop segítségével, vagy explicit módon átadhatunk renderelt ReactElement-eket vagy magukat a komponens-függvényeket (React.ComponentType) propként. Így a külső komponens konfigurálja és specializálja a belső komponenst."
      }
    ],
    flashcards: [
      {
        question: "componentDidMount hook megfelelője",
        answer: "useEffect(fn, []) -> üres függőségi tömbbel csak az első renderelés után fut le egyszer."
      },
      {
        question: "useEffect cleanup feladata",
        answer: "Timerek törlése (clearInterval), feliratkozások megszüntetése, hálózati kérések megszakítása."
      },
      {
        question: "Remount kiváltása",
        answer: "A komponensen lévő 'key' attribútum értékének megváltoztatásával, vagy feltételes rendereléssel (eltávolítás majd újra hozzáadás)."
      }
    ]
  },
  {
    id: 10,
    title: "10. Belső állapot (useState, useRef, useReducer), lifting state, aszinkron hívások",
    summary: [
      "Állapot osztály komponensben: this.state objektum, frissítése a this.setState() metódussal történik, ami merge-eli az állapotot és aszinkron batching-et alkalmaz.",
      "useState (függvényben): [state, setState] párost ad vissza. A hookok sorrendjét a React fixen elvárja, ezért nem tehetők feltételes ágakba (if, while) vagy ciklusokba.",
      "Aszinkron setState: A React teljesítmény okokból batch-eli a közeli állapotfrissítéseket, így a setState nem azonnali. Ha az előző értékre építünk, a függvényes formát kell használni: setState(prev => prev + 1).",
      "useReducer: Komplex állapotkezelésre. Egy (state, action) => newState reducer függvényt és egy kezdő állapotot vár. A komponens dispatch(action) hívással küld eseményt.",
      "useRef: Visszaad egy objektumot egyetlen { current } mezővel. Stabil identitású (minden renderben ugyanaz a ref objektum). Írása nem vált ki renderelést.",
      "useRef használata: (1) HTML DOM elem hivatkozás (input fókusz, méret lekérés), (2) Tagváltozó szimuláció (cache, timer ID-k tárolása renderelés kiváltása nélkül).",
      "Lifting state (állapot felemelése): Ha több komponensnek azonos állapot kell, a legközelebbi közös szülőbe helyezzük. Propsként küldjük le, callbackként frissítjük felfelé.",
      "Aszinkron API hívások: A render és a hookok szinkronok. A useEffect nem fogadhat el async függvényt közvetlenül (mert Promise-t adna vissza).",
      "Aszinkron useEffect minta: IIFE async függvényt indítunk az effekten belül, és egy 'mounted' logikai változóval (takarításkor false) megakadályozzuk, hogy a már unmountolt komponensen hívjunk állapotfrissítőt."
    ],
    quiz: {
      question: "Miért nem adhatunk át közvetlenül aszinkron (async) függvényt a `useEffect` hook első paramétereként?",
      options: [
        "Mert a böngészők nem támogatják az aszinkron függvényeket a hookokon belül.",
        "Mert az async függvény automatikusan Promise-szal tér vissza. A React viszont azt várja, hogy a useEffect első paramétere vagy semmivel (undefined), vagy egy szinkron takarító (cleanup) függvénnyel térjen vissza.",
        "Mert az async függvény leblokkolná a React teljes renderelési szálát."
      ],
      correctIndex: 1,
      explanation: "A `useEffect` hook visszatérési értékeként a React kizárólag a takarító (cleanup) függvényt hajlandó elfogadni. Mivel egy `async` függvény mindig egy `Promise` objektummal tér vissza, a React ezt megpróbálná takarító függvényként meghívni az unmountoláskor, ami hibához vezetne. Ezért az aszinkron kódot a hook belsejében egy azonnal meghívott függvényben (IIFE) kell futtatni."
    },
    oralQuestions: [
      {
        question: "Miért nem helyezhetünk React hookokat (pl. useState, useEffect) feltételes ágakba (if) vagy ciklusokba?",
        answer: "A React nem tárolja a hookok nevét vagy azonosítóját. A háttérben az állapotokat és effekteket egy egyszerű tömbben/listában tárolja a komponenshez kapcsolva, és kizárólag a hookok meghívásának sorrendje (hívási index) alapján azonosítja őket. Ha egy hookot feltételhez kötünk, és az az egyik renderelés során nem fut le, a sorrend eltolódik. Ekkor az utána következő hookok a listában eggyel korábbi állapotot kapnak meg, ami súlyos állapot-keveredéshez és programhibához vezet."
      },
      {
        question: "Hogyan működik a 'mounted' flag minta aszinkron adatlekérésnél függvény komponensekben?",
        answer: "Mivel a hálózati kérés ideje alatt a komponenst eltávolíthatják a DOM-ból (unmount), a megérkező válasz utáni állapotfrissítés (`setData`) hibát/figyelmeztetést okozna a memóriaszivárgás miatt. A megoldás: az effekten belül létrehozunk egy `let mounted = true;` változót. Az aszinkron kód végén csak akkor frissítünk állapotot, ha `if (mounted)`. A useEffect-ből pedig visszaadunk egy takarító függvényt: `return () => { mounted = false; };`. Így unmountkor azonnal false lesz, megvédve az állapotfrissítést."
      }
    ],
    flashcards: [
      {
        question: "useRef fő jellemzője",
        answer: "Stabil identitású objektum {current} mezővel. Értékének írása vagy olvasása nem vált ki újrarenderelést."
      },
      {
        question: "Lifting State eljárás",
        answer: "Az állapot felemelése a legközelebbi közös szülőbe, majd props-szal leküldés és callback-kel (onChange) felküldés."
      },
      {
        question: "Függvényes setState indokoltsága",
        answer: "Amikor az új állapot kiszámítása közvetlenül az előző állapottól függ (pl. c => c + 1), kivédve az aszinkron batching miatti elavult értékeket."
      }
    ]
  },
  {
    id: 11,
    title: "11. Android komponensek, .apk előállítása és aláírása, Manifest",
    summary: [
      "Egy Android app egy vagy több komponensből épül fel; mindegyik önállóan aktiválódhat, akár másik alkalmazás is aktiválhatja (Intenttel).",
      "Activity: különálló nézet saját UI-val (AppCompatActivity). Service: háttérben futó, UI nélküli feladat (pl. letöltés). Content Provider: megosztott adatforrás más appok felé (eredmény: Cursor). Broadcast Receiver: rendszer-szintű eseményekre reagál (Intent formájában érkezik).",
      ".apk előállítása: Manifest+erőforrások -> csomagolt erőforrások + R.java; a forráskód -> Dalvik bytecode -> classes.dex; ezek együtt -> aláíratlan apk.",
      "Aláírás: az aláíratlan apk-t egy kulccsal aláírva kapjuk a telepíthető, aláírt apk-t.",
      "Az apk egy tömörített állomány (META-INF/ a tanúsítvánnyal és hash-ekkel, res/, AndroidManifest.xml, classes.dex, resources.arsc). A telepítésért a PackageManagerService felel.",
      "Az apk visszafejthető (dex2jar, JD-Gui) -> a kód nincs biztonságban, ezért érdemes obfuszkálni.",
      "Manifest (AndroidManifest.xml): XML alkalmazásleíró, definiálja a komponenseket; a rendszer indítás előtt és telepítéskor ellenőrzi.",
      "Kötelező/jellemző tartalma: a java package (egyedi azonosító), kért engedélyek, minimum API szint (uses-sdk), használt hardver/szoftver funkciók, külső API könyvtárak, a komponensek listája (<activity>, <service>, <provider>, <receiver>).",
      "A manifestben nem szereplő Activity/Service/Content Provider nem látható a rendszernek – kivétel a Broadcast Receiver, ami kódból is regisztrálható (registerReceiver). A launcher Activity-t az intent-filterben a MAIN action + LAUNCHER category jelöli."
    ],
    quiz: {
      question: "Mi keletkezik a fejlesztő Kotlin/Java forráskódjából az .apk fordítása során, és milyen formában fut a kód a készüléken?",
      options: [
        "Szabványos Java bytecode (.class fájlok), amit a készülék JVM-je közvetlenül futtat.",
        "Dalvik bytecode formátumú classes.dex állomány, amelyet az Android futtatókörnyezete (ART/Dalvik VM) hajt végre.",
        "Natív gépi kód (.so), amelyet a Linux kernel közvetlenül, virtuális gép nélkül futtat."
      ],
      correctIndex: 1,
      explanation: "Az Android nem szabványos Java bytecode-ot használ: a fordító a forráskódból Dalvik bytecode-ot állít elő, ami egyetlen classes.dex állományba kerül. Ezt az Android virtuális gépe (a régi Dalvik, ma az ART) futtatja, amely a mobil eszközök korlátozott erőforrásaira van optimalizálva."
    },
    oralQuestions: [
      {
        question: "Hogyan lesz a fejlesztő által előállított fájlokból telepíthető, aláírt .apk?",
        answer: "A folyamat: (1) a Manifestből és az erőforrásokból elkészülnek a csomagolt erőforrások, és generálódik az R (R.java az erőforrás-azonosítókkal); (2) a forráskódot az R-rel és a könyvtárakkal a fordító lefordítja, majd Dalvik bytecode előállítás után keletkezik a classes.dex; (3) a classes.dex és a csomagolt erőforrások összecsomagolásával létrejön az aláíratlan apk; (4) ezt egy kulccsal aláírva kapjuk az aláírt apk-t, ami már telepíthető és terjeszthető. Az apk egy tömörített állomány, ami tartalmazza a META-INF mappát (tanúsítvány, MANIFEST.MF, az erőforrások SHA hash-ei), a res/ erőforrásokat, az AndroidManifest.xml-t, a classes.dex-et és a resources.arsc-t."
      },
      {
        question: "Melyik komponens az, amelyet nem kötelező a Manifestben deklarálni, és miért?",
        answer: "A Broadcast Receiver. A többi komponens (Activity, Service, Content Provider) csak akkor látható és indítható a rendszer számára, ha szerepel a Manifestben (statikus regisztráció). A Broadcast Receiver viszont regisztrálható dinamikusan, kódból is, a registerReceiver()/unregisterReceiver() hívásokkal (tipikusan az onStart/onStop párban). Sőt, bizonyos eseményekre (pl. ACTION_TIME_TICK) kizárólag a dinamikus regisztráció működik, a statikus nem."
      }
    ],
    flashcards: [
      {
        question: "A négy Android komponenstípus",
        answer: "Activity (UI-s nézet), Service (háttérfeladat UI nélkül), Content Provider (megosztott adat), Broadcast Receiver (rendszereseményekre reagál)."
      },
      {
        question: "classes.dex tartalma",
        answer: "A lefordított osztályok Dalvik bytecode formátumban, az Android VM (ART) számára – nem szabványos Java bytecode."
      },
      {
        question: "Launcher Activity jelölése",
        answer: "Az intent-filterben a MAIN action + LAUNCHER category – ettől jelenik meg az app a futtatható alkalmazások listájában."
      }
    ]
  },
  {
    id: 12,
    title: "12. Activity életciklus, Back Stack, Intent mechanizmus",
    summary: [
      "Az Activity tipikusan egy képernyő (ablakként képzelhető el), amin a felhasználó műveletet végez. Egy app több, lazán csatolt Activity-ből áll, jellemzően egy 'fő' Activity-vel.",
      "Három fő állapot: Resumed/running (előtérben, focus rajta), Paused (látszik, de másik van előrébb), Stopped (nem látható). Paused/Stopped állapotban a rendszer memóriaigény esetén felszabadíthatja.",
      "Életciklus-callbackek: onCreate (létrehozás, layout), onStart (láthatóvá válik), onResume (előtérbe kerül), onPause (háttérbe kerül, de látszik – itt mentés), onStop (nem látható), onRestart (stop utáni újraindítás), onDestroy (megsemmisülés). Az ős implementációját mindig hívni kell (super.onCreate()).",
      "Csoportosítás: teljes élettartam (onCreate->onDestroy), látható (onStart->onStop), előtér (onResume->onPause).",
      "Állapotmentés: onSaveInstanceState() Bundle-be ment (belső változók, UI-értékek – NEM perzisztens adat); onCreate/onRestoreInstanceState kapja vissza. Konfiguráció-változáskor (forgatás, nyelv) a rendszer újraindítja az Activity-t (onDestroy->onCreate).",
      "A -> B váltás sorrendje: A.onPause -> B.onCreate, B.onStart, B.onResume -> A.onStop. Ezért a B-nek átadott adatot A onPause-ában kell menteni.",
      "Back Stack: a feladathoz használt Activity-k LIFO verme; az előtérben lévő a verem tetején. Új indításkor a tetejére kerül, a Vissza gomb leveszi a tetejét. Felülírható a Manifestben vagy startActivity flagekkel.",
      "Intent: passzív adatstruktúra, ami késői (futásidejű) kötést valósít meg komponensek között; mindig az Android runtime-on keresztül jut célba. Részei: Component name, Action, Data (URI+MIME), Category, Extras, Flags.",
      "Explicit Intent: megnevezi a cél komponenst (saját appon belüli Activity/Service indítása). Implicit Intent: az akciót írja le, nem a komponenst (más app funkciójának igénybevétele); több találatnál 'Complete action using' dialógus, nullánál ActivityNotFoundException.",
      "Eredmény: startActivityForResult(intent, requestCode); a hívott setResult(resultCode, intent)+finish(); a hívó onActivityResult(requestCode, resultCode, data). Beépített app indítása implicit Intenttel (pl. ACTION_DIAL + tel: URI)."
    ],
    quiz: {
      question: "Az 'A' Activity elindítja a 'B' Activity-t. Milyen sorrendben hívódnak meg az életciklus-függvények?",
      options: [
        "A.onStop() -> A.onPause() -> B.onCreate() -> B.onStart() -> B.onResume()",
        "A.onPause() -> B.onCreate() -> B.onStart() -> B.onResume() -> A.onStop()",
        "B.onCreate() -> B.onStart() -> B.onResume() -> A.onPause() -> A.onStop()"
      ],
      correctIndex: 1,
      explanation: "Először az 'A' onPause()-a fut le (háttérbe kerül), majd a 'B' jön létre és kerül előtérbe (onCreate -> onStart -> onResume), és csak ezután hívódik meg az 'A' onStop()-ja, amikor 'B' már teljesen eltakarja. Ezért, ha 'B' az 'A' által mentett adatot olvas, a mentésnek már 'A' onPause()-ában meg kell történnie."
    },
    oralQuestions: [
      {
        question: "Mi a különbség az explicit és az implicit Intent között, és mire használjuk őket?",
        answer: "Az explicit Intent konkrétan megnevezi a cél komponenst (pl. Intent(context, MasikActivity::class.java)) – tipikusan a saját alkalmazáson belül indítunk vele Activity-t vagy Service-t. Az implicit Intent nem a komponenst, hanem a végrehajtandó akciót (és ha kell, az adatot, pl. egy URI-t) írja le – ezzel tipikusan más alkalmazás funkcióját vesszük igénybe (pl. tárcsázó, böngésző, névjegyválasztó). Implicit Intentnél a rendszer keresi a megfelelő komponenst: ha több is van, 'Complete action using' dialógus jelenik meg; ha egy sincs, ActivityNotFoundException dobódik. Egy komponens csak akkor fogad implicit Intentet, ha van Intent filtere a Manifestben."
      },
      {
        question: "Mi a teendő konfiguráció-változáskor (pl. képernyő-elforgatás), és hogyan őrizzük meg az állapotot?",
        answer: "Konfiguráció-változáskor (orientáció, nyelv, billentyűzet) a rendszer megsemmisíti és újra létrehozza az Activity-t (onDestroy -> onCreate), hogy az új konfigurációhoz tölthessen erőforrásokat. Az átmeneti állapot megőrzéséhez az onSaveInstanceState() callbackben egy Bundle-be mentjük a belső változókat és a UI-elemek értékeit (NEM perzisztens adatot – arra DB/SharedPreferences való). Ezt a Bundle-t az onCreate() vagy az onRestoreInstanceState() kapja vissza. Fontos: nincs garancia a meghívásra (pl. a Vissza gomb nyomásakor nincs, mert ott a felhasználó szándékosan végzett az Activity-vel)."
      }
    ],
    flashcards: [
      {
        question: "Hol mentsünk adatot az Activity életciklusában?",
        answer: "onPause()-ban (ez fut le biztosan, mielőtt egy másik Activity előtérbe kerül); átmeneti UI-állapotot onSaveInstanceState() Bundle-be."
      },
      {
        question: "Back Stack működése",
        answer: "LIFO verem: az előtérben lévő Activity a verem tetején; új indításkor a tetejére kerül, a Vissza gomb leveszi a legfelsőt."
      },
      {
        question: "Intent definíciója",
        answer: "Passzív adatstruktúra, ami futásidejű (késői) kötést valósít meg komponensek között, az Android runtime-on keresztül."
      }
    ]
  },
  {
    id: 13,
    title: "13. Erőforrás kezelés, lokalizáció, Fragment",
    summary: [
      "Egy Android app nem csak forráskódból áll, hanem erőforrásokból is (képek, hangok, szövegek, XML-ben definiált layout/menü/animáció/stílus). Az erőforrás szétválasztja a kódot és a tartalmat -> rugalmasabb.",
      "Minden erőforráshoz a rendszer egyedi azonosítót generál (res/drawable/logo.png -> R.drawable.logo), az R.java-ban tárolva (kézzel SOHA nem módosítjuk). Hivatkozás kódból: R.típus.név; XML-ből: @típus/név.",
      "Minősítők (qualifiers): a könyvtárnévhez fűzött postfix (pl. values-hu, layout-large, drawable-hdpi). Futásidőben a rendszer a készülék képességeihez illő erőforrást választja; ha nincs pontos, alacsonyabb felé esik vissza.",
      "A UI dp alapján skálázódik, a képeket a rendszer a sűrűség szerint átskálázza, így nem kell minden méret/sűrűség kombinációt megadni.",
      "Lokalizáció: a nyelvet/régiót a könyvtár minősítője adja (res/values/ alapértelmezett, res/values-hu/ stb.). Az alapértelmezett könyvtárakra esik vissza, ha nincs megfelelő lokalizált erőforrás.",
      "Fragment: a képernyő egy nagyobb részéért felelős, újrafelhasználható objektum, mindig egy Activity-hez csatoltan. Modulárisabb, rugalmasabb architektúrát ad (pl. tableten egy Activity két fragmentet tart, telefonon kettő külön).",
      "Fragment életciklus: onAttach -> onCreate -> onCreateView (itt adjuk vissza a View-hierarchiát) -> onActivityCreated -> onStart -> onResume ... onPause -> onStop -> onDestroyView -> onDestroy -> onDetach.",
      "Csatolás: statikus (az Activity layoutjában <fragment> taggel, nem módosítható) vagy dinamikus (futásidőben egy ViewGroupba, FragmentManager + FragmentTransaction: add/remove/replace, addToBackStack, commit).",
      "Kommunikáció: a fragmentek közvetlenül NEM kommunikálnak (egységbe zártak) -> az Activity közvetít, tipikusan egy interfészen keresztül (a ListFragment jelez az Activity-nek, az hívja a DetailsFragmentet). Modern alternatíva: megosztott ViewModel, Fragment Result API."
    ],
    quiz: {
      question: "A felhasználó magyar nyelvű készüléken futtatja az appot, de a fejlesztő csak a res/values/strings.xml fájlt töltötte ki (nincs values-hu). Mi történik a szövegekkel?",
      options: [
        "Az alkalmazás hibát dob, mert nem találja a magyar nyelvű erőforrást.",
        "Az alapértelmezett res/values/strings.xml szövegei jelennek meg, mert erre esik vissza a rendszer, ha nincs illeszkedő lokalizált erőforrás.",
        "A szövegek üresen maradnak, amíg a fejlesztő hozzá nem adja a values-hu könyvtárat."
      ],
      correctIndex: 1,
      explanation: "Az erőforrás-választó algoritmus mindig az alapértelmezett (minősítő nélküli) könyvtárakra esik vissza, ha az aktuális konfigurációhoz (itt: magyar nyelv) nincs megfelelő minősítőjű erőforrás. Ezért az alapértelmezett res/values/strings.xml a 'biztonsági háló' – ennek mindig teljesnek kell lennie. (Hiba csak fordítva van: ha pl. csak xlarge méretű erőforrás létezik, és a készülék kisebb.)"
    },
    oralQuestions: [
      {
        question: "Vázolja fel a Fragment életciklusát és emelje ki az onCreateView szerepét!",
        answer: "A fragment életciklusa: onAttach (az Activity-hez csatolódik) -> onCreate (létrejön, UI még nincs) -> onCreateView (itt kell visszaadni a megjelenítendő View-hierarchiát, jellemzően inflate-tel) -> onActivityCreated -> onStart -> onResume (aktív). Lefelé: onPause -> onStop -> onDestroyView (a fragment nézetét eldobja, de a fragment maga még élhet) -> onDestroy -> onDetach. Az onCreateView kitüntetett: ez felel a fragment vizuális tartalmáért, és a hozzá tartozó View binding csak az onCreateView és az onDestroyView között érvényes (ezért onDestroyView-ban a bindinget nullázni kell). Ha a fragment a back stackről tér vissza, csak az onCreateView fut újra, az onCreate nem feltétlenül."
      },
      {
        question: "Miért nem kommunikálnak közvetlenül a fragmentek egymással, és mi a helyes minta?",
        answer: "A fragmenteknek egységbe zártnak (önállónak, újrafelhasználhatónak) kell lenniük, ezért nem szabad, hogy közvetlenül ismerjék és hívják egymást – különben szorosan összekötődnének és elvesztenék az újrafelhasználhatóságukat. A helyes minta a közvetett kommunikáció, ahol az Activity a közvetítő: a fragment egy általa definiált interfészen keresztül jelez az Activity-nek (pl. a ListFragment onSelected(id)-t hív), az Activity implementálja ezt az interfészt, és ő hívja meg a megfelelő másik fragmentet (pl. showDetails(id)). Így a fragmentek csak az interfésztől/Activity-től függenek, egymástól nem. Modern alternatíva a megosztott ViewModel vagy a Fragment Result API."
      }
    ],
    flashcards: [
      {
        question: "R.java szerepe",
        answer: "Az erőforrásokhoz generált egyedi azonosítókat (R.típus.név) tartalmazza; a rendszer generálja, kézzel soha nem módosítjuk."
      },
      {
        question: "Erőforrás-minősítő (qualifier)",
        answer: "A könyvtárnévhez fűzött postfix (pl. values-hu, drawable-hdpi, layout-large); futásidőben ez alapján választ a rendszer a készülék képességeihez."
      },
      {
        question: "Dinamikus fragment-csatolás eszközei",
        answer: "FragmentManager (beginTransaction, keresés, stack) + FragmentTransaction (add/remove/replace, addToBackStack, commit)."
      }
    ]
  },
  {
    id: 14,
    title: "14. Perzisztens adattárolás, ORM, publikus/privát adatok, RecyclerView",
    summary: [
      "Perzisztens tárolási lehetőségek: SharedPreferences/DataStore (kulcs-érték, alaptípusok – beállításokhoz, auto-loginhoz), fájlkezelés (tetszőleges adat, internal/external), SQLite (strukturált, relációs adat), hálózat/felhő (BaaS, pl. Firebase – több eszköz, real-time).",
      "SharedPreferences: getSharedPreferences(name, mode); olvasás getInt(KEY, default), írás edit().putInt(...).commit(). DataStore a modern utód (Coroutine + Flow, aszinkron).",
      "ORM (Object-Relation Mapping): objektumok tárolása relációs DB-ben – osztálynév -> tábla, objektum -> sor, mező -> oszlop.",
      "Androidon az ORM-et a Room biztosítja (absztrakció az SQLite felett): @Entity (tábla/data class, @PrimaryKey), @Dao (műveletek: @Query/@Insert/@Update/@Delete), @Database (absztrakt RoomDatabase, tipikusan singleton). A műveletek háttérszálon, az UI-frissítés a fő szálon.",
      "Internal storage (privát): csak az app éri el; openFileOutput/openFileInput; cache: getCacheDir(); statikus fájlok res/raw-ban (read-only).",
      "External storage (nyilvános, ~SD): a user is írhatja, bármikor elérhetetlenné válhat -> Environment.getExternalStorageState() ellenőrzés; engedély: WRITE_EXTERNAL_STORAGE. Adat kiajánlása másoknak inkább Content Providerrel.",
      "Listák kezelése: a korszerű megoldás a RecyclerView (a régi ListView/GridView helyett).",
      "RecyclerView előnyei: kikényszeríti a ViewHolder mintát (nincs folyamatos findViewById -> gyors, sima görgetés), hatékonyan újrahasznosítja a legörgetett sorok view-jait, flexibilis LayoutManagerekkel (lineáris, grid, staggered).",
      "Egyedi listaelem: RecyclerView.Adapter<ViewHolder> – onCreateViewHolder (a saját sor-layout felfújása), onBindViewHolder (az adott pozíció adatainak beállítása + eseménykezelők), getItemCount. ListAdapter + DiffUtil az optimális frissítéshez.",
      "Content Provider: strukturált adat elérési rétege, ami elfedi a tárolást és appok közti adatmegosztást ad. Elérés: ContentResolver (query->Cursor, insert->URI, update/delete->sorok száma). Azonosító: CONTENT_URI (content://authority/path)."
    ],
    quiz: {
      question: "Mi a RecyclerView legfőbb teljesítménybeli előnye a régi ListView-hoz képest egy hosszú, görgethető listánál?",
      options: [
        "A RecyclerView az összes listaelemet egyszerre, előre létrehozza a memóriában, így görgetéskor nincs számítás.",
        "A RecyclerView kikényszeríti a ViewHolder mintát és újrahasznosítja a képernyőről kigörgetett sorok nézeteit, így elkerüli a folyamatos, költséges findViewById hívásokat és a felesleges view-létrehozást.",
        "A RecyclerView a háttérben egy külön szálon rendereli a teljes listát, ezért nem terheli a fő szálat."
      ],
      correctIndex: 1,
      explanation: "A RecyclerView csak annyi sornyi nézetet tart életben, amennyi a képernyőn elfér (plusz néhány tartalék), és a kigörgetett sorok view-jait újra felhasználja az újonnan megjelenőkhöz – csak az adatot köti be újra (onBindViewHolder). A kötelező ViewHolder minta eltárolja a sor view-referenciáit, így nem kell minden bindelésnél findViewById-t hívni. Ez adja a sima, hatékony görgetést nagy listáknál is."
    },
    oralQuestions: [
      {
        question: "Mit nevezünk ORM-nek, és az Android ezt milyen eszközzel támogatja?",
        answer: "Az ORM (Object-Relation Mapping) egy olyan technika, amely objektumokat tárol relációs adatbázisban, elrejtve a fejlesztő elől a nyers SQL-t. Alapelvei: egy osztály egy táblának, egy objektum a tábla egy sorának, egy mező pedig egy oszlopnak felel meg. Az Androidon ezt a Google saját ORM-je, a Room Persistence Library valósítja meg, ami egy absztrakciós réteg az SQLite felett (a teljes SQLite-képességgel). Három fő eleme: @Entity (a táblát leíró data class, @PrimaryKey/@ColumnInfo annotációkkal), @Dao (interfész az adatműveletekkel: @Query, @Insert, @Update, @Delete) és @Database (absztrakt RoomDatabase osztály, ami felsorolja az entitásokat és a verziót, tipikusan singletonként példányosítjuk). Mivel a DB-elérés lassú lehet, a műveleteket háttérszálon végezzük."
      },
      {
        question: "Hogyan kezelhetők a publikus és privát adatok a fájlrendszerben, és mire kell figyelni a külső tárnál?",
        answer: "Két lemezterület van. Az internal storage privát: kizárólag az adott app éri el (se a user, se más app). Írás openFileOutput(filename, mode)-dal (MODE_PRIVATE felülír, MODE_APPEND hozzáfűz), olvasás openFileInput(filename)-nel; ideiglenes adatra a getCacheDir() való (a rendszer törölheti). Az external storage (~SD-kártya) nyilvános: a felhasználó és más appok is olvashatják-írhatják, de bármikor elérhetetlenné válhat (pl. USB-storage mód, a user törölheti). Ezért használat előtt mindig ellenőrizni kell az Environment.getExternalStorageState() értékét (pl. MEDIA_MOUNTED), és WRITE_EXTERNAL_STORAGE engedély kell hozzá. Ha az adatunkat strukturáltan, kontrollált módon akarjuk megosztani más appokkal, a fájlrendszeri világ-módok helyett a Content Provider az ajánlott megoldás."
      }
    ],
    flashcards: [
      {
        question: "Room három fő annotációja",
        answer: "@Entity (tábla/data class), @Dao (adatműveletek interfésze), @Database (absztrakt RoomDatabase)."
      },
      {
        question: "SharedPreferences mire jó",
        answer: "Alaptípusok (int, String, boolean...) kulcs-érték párként – beállítások, UI-állapot, auto-login. Modern utód: DataStore."
      },
      {
        question: "Adapter három kötelező metódusa",
        answer: "onCreateViewHolder (sor-layout felfújása), onBindViewHolder (adat beállítása a pozícióhoz), getItemCount (elemszám)."
      }
    ]
  },
  {
    id: 15,
    title: "15. Hálózati kommunikáció mobilon, UI értesítése, engedélykezelés",
    summary: [
      "Rövid távú kommunikáció: NFC (<4 cm, NDEF formátum), Bluetooth (RFCOMM, BluetoothAdapter/Device/Socket), Bluetooth LE (API 18+, kis fogyasztás, szenzorok), Nearby API, WiFi Direct.",
      "Internet alapú: TCP Socket (java.net.Socket/ServerSocket, megbízható), UDP (DatagramSocket/Packet, gyors, de nem garantált kézbesítés), HTTP(S) (GET/POST/PUT/DELETE, REST).",
      "TCP vs UDP: a TCP kapcsolat-orientált és megbízható (sorrendhelyes, garantált), de lassabb; az UDP kapcsolatmentes, gyors, de nem garantálja a kézbesítést – ott jó, ahol a csomagvesztés nem kritikus (valós idejű média, játék).",
      "HTTP figyelmeztetések: kell az INTERNET engedély; a hálózati hívást KÜLÖN szálon kell végezni (különben ~5 mp után ANR); ellenőrizni a válaszkódot; timeout (setConnectTimeout/setReadTimeout); hibakezelés. Könyvtárak: HttpURLConnection, OkHttp.",
      "A UI értesítése: a hálózati hívás háttérszálon fut, de a UI-t csak a fő szálból szabad módosítani. Megoldások: runOnUiThread, View.post, Handler, Retrofit Callback (onResponse/onFailure), Kotlin Coroutine (Dispatchers.Main).",
      "Adatformátumok: JSON (JSONObject/JSONArray, GSON/Moshi), XML (SAX eseményvezérelt / DOM fába olvas), CSV.",
      "Retrofit: OkHttp-re épülő REST library, a kéréseket annotációkkal írjuk le. Lépések: entitások (data class), API interfész (@GET/@Query), Retrofit.Builder + addConverterFactory, call.enqueue(Callback). A JSON->objektum konverziót automatikusan végzi.",
      "Engedélykezelés: veszélyes/személyes adatot érintő művelethez user-engedély kell. Régen telepítéskor mind; Android 6 (API 23) óta a veszélyes engedélyeket futásidőben kell kérni.",
      "Kategóriák: normál (a rendszer automatikusan megadja a Manifest alapján, pl. INTERNET) és veszélyes (futásidőben, kódból kell kérni, pl. CAMERA, fine location; a user visszavonhatja).",
      "Veszélyes engedély kérése: 1) Manifest <uses-permission>; 2) ellenőrzés checkSelfPermission; 3) (opc.) indoklás shouldShowRequestPermissionRationale; 4) kérés requestPermissions; 5) eredmény onRequestPermissionsResult. Compose: rememberLauncherForActivityResult / Accompanist."
    ],
    quiz: {
      question: "Miért kell a hálózati (HTTP) hívásokat egy külön szálon végezni Androidon?",
      options: [
        "Mert az Android tiltja, hogy a fő szál bármilyen I/O műveletet végezzen, és fordítási hibát ad rá.",
        "Mert a hosszú hálózati művelet a fő (UI) szálon blokkolná a felület frissítését, és kb. 5 másodperc után a rendszer ANR (Application Not Responding) hibát dobna.",
        "Mert a külön szálról közvetlenül, gyorsabban lehet módosítani a felhasználói felület elemeit."
      ],
      correctIndex: 1,
      explanation: "A fő (UI) szál felel a felület rajzolásáért és az eseménykezelésért. Ha egy lassú hálózati hívást rajta futtatnánk, a UI 'befagyna', és a rendszer kb. 5 mp után ANR-t (Application Not Responding) jelezne. Ezért a hálózati munkát háttérszálra kell tenni. Fontos viszont a fordított irány is: a UI-t KIZÁRÓLAG a fő szálból szabad módosítani, ezért az eredménnyel vissza kell térni a fő szálra (runOnUiThread, Retrofit Callback, Coroutine Dispatchers.Main)."
    },
    oralQuestions: [
      {
        question: "Hogyan értesíthető a felhasználói felület a háttérben futó hálózati lekérdezés eredményéről?",
        answer: "Mivel a hálózati hívás külön (háttér)szálon fut, de a felhasználói felületet kizárólag a fő (UI) szálból szabad módosítani, az eredménnyel vissza kell jelezni a UI-szálnak. Lehetőségek: Activity.runOnUiThread(Runnable); View.post(Runnable)/postDelayed; Handler (üzenet a main loopernek); a régebbi, mára deprecated AsyncTask/LocalBroadcast; külső event-bus könyvtárak (EventBus, Otto); Retrofit esetén a Callback onResponse/onFailure metódusa, amiben frissítjük a UI-t; a modern megoldás pedig a Kotlin Coroutine, ahol a háttérmunka után Dispatchers.Main-en frissítünk."
      },
      {
        question: "Milyen engedély-kategóriák vannak Androidon, és hogyan kell kezelni a veszélyes engedélyeket?",
        answer: "Két kategória van. A normál engedélyeket (kis kockázat, pl. INTERNET) a rendszer automatikusan megadja a Manifestben felsoroltak alapján – nem kell külön kérni. A veszélyes engedélyeket (érzékeny adat/művelet, pl. kamera, helyzet, névjegyzék) Android 6 (API 23) óta futásidőben, kódból kell elkérni a felhasználótól, aki bármikor vissza is vonhatja. A veszélyes engedély kezelésének lépései: (1) felvesszük a Manifestbe (<uses-permission>); (2) ellenőrizzük, megvan-e már: ContextCompat.checkSelfPermission(...) == PERMISSION_GRANTED; (3) opcionálisan, ha a user korábban elutasította, indoklást mutatunk (shouldShowRequestPermissionRationale); (4) elkérjük: ActivityCompat.requestPermissions(this, permissions, requestCode); (5) az eredményt az onRequestPermissionsResult callbackben dolgozzuk fel a grantResults alapján. Compose-ban a rememberLauncherForActivityResult vagy az Accompanist rememberPermissionState használható."
      }
    ],
    flashcards: [
      {
        question: "TCP vs UDP",
        answer: "TCP: kapcsolat-orientált, megbízható (garantált, sorrendhelyes), lassabb. UDP: kapcsolatmentes, gyors, nem garantált kézbesítés."
      },
      {
        question: "Engedély-kategóriák",
        answer: "Normál (a rendszer automatikusan megadja, pl. INTERNET) és veszélyes (futásidőben, kódból kell kérni, pl. CAMERA)."
      },
      {
        question: "Retrofit lényege",
        answer: "OkHttp-re épülő REST library; a kéréseket annotációkkal írjuk le, a JSON<->objektum konverziót automatikusan végzi (call.enqueue Callback)."
      }
    ]
  },
  {
    id: 16,
    title: "16. Jetpack Compose, Recomposition, architektúra, háttérfolyamatok, Flow",
    summary: [
      "Jetpack Compose: modern, deklaratív UI-toolkit; a fejlesztő Kotlin kóddal írja le a UI-t (@Composable függvények), a motor generálja a felületet, ami az állapot alapján automatikusan frissül.",
      "Előnyök a View-hoz képest: kevesebb kód, nincs XML layout, nincs UI-widget építés, jobb újrafelhasználhatóság, átjárható a régi View toolkit-tel. Hátrány: új (deklaratív) gondolkodásmód, tanulási görbe.",
      "Layoutok (3 fő): Column (egymás alatt), Row (egymás mellett), Box (egymásra rétegezve). Súlyozás: Modifier.weight; arrangement (fő tengely), alignment (kereszt). Modifier-ek a testreszabáshoz; Slot API/Scaffold.",
      "Alapelvek: deklaratív paradigma – a UI-elemek nem érhetők el objektumként (nincs ID-referencia); a frissítés úgy történik, hogy ugyanazt a Composable-t hívjuk új argumentumokkal. Az állapotot tipikusan a ViewModel tárolja.",
      "Recomposition: a kompozíció újrafuttatása, amikor az állapot változik. Folyamat: interakció -> esemény -> logika -> állapotváltozás -> minden, az állapottól függő Composable újrahívódik. Intelligens: csak azt rajzolja újra, ami az állapotot használja.",
      "A Compose 5 szabálya: a Composable-k tetszőleges sorrendben és párhuzamosan futhatnak; a Recomposition kihagyja a változatlanokat; optimista (megszakítható); egy Composable nagyon gyakran is futhat -> legyenek idempotensek, mellékhatás-mentesek.",
      "State: remember (tárol a kompozícióban), mutableStateOf (megfigyelhető, írása Recompositiont vált ki), rememberSaveable (túléli a konfiguráció-változást). State Hoisting: az állapotot value + onValueChange párral kiemeljük (a Composable stateless lesz) -> single source of truth.",
      "Side effects: nem UI-jellegű műveletek szabályozott elkülönítése. SideEffect (minden recomposition után), LaunchedEffect (coroutine a kompozícióhoz kötve, kulcs változására újra), DisposableEffect (belépéskor + onDispose takarítás).",
      "Architektúra: MVVM (ViewModel = logika, View = @Composable, Model = repository) vagy MVI (Model/View/Intent, az állapotokat sealed class sorolja fel, a ViewModel MutableStateFlow-ban tartja, a UI collectAsStateWithLifecycle-lel figyeli).",
      "Háttérfolyamatok: Thread (drága) helyett Coroutine (olcsó, aszinkron de szekvenciálisan leírt; viewModelScope.launch, Dispatchers.IO/Default/Main, withContext, suspend függvény). Lazy loading: LazyColumn/Row/Grid – csak a látható elemeket rendereli.",
      "Flow: egymás után több értéket kibocsátó aszinkron adatfolyam (szemben a suspend függvénnyel, ami egyet ad). Producer (pl. repository, flow{ emit }) -> (opc.) intermediate -> consumer (ViewModel/UI, .collect). Élő frissítésekhez (DB, hálózat)."
    ],
    quiz: {
      question: "Mit jelent a Recomposition, és miért hatékony módszer?",
      options: [
        "A Recomposition mindig a teljes felhasználói felületet újrarajzolja az állapot bármilyen változásakor, ezért egyszerű és kiszámítható.",
        "A Recomposition a Composable függvények újrafuttatása az állapotváltozáskor, és azért hatékony, mert intelligensen csak azokat a Composable-eket futtatja újra, amelyek az adott megváltozott állapotot ténylegesen használják, a többit kihagyja.",
        "A Recomposition az alkalmazás újraindítása a memória felszabadításához, amikor túl sok az aktív Composable."
      ],
      correctIndex: 1,
      explanation: "A Recomposition azt jelenti, hogy állapotváltozáskor a Compose újra meghívja az érintett @Composable függvényeket új argumentumokkal. A teljes UI-fa újrarajzolása drága lenne (CPU, akku), de a Recomposition okos: kihagyja azokat a Composable-eket és lambdákat, amelyeknek nem változott a bemenete, és csak azt frissíti, ami a megváltozott állapotot használja. Ezért legyen minden Composable idempotens és mellékhatás-mentes (a Recomposition akár meg is szakítható, párhuzamosan vagy gyakran is futhat)."
    },
    oralQuestions: [
      {
        question: "Mi a State Hoisting, és milyen előnyei vannak?",
        answer: "A State Hoisting (állapot-kiemelés) egy minta a Composable állapotmentessé (stateless) tételére. Egy belső állapotot tároló (remember-t használó) Composable stateful; ezt úgy tehetjük statelessé, hogy az állapotváltozót két függvény-argumentummal váltjuk ki: value: T (a megjelenítendő érték) és onValueChange: (T) -> Unit (az esemény, amit kívülről kapunk meg), így az állapot felkerül a hívóhoz (akár egy ViewModelbe). Előnyei: single source of truth (az állapot nincs duplikálva, kevesebb hiba); egységbe zártság (csak a tulajdonos módosítja); megoszthatóság (több Composable is megkaphatja ugyanazt az állapotot); elfoghatóság (a hívó dönthet az események kezeléséről); és leválaszthatóság (az állapot ViewModelbe helyezhető, így a Composable tisztán a megjelenítésért felel)."
      },
      {
        question: "Milyen módszereket ismer folyamatok háttérben történő végrehajtására Compose/Kotlin környezetben, és mire való a Flow?",
        answer: "Mivel a UI-t csak a fő szálon szabad módosítani, a hosszú munkát háttérbe kell tenni. A klasszikus Thread drága létrehozni és nem szekvenciális kóddal írható le. A modern megoldás a Kotlin Coroutine: aszinkron, nem blokkoló kód, de szekvenciálisan leírva, olcsón és nagy számban indítható. Egy CoroutineScope (pl. viewModelScope) kezeli őket; a launch indít, a Dispatcher dönti el a szálat (Dispatchers.IO az I/O-hoz, Default a CPU-intenzív munkához, Main a UI-hoz), a withContext(Dispatchers.IO) pedig csak egy adott részt visz háttérre. A suspend (felfüggeszthető) függvény nem blokkolja a hívó szálat. Compose-specifikusan a LaunchedEffect indít coroutine-t a kompozícióhoz kötve. A Flow egy olyan típus, amely egymás után TÖBB értéket bocsát ki (szemben a suspend függvénnyel, ami egyet ad vissza); coroutine-okra épülő aszinkron adatfolyam. Arra való, hogy folyamatosan változó adatot kezeljünk (pl. élő DB-frissítés, periodikus hálózati lekérés): egy producer emitálja az értékeket (pl. a repository), egy consumer pedig a .collect-tal feldolgozza (pl. a ViewModel/UI)."
      }
    ],
    flashcards: [
      {
        question: "remember vs rememberSaveable",
        answer: "Mindkettő megőrzi az állapotot a recompositionök között; a rememberSaveable ezen felül túléli a konfiguráció-változást (pl. képernyő-elforgatás) is."
      },
      {
        question: "MVVM elemei Compose-ban",
        answer: "ViewModel (üzleti logika, állapot), View (@Composable, ami megfigyeli az állapotot), Model (entitások/repository)."
      },
      {
        question: "Flow vs suspend függvény",
        answer: "A suspend függvény egyetlen értéket ad vissza; a Flow egymás után több értéket bocsát ki (aszinkron adatfolyam) – élő frissítésekhez."
      }
    ]
  }
];
