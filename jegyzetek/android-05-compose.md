# Jegyzet – Android 05: Jetpack Compose

## Compose alapok
- **Modern, deklaratív UI-toolkit**: a fejlesztő **Kotlin kóddal** írja le a UI paramétereit, a Compose motor generálja a felületet. A UI **az állapot alapján** automatikusan frissül; az erőforrások (képek) ugyanúgy használhatók.
- **Előnyök**: kevesebb kód; **nincs XML layout**; nincs UI-widget építés; a UI-elemek kódból készülnek; jobb újrafelhasználhatóság; **átjárható a régi View toolkit-tel**.
- **Composable függvény**: `@Composable` annotáció; UI-elemeket állít elő, egymásba ágyazhatók. Activity: `ComponentActivity` leszármazott, `onCreate`-ben **`setContent { MaterialTheme { ... } }`** (a `setContentView` helyett).
- **Esemény**: pl. `Button(onClick = { ... }, modifier = Modifier.padding(...)) { Text("...") }`.
- **Input**: `TextField(value = ..., onValueChange = { ... })`. **Fragmentben**: `ComposeView(...).apply { setContent { ... } }`.
- **Preview**: `@Preview` → Android Studio előnézet kódíráskor (több is lehet, paraméterezhető).

## Layoutok
- Egy `@Composable` egy vagy több UI-elemet bocsát ki; elrendezés-útmutatás nélkül a Compose egymásra teszi őket (olvashatatlan). **Három fő layout**:
  - **Column** – elemek egymás alatt; fő tengely vertikális.
  - **Row** – elemek egymás mellett; fő tengely horizontális.
  - **Box** – elemek egymásra (rétegezve).
- **Súlyozás**: `Modifier.weight(...)` Column/Row gyerekein (~arányos kitöltés).
- **Arrangement** (fő tengely menti elrendezés): Column → `verticalArrangement`; Row → `horizontalArrangement`.
- **Alignment** (keresztirányú igazítás): Column → `horizontalAlignment`; Row → `verticalAlignment`. (Box: `Modifier.align(Alignment.X)`.)
- **Slot API** (pl. **Scaffold**): üres helyek/konténerek (slotok) a felületen – topBar, bottomBar, floatingActionButton, drawerContent, content.

## Modifier-ek
- A Composable elemek **díszítésére/kiegészítésére**, az elrendezés testreszabására; **típusbiztosak**. Pl. `Modifier.padding(...).fillMaxWidth().clickable {...}.size(...).clip(...).background(...).border(...)`.
- `Text` stílus: `fontSize`, `fontWeight`, `fontStyle`, `color`, `style = TextStyle(...)`. Hibajelzés `OutlinedTextField`-nél: `isError`, `trailingIcon` (warning ikon).

## Compose alapelvek
- **Deklaratív paradigma**: a UI-elemek **nem érhetők el objektumként** (nincs ID-alapú referencia, nem módosítjuk őket direktben). A frissítés úgy zajlik, hogy **ugyanazt a Composable függvényt hívjuk meg más argumentumokkal**. Az állapotot tipikusan a **ViewModel** tárolja.
- **Definíciók**: **Composition** (a Compose által épített UI leírása); **Initial Composition** (a Composable-k első futtatása); **Recomposition** (a kompozíció újrafuttatása, amikor az adat/állapot változik).
- **Dinamikus UI**: a Composable Kotlin-függvény, használhat `if`-et (mit mutasson), ciklust (több elem), segédfüggvényt – a Kotlin teljes rugalmassága.

## Recomposition
- **Folyamat**: felhasználói interakció (pl. `onClick`) → **esemény** → az üzleti logika reagál → **állapot változik** → **minden ettől az állapottól függő Composable újrahívódik** (= Recomposition).
- **Intelligens**: csak azokat rajzolja újra, amelyek a megváltozott állapotot **használják** (a teljes fa újrarajzolása CPU/akku szempontból drága lenne).
- **A Compose 5 szabálya**:
  1. A Composable-k **bármilyen sorrendben** végrehajthatók.
  2. A Composable-k **párhuzamosan** futtathatók (több mag).
  3. A Recomposition **kihagyja a lehető legtöbb** Composable-t/lambdát (amelynek nem változott paramétere).
  4. A Recomposition **optimista** – menet közben **leállítható/újraindítható** (ezért legyen minden Composable **idempotens, mellékhatás-mentes**).
  5. Egy Composable **nagyon gyakran is futhat** (akár animáció minden képkockáján) → ha adat kell, **paraméterként** adjuk át, a költséges munkát tegyük más szálra.

## State és State Hoisting
- **State**: minden idővel változó érték (Room DB-től egy osztályváltozóig). A frissítés egyetlen módja: ugyanazt a Composable-t új argumentumokkal hívni → minden állapotfrissítés **Recomposition**.
- **`remember`**: objektumot tárol a kompozícióban (Initial Composition-kor számolja, Recomposition-kor visszaadja); elfelejti, ha a Composable kikerül a kompozícióból.
- **`mutableStateOf`**: megfigyelhető **`MutableState<T>`**; az érték módosítása **Recomposition**-t vált ki ott, ahol megfigyelik. Tipikus: `var name by remember { mutableStateOf("") }`.
- **`rememberSaveable`**: a `remember`-rel ellentétben **túléli a konfiguráció-változást** (Activity config change).
- **Stateful vs Stateless**: a `remember`-t használó Composable **stateful** (belső állapot). **Stateless** elérése: **State Hoisting**.
- **State Hoisting**: minta a Composable állapotmentessé tételére – az állapotváltozót **két argumentummal** váltjuk ki: **`value: T`** (megjelenítendő érték) és **`onValueChange: (T) -> Unit`** (esemény, amit kívülről kapunk). Az állapot a hívóba (vagy ViewModelbe) kerül.
- **Előnyei**: **single source of truth** (nincs duplikáció → kevesebb hiba); **egységbe zárt** (csak a tulajdonos módosítja); **megosztható**; **elfogható**; **leválasztható** (állapot ViewModelbe).

## Side effects (mellékhatások)
- **Nem UI-jellegű** műveletek, amelyek **szabályozottan** változtatják az állapotot a Composable-n kívül (pl. DB-frissítés, hálózati hívás) – el kell különíteni a UI-renderelési logikától. Előny: jobb teljesítmény/kódszervezés/hibakeresés.
- **`SideEffect`**: minden **sikeres recomposition után** lefut (pl. logolás).
- **`LaunchedEffect(key)`**: a **kompozícióba lépéskor** (és ha a **kulcs** változik, újra) futtat egy lambdát egy **coroutine scope**-ban; automatikusan törli a coroutine-t, ha a kompozíció inaktív. Hosszú műveletekhez (hálózat, animáció) a UI-szál blokkolása nélkül. Ha `key1 = Unit`, csak az **Initial Composition**-kor fut.
- **`DisposableEffect`**: a Composable **első megjelenésekor** futtat egy SideEffect-et, és **`onDispose`**-t a Composable **eltávolításakor** – erőforrások felszabadítására (eseményfigyelő, animáció).

## ViewModel és architektúra
- **ViewModel**: a felelősségek szétválasztása; **állapotokat** tárol, amiket a UI (`@Composable`) **megfigyel**. Esemény (pl. gombnyomás) → ViewModel metódus → logika (pl. DB-lekérdezés) → állapotfrissítés → **Recomposition**.
- **MVVM** (Model-View-ViewModel): **ViewModel** (üzleti logika, vezérlés), **View** (`@Composable`/Activity/Fragment), **Model** (entitások/repository).
- **MVI** (Model-View-Intent): **Model** (adat lekérése/elérhetővé tétele), **View** (`@Composable`), **Intent** (cselekvés/esemény – nem az Android SDK Intent osztálya!). Tipikus: az állapotokat **sealed class** sorolja fel (pl. `Loading`/`Error`/`Result`); a ViewModel **`MutableStateFlow`**-ban tartja, a UI **`collectAsStateWithLifecycle()`**-lel figyeli, és **`when (state)`** alapján rendereli.

## Navigáció
- Hasonló az ismert navigációs gráfhoz – **"Screen"-ek** közt váltunk. Elemei: **NavHost** (üres konténer, benne váltakoznak a nézetek), **NavController** (`rememberNavController()`, vezérli a navigációt), **composable("route") { Screen() }** útvonalak, `startDestination`.
- **Paraméterek**: `composable("profile/{userId}", arguments = listOf(navArgument("userId"){ type = NavType.StringType }))`, kiolvasás `navBackStackEntry.arguments?.getString(...)`. **Opcionális argumentum**: `?userId={userId}` + `defaultValue`. ViewModelben **`SavedStateHandle`**-ön át. Beágyazott gráfok, deep linkek is. A route/argument konstansokat érdemes **külön fájlba** (`sealed class Screen(val route)`).

## Dialógusok
- **AlertDialog** Composable: a megjelenítés **állapotát** (`show: Boolean`) és az eseménykezelőket (`onDismiss`, `onConfirm`) **argumentumként** veszi át; `if (show) AlertDialog(onDismissRequest, title, text, confirmButton, dismissButton)`. A dialógus akkor jelenik meg, ha a `showDialog` állapot változik (`var showDialog by rememberSaveable { mutableStateOf(false) }`).

## Listák – Lazy loading
- **Csak a látható elemeket** rendereli: **`LazyColumn`**, **`LazyRow`**, **`LazyVerticalGrid`**, `LazyHorizontalGrid`. Elemek: `items(lista) { elem -> ... }` (az `androidx.compose.foundation.lazy.items` importja néha kézzel kell). Pl. `data class Student(...)` + `StudentsList` `LazyColumn`-nal + `StudentCardSimple` (Card).

## Szálkezelés és coroutine-ok
- **Párhuzamos** futás: feladatok egyszerre, több CPU-magon, magonként egy szállal. **Konkurens**: úgy tűnik, párhuzamos, de közös szálhalmazon, időben felosztva.
- **Szál (Thread)**: konkurens; sok indítható (~1 MB/szál a JVM-en). Blokkolható CPU-intenzív feladattal vagy blokkoló I/O-val. **Drága** létrehozni.
- **Coroutine** (co + routines = cooperating functions): a Kotlin konkurens megoldása – **aszinkron, nem blokkoló** kód, **szekvenciálisan** leírva; **olcsó** (a szálak számának sokszorosa indítható); egy vagy több szálon fut.
  - **CoroutineScope** kezeli a kapcsolódó coroutine-okat (pl. **`viewModelScope`**). **`launch`** hozza létre és küldi a megfelelő **Dispatcher**-nek. **`withContext(Dispatchers.IO)`**-val csak egy adott rész kerül háttérszálra (UI a fő szálon marad).
  - **Suspending (felfüggeszthető) függvény**: nem blokkolja a hívó szálat; elindítható, **felfüggeszthető** (paused), folytatható; felfüggesztve nem foglalja a szálat.
  - **Dispatcherek**: **`Dispatchers.Default`** (CPU-intenzív, magonként egy szál), **`Dispatchers.IO`** (I/O-intenzív), `Dispatchers.Main` (UI).

## Flow
- **Flow**: olyan típus, amely **egymás után több értéket** bocsát ki (szemben a suspend függvénnyel, ami egyet ad vissza). Coroutine-okra épül, **aszinkron** adatfolyam; a kibocsátott (`emit`) értékek azonos típusúak (pl. `Flow<Int>`). ~iterátor, de suspend függvényekkel, aszinkron (pl. élő DB-frissítés, hálózat anélkül, hogy a fő szálat blokkolná).
- **Szereplők**: **producer** (előállítja az adatot – pl. `flow { while(true){ emit(...); delay(...) } }`, tipikusan a repository), (opc.) **intermediate** (közvetítő, módosítja), **consumer** (felhasználja – pl. a ViewModel/UI **`.collect { ... }`**-tal).

## View és Compose átjárhatóság
- **Compose a View-ból**: layoutban `androidx.compose.ui.platform.ComposeView`, majd `findViewById<ComposeView>(...).setContent { ... }`.
- **View a Compose-ból**: **`AndroidView(factory = { context -> ...inflate(...); binding.root }, update = { })`**.
