# Jegyzet – Android 02: Activity, Intent, UI, View

## Activity életciklus
- Az Activity ~egy képernyő / ablak; egy app több, **lazán csatolt** Activity-ből áll, van egy "fő" Activity (indításkor ez jelenik meg). Bármelyik indíthat újabbat.
- **3 fő állapot**: **Resumed/Running** (előtérben, focus rajta), **Paused** (él, de másik van előrébb, ez még részben látszik – pop-up/áttetsző; extrém alacsony memóriánál felszabadítható), **Stopped** (él, de nem látszik; alacsony memóriánál felszabadítható).
- **Életciklus-callback függvények** (a rendszer hívja, "hook"; **mindig meg kell hívni a `super`-t**; a fejlesztő felelőssége a helyes implementáció):
  - **`onCreate()`** – létrejön, beállítja az állapotokat (layout, munkaszálak).
  - **`onStart()`** – láthatóvá válik (pl. BroadcastReceiverre feliratkozás).
  - **`onResume()`** – előtérbe kerül, a felhasználó kezelheti.
  - **`onPause()`** – háttérbe kerül, de részben látszik (pl. pop-up, sleep). Itt érdemes pl. DB-mentés.
  - **`onStop()`** – már nem látható (pl. leiratkozás). Az Activity élete során többször válthat látható/nem látható közt.
  - **`onRestart()`** – stop után, újraindításkor (onStart előtt).
  - **`onDestroy()`** – megsemmisülés előtt, erőforrások felszabadítása.
- Csoportosítás: **Teljes** (create→destroy), **Látható** (start→stop), **Előtér** (resume→pause).
- **Bezárás a rendszer által**: Paused/Stopped állapotban memória miatt bármikor (finish() vagy process leállítás). Újranyitáskor újra létrejön.

## Állapot mentése
- **`onSaveInstanceState()`**: a rendszer hívja, mielőtt az Activity sebezhetővé válik a bezárásra (tipikusan onPause/onStop előtt). **Bundle**-be lehet menteni, amit `onCreate()` (vagy `onRestoreInstanceState()`) megkap.
- **Nincs garancia**, hogy meghívódik (pl. "Vissza" gombnál nem – ott a user végzett). Belső változók/UI-elemek értékét mentjük, **NEM perzisztens adatot**. A `super`-t hívni kell. A rendszer alapból is ment bizonyos szinten. Tesztelés: **képernyő-elforgatás**.
- **Konfiguráció-változás** (orientáció, billentyűzet, nyelv): a rendszer **újraindítja** az Activity-t (onDestroy → onCreate), mert új erőforrásokat tölthet be. Itt jön be az állapotmentés.

## Activity váltás és Back Stack
- **A→B váltás callback-sorrend**: A.`onPause()` → B.`onCreate()`,`onStart()`,`onResume()` → A.`onStop()`. (Ha A adatot ment, amit B olvas, akkor A.onPause()-ban kell menteni.)
- **Back Stack**: a rendszer az Activity-ket veremben tárolja (**LIFO**). Az előtérben lévő a verem tetején; új Activity indításakor az kerül felülre; **Vissza** gomb a tetejéről vesz le. Az alapértelmezett viselkedés felülírható (Manifest `<activity>`, vagy `startActivity()` flag-ek), de tesztelni kell (UX).
- **Új Activity indítás**: `Intent(this, SecondActivity::class.java)` + `putExtra(...)` + `startActivity(intent)`.

## Komponensek közi kommunikáció – Intent
- Az appok **sandboxban** futnak (külön ART VM), kritikus művelethez engedély kell; cél: adatvédelem. Az app = **komponensek halmaza**, a komponensek **akár appok között is** kommunikálhatnak.
- Formák: **Intent** (két komponens közt), **Broadcast Intent** (egyből mindenkinek, pl. "akku alacsony"), **Content Provider** (adat megosztása, pl. névjegyzék).
- **Az Intent mindig az Android runtime-on keresztül megy** (nem közvetlenül). Küldés: `startActivity`/`startActivityForResult` (Activity), `startService`/`bindService` (Service), `sendBroadcast`/`sendOrderedBroadcast`/… (Broadcast Receiver).

### Intent (szándék)
- **Passzív adatstruktúra** (~struct), **késői (futásidejű) kötés** komponensek között (Activity, Service, Broadcast Receiver). Az **elvárt vagy bekövetkezett esemény** absztrakt leírása.
- **Típusok**: **Explicit** (konkrétan megnevezi a cél komponenst – pl. `Intent(context, ListProductsActivity::class.java)`), **Implicit** (a végrehajtandó feladatot/akciót írja le).
- **Részei**: Component name (címzett osztály; ha üres, az Android keres megfelelőt), **Action** (esemény), **Data** (URI + MIME típus), **Category**, **Extras** (kulcs-érték párok), **Flags** (Activity indítási opciók).

### Eredmény visszaadása
- **`startActivityForResult(Intent, requestCode)`** – a `requestCode` (int) különbözteti meg a hívásokat. A hívott oldal `finish()` előtt **`setResult(resultCode, intent)`**-tel jelez vissza.
- Hívó oldalon **`onActivityResult(requestCode, resultCode, extras)`** callback. resultCode: `RESULT_OK` (-1), `RESULT_CANCELED` (0, Vissza gombnál is), vagy saját (companion objectben konstans).
- **Extras**: feltöltés `intent.putExtra(name, value)`, lekérdezés `intent.get<Típus>Extra(name[, default])`.

### Implicit Intent és Intent Filter
- Implicit: az akciót (és ha kell, az adatot) adjuk meg. Példák: `Intent(ACTION_DIAL, Uri.parse("tel:..."))`, `Intent(ACTION_PICK, ContactsContract.Contacts.CONTENT_URI)`.
- Több célpont: **"Complete action using"** dialógus (ha nincs default, a user választ); ha nincs egy sem → **ActivityNotFoundException**.
- **Intent Filter**: a saját komponensünk funkcióit ajánljuk ki vele, az **AndroidManifestben** deklarálva. **Nincs filter → csak explicit** Intentet fogad; **van filter → explicit és implicit** Intentet is.

## Erőforrás típusok és lokalizáció
- Gyakori típusok: drawable (kép, XML drawable), hang/videó, UI leíró (layout), animáció, stílus/téma, szöveg, raw.
- **Szöveges erőforrás**: `res/values/strings.xml`, többnyelvűség, paraméterezhető (`%1$d`), használat `getString(R.string..., 14)`.
- **Lokalizáció**: minősítővel (`res/values-hu/`, `res/values-fr/`, `res/drawable-...`). Alapértelmezett könyvtárak: `res/drawable`, `res/layout`, `res/values` – ide esik vissza, ha nincs lokalizált.

## ViewBinding
- A `findViewById` (és a Kotlin synthetic) kiváltása. Bekapcsolás: `buildFeatures { viewBinding = true }`. Minden layouthoz **binding class** generálódik (root + minden id-vel rendelkező View referenciája). Layout kihagyható `tools:viewBindingIgnore="true"`.
- Használat: `binding = ActivityMainBinding.inflate(layoutInflater); setContentView(binding.root); binding.tvHello.text = "DEMO"`.

## Felhasználói felület alapok
- **Több képernyő támogatása**: az Android skáláz/átméretez, a fejlesztő csak a megfelelő erőforrásokat adja meg (egyetlen .apk-ban).
- **Fogalmak**: **képernyőméret** (small/normal/large/xlarge), **sűrűség (dpi)** (ldpi/mdpi/hdpi/xhdpi/…), **orientáció** (portrait/landscape, futásidőben változhat, rögzíthető), **felbontás (px)**.
  - **dp** (density-independent pixel): UI-tervezéshez; 1 dp = 1 px egy **160 dpi**-s képernyőn. **`px = dp * (dpi / 160)`** (pl. 240 dpi → 1 dp = 1.5 px). **sp**: szöveghez, a user szövegméret-beállításával is skálázódik (layout-mérethez sosem).
  - **Sűrűségfüggetlenség**: a UI-elemek fizikai mérete megmarad eltérő sűrűségen (a rendszer skáláz dp alapján és átskálázza a képeket).
- **Erőforrás-választó algoritmus**: a minősítő (postfix, pl. `values-hu`, `layout-large`) alapján; ha nincs pontos, kisebb/alacsonyabbat választ; ha csak nagyobb képernyős erőforrás van, **hiba** (pl. csak xlarge → normal eszközön hiba).

### View hierarchia és Layoutok
- **Minden UI-elem a `View`-ból származik.** A **layoutok `ViewGroup`** leszármazottak (és a ViewGroup is View!), egymásba ágyazhatók; saját View/ViewGroup is készíthető.
- **Layoutok**: **LinearLayout** (≠ lista; **súlyozás**: `weightSum` + `layout_weight`, a mérete 0dp legyen, ~HTML %), **RelativeLayout** (elemek egymáshoz viszonyítva), **ConstraintLayout** (~iOS AutoLayout; lapos hierarchia, nincs egymásba ágyazás; kötelező legalább 1 horizontális és 1 vertikális constraint; szülőhöz/másik view-hoz/baseline-hoz/guideline-hoz), **GridLayout**, **AbsoluteLayout** (NEM használjuk).
- **Padding** (a tartalom és a border közti belső térköz) vs **Margin** (a border körüli külső térköz).
