# 16. tétel – Jetpack Compose, Recomposition, architektúra, háttérfolyamatok, Flow

> Ismertesse a Jetpack Compose UI keretrendszert! Mik az előnyei és hátrányai a klasszikus View keretrendszerrel szemben? Milyen Compose Layout-okat ismer? Mik a Compose alapelvei? Ismertesse a Recomposition fogalmát! Ismertessen egy klasszikus architektúrát, amit Jetpack Compose használatakor alkalmazna! Milyen módszereket ismer folyamatok háttérben történő végrehajtására. Mire használható a Flow struktúra?

*(Forrás: Android 05 – Jetpack Compose)*

---

## 1. A Jetpack Compose UI keretrendszer

- **Modern, deklaratív UI-toolkit**: a fejlesztő **Kotlin kóddal** írja le a UI paramétereit (és az adatfüggést), a **Compose motor generálja** a felületet. A UI **az alkalmazás állapota alapján automatikusan frissül**; az erőforrások (képek) ugyanúgy használhatók.
- **Composable függvény**: `@Composable` annotációval jelölt függvény, ami UI-elemeket bocsát ki, és **egymásba ágyazható**. Az Activity `ComponentActivity` leszármazott, `onCreate`-ben a `setContentView` helyett **`setContent { MaterialTheme { ... } }`**.

### Előnyök a klasszikus View keretrendszerhez képest
- **Kevesebb kód**; **nincs szükség XML layoutra**; nincs UI-widget építés; a UI-elemek **kódból** készülnek; **könnyebb újrafelhasználhatóság**; egyszerűbb az állapot szerinti UI-frissítés; **kompatibilis a meglévő View toolkit-tel** (átjárható).

### Hátrányok / megfontolások
- Új gondolkodásmód (deklaratív), tanulási görbe; a régi, ismerős XML-alapú/imperatív kód helyett mást kell tudni. A nem körültekintő használat (mellékhatás a renderelésben, költséges munka a Composable-ben) teljesítményproblémát okozhat.
- (A vizsga-MCQ szerint **NEM** igaz, hogy "minden osztályhoz tartozik egy XML layout" – épp ezt váltja ki a Compose.)

## 2. Compose Layoutok

Egy `@Composable` egy vagy több UI-elemet bocsát ki; elrendezés-útmutatás nélkül a Compose egymásra teszi őket. **Három fő layout**:
- **Column**: elemek **egymás alatt**; fő tengely vertikális.
- **Row**: elemek **egymás mellett**; fő tengely horizontális.
- **Box**: elemek **egymásra rétegezve**.

További elrendezés-eszközök:
- **Súlyozás**: `Modifier.weight(...)` a Column/Row gyerekein (arányos kitöltés).
- **Arrangement** (fő tengely mentén): Column → `verticalArrangement`; Row → `horizontalArrangement`.
- **Alignment** (keresztirányú igazítás): Column → `horizontalAlignment`; Row → `verticalAlignment`; Box → `Modifier.align(...)`.
- **Modifier-ek**: az elemek díszítésére/elrendezés testreszabására (típusbiztos): `padding`, `fillMaxWidth/Size`, `size`, `clip`, `background`, `border`, `clickable`…
- **Slot API / Scaffold**: üres slotok (topBar, bottomBar, FAB, drawer, content), amelyeket kitöltünk.

## 3. Compose alapelvek

- **Deklaratív paradigma**: a UI-elemek **nem érhetők el objektumként** (nincs ID-alapú referencia, nem módosítjuk őket direktben). A frissítés úgy történik, hogy **ugyanazt a Composable függvényt hívjuk meg más argumentumokkal** – ezek a UI-állapot reprezentációi.
- Az **állapotot** tipikusan a **ViewModel** tárolja és adja át a Composable-knek; az adat **lefelé** áramlik a hierarchiában.
- **Dinamikus UI**: a Composable Kotlin-függvény → használható benne `if` (mit mutasson), ciklus (több elem), segédfüggvény – a Kotlin teljes rugalmassága (szemben a statikus XML-lel).

## 4. Recomposition

- **Fogalom**: a kompozíciók **újrafuttatása** a felület frissítéséhez, amikor az adat/állapot megváltozik. (Initial Composition = a Composable-k első futtatása.)
- **Folyamat**: felhasználói interakció (pl. `onClick`) → **esemény** → az üzleti logika reagál → **egy vagy több állapot megváltozik** → **minden, az adott állapottól függő Composable újrahívódik** (= Recomposition).
- **Miért hatékony?** A teljes UI-fa újrarajzolása CPU/akku szempontból drága lenne, de a **Recomposition intelligens**: csak azokat a függvényeket/lambdákat futtatja újra, amelyek **esetleg megváltoztak** (használják a megváltozott állapotot), a többit **kihagyja** (amelynek nem változott a paramétere).
- **A Compose 5 szabálya** (ezért lehet hatékony):
  1. A Composable-k **bármilyen sorrendben** végrehajthatók.
  2. A Composable-k **párhuzamosan** futtathatók (kihasználja a több magot).
  3. A Recomposition **kihagyja a lehető legtöbb** Composable-t/lambdát.
  4. A Recomposition **optimista** (menet közben **leállítható/újraindítható** új paraméterrel).
  5. Egy Composable **nagyon gyakran is futhat** (akár animáció minden képkockáján).
- **Következmény**: minden Composable legyen **önálló, idempotens és mellékhatás-mentes**; ha adat kell, **paraméterként** adjuk át; a költséges munkát tegyük **más szálra**, a Compose-on kívülre.

## 5. Klasszikus architektúra Compose-szal: MVVM (és MVI)

A felelősségek szétválasztása külön modulokra. Kulcselem a **ViewModel**, amely **állapotokat** tárol, amiket a UI (`@Composable`) **megfigyel**: esemény (pl. gombnyomás) → ViewModel metódus → logika (pl. DB-lekérdezés) → **állapotfrissítés** → **Recomposition** (csak a megfelelő részek rajzolódnak újra).

- **MVVM (Model-View-ViewModel)**:
  - **ViewModel**: üzleti logika, vezérlés (orchestration).
  - **View**: `@Composable` (vagy Activity/Fragment).
  - **Model**: entitások / repository.
- **MVI (Model-View-Intent)**:
  - **Model**: adat lekérése/elérhetővé tétele (helyi/távoli forrás).
  - **View**: a `@Composable` UI-réteg.
  - **Intent**: cselekvés/esemény végrehajtása (**nem** az Android SDK Intent osztálya!).
  - Tipikus: az állapotokat **sealed class** sorolja fel (pl. `Loading` / `Error` / `Result`); a ViewModel **`MutableStateFlow`**-ban tárolja; a UI **`collectAsStateWithLifecycle()`**-lel figyeli és **`when (state)`** alapján rendereli (Loading → progress, Error → hibaüzenet, Result → lista).

## 6. Háttérben történő végrehajtás

Mivel a UI-t csak a fő szálon szabad módosítani, a hosszú munkát háttérbe kell tenni:
- **Thread**: konkurens futás; sok indítható, de **drága** létrehozni; nem szekvenciális kód.
- **Coroutine** (a modern megoldás): **aszinkron, nem blokkoló** kód, de **szekvenciálisan leírva**; **olcsó** (a szálak számának sokszorosa indítható); egy/több szálon fut.
  - **CoroutineScope** kezeli a kapcsolódó coroutine-okat (pl. **`viewModelScope`**).
  - **`launch`** indítja a coroutine-t a megfelelő **Dispatcher**-en.
  - **Dispatcherek**: **`Dispatchers.IO`** (I/O-intenzív), **`Dispatchers.Default`** (CPU-intenzív, magonként egy szál), `Dispatchers.Main` (UI).
  - **`withContext(Dispatchers.IO)`**: csak egy adott részt visz háttérszálra (a UI-frissítés a fő szálon maradhat).
  - **suspend (felfüggeszthető) függvény**: nem blokkolja a hívó szálat; elindítható, **felfüggeszthető**, folytatható; felfüggesztve nem foglalja a szálat.
- **Compose-specifikus**: **`LaunchedEffect`** (coroutine a kompozícióhoz kötve – hosszú művelet/hálózat a UI-szál blokkolása nélkül), **`DisposableEffect`** (erőforrás fel- és leiratkozás).

## 7. Flow – mire való és hogyan használjuk

- **Flow**: olyan típus, amely **egymás után több értéket** bocsát ki (szemben a suspend függvénnyel, ami **egyetlen** értéket ad vissza). Coroutine-okra épül; **aszinkron** adatfolyam; a kibocsátott (`emit`) értékek **azonos típusúak** (pl. `Flow<Int>`).
- **Mire jó?** Folyamatosan érkező/változó adatok kezelése (pl. **élő frissítések egy adatbázisból**, periodikus hálózati lekérés) anélkül, hogy a fő szálat blokkolná. ~iterátor, de suspend függvényekkel, aszinkron értéktermeléssel.
- **Szereplők**: **producer** (előállítja az adatot – pl. `flow { while(true){ emit(...); delay(...) } }`, tipikusan a **repository**); (opcionális) **intermediate** (közvetítő, módosítja a folyamot); **consumer** (felhasználja – pl. a **ViewModel/UI**, ami **`.collect { ... }`**-tal begyűjti).
- **Compose-ban**: a ViewModel `MutableStateFlow` állapotot ad ki, a `@Composable` `collectAsStateWithLifecycle()`-lel figyeli → állapotváltozáskor Recomposition.

---

### Kapcsolódó tételek
- Activity/Fragment életciklus, View alapok: [[tetel-12]], [[tetel-13]].
- Hálózati kommunikáció, coroutine a háttérmunkához: [[tetel-15]].
- Promise/async-await (JS oldali párhuzam): [[tetel-04]].
