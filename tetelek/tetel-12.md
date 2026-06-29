# 12. tétel – Activity életciklus, Back Stack, Intent mechanizmus

> Ismertesse az Androidos Activity fogalmát, és vázolja fel az Activity életciklust! Milyen átmenetek milyen eseményeket váltanak ki? Mi történik, ha az egyik Activity elindít egy másikat, milyen sorrendben hívódnak meg az életciklus függvények? Milyen feladatok szükségesek az életciklusok váltásakor? Ismertesse az Activity Back Stack fogalmát és működését! Ismertesse az Android platform Intent mechanizmusát! Milyen típusú Intent-ek léteznek, mikre szokták tipikusan használni? Hogyan lehet beépített alkalmazásokat indítani Intent-ek segítségével?

*(Forrás: Android 02 – Activity, Intent, UI, View)*

---

## 1. Az Activity fogalma

- Az **Activity** tipikusan **egy képernyő**, amin a felhasználó valamilyen műveletet végez (login, beállítások, térkép). Leginkább egy **ablakként** képzelhető el (teljes képernyős vagy pop-up).
- Egy alkalmazás tipikusan több, **lazán csatolt** Activity-ből áll; általában van egy **"fő" Activity** (innen érhető el a többi, ez jelenik meg indításkor). Bármelyik Activity indíthat újabbat.

## 2. Activity életciklus és állapotok

Egy Activity **3 fő állapota**:
- **Resumed (running)**: előtérben van, a focus rajta.
- **Paused**: él, de egy másik Activity előrébb van, ám ez még részben látszik (áttetsző/pop-up). Extrém alacsony memóriánál a rendszer felszabadíthatja.
- **Stopped**: él, de egyáltalán nem látszik. Alacsony memóriánál felszabadítható.

### Életciklus-callback függvények és átmenetek
A rendszer **"hook" jellegű** callback függvényeken keresztül értesít az állapotváltásokról. **Az ősosztály implementációját mindig meg kell hívni** (`super.onCreate()` stb.) – a rendszer felelőssége a hívás, a fejlesztőé a helyes implementáció.

| Függvény | Mikor / mit váltson ki |
|----------|------------------------|
| **`onCreate()`** | Létrehozáskor: állapotok beállítása, layout, munkaszálak. |
| **`onStart()`** | Az Activity láthatóvá válik (pl. BroadcastReceiverre feliratkozás). |
| **`onResume()`** | Előtérbe kerül, a felhasználó kezelheti a vezérlőket. |
| **`onPause()`** | Háttérbe kerül, de részben látszik (pop-up, sleep). Itt érdemes pl. menteni DB-be. |
| **`onStop()`** | Már nem látható (pl. leiratkozás). Élete során többször válthat látható/nem látható közt. |
| **`onRestart()`** | Stop utáni újraindításkor (az onStart előtt). |
| **`onDestroy()`** | Megsemmisülés előtt: erőforrások felszabadítása. |

Csoportosítás: **Teljes élettartam** (onCreate→onDestroy), **Látható** (onStart→onStop), **Előtér** (onResume→onPause).

A rendszer Paused/Stopped állapotban memóriaigény esetén bármikor bezárhatja (`finish()` vagy process leállítás); újranyitáskor újra létrehozza.

### Állapot mentése (feladatok az életciklus-váltáskor)
- **`onSaveInstanceState()`**: a rendszer hívja, mielőtt az Activity sebezhetővé válna a bezárásra (tipikusan onPause/onStop előtt). **Bundle**-be lehet menteni, amit `onCreate()` (vagy `onRestoreInstanceState()`) megkap.
- Nincs garancia a meghívására (pl. "Vissza" gombnál nincs – ott a user végzett). **Belső változókat és UI-elemek értékét** mentjük ide, **NEM perzisztens adatot**. Tesztelés: képernyő-elforgatással.
- **Konfiguráció-változásnál** (orientáció, nyelv, billentyűzet) a rendszer **újraindítja** az Activity-t (`onDestroy()` → `onCreate()`), hogy az új konfigurációhoz tölthessen erőforrást – ezért fontos itt az állapotmentés.

## 3. Activity → Activity váltás sorrendje

Ha A elindítja B-t, a callback-ek **sorrendje**:
1. **A `onPause()`** (A háttérbe kerül),
2. **B `onCreate()`, `onStart()`, `onResume()`** (B-re kerül a focus),
3. **A `onStop()`** (A már nem látható).

Következmény: ha B az A által elmentett adatot olvas (pl. DB-ből), a mentésnek **A `onPause()`-ában** kell megtörténnie, hogy B aktuális adatot lásson.

## 4. Activity Back Stack

- Egy feladathoz a felhasználó több Activity-t használ; a rendszer ezeket egy **Back Stack** veremben tárolja – **Last In, First Out**.
- Az **előtérben lévő Activity a verem tetején** van. Új Activity indításakor az kerül a tetejére (a régi lejjebb csúszik). A **Vissza gomb** a verem tetejéről veszi le az aktuálisat, és az alatta lévő jelenik meg.
- Az alapértelmezett viselkedés általában elég, de felülírható (pl. Back Stack törlése): a **Manifest `<activity>`** elemében, vagy a **`startActivity(...)`** flag-jeivel. Módosítás után tesztelni kell a navigációt/UX-et.

## 5. Intent mechanizmus

Az Android appok **sandboxban** futnak (külön ART VM), kritikus művelethez engedély kell (adatvédelem). Az app **komponensek halmaza**, és a komponensek **akár alkalmazások között is** kommunikálhatnak. Kommunikációs formák: **Intent** (két komponens közt), **Broadcast Intent** (egyből mindenkinek), **Content Provider** (adatmegosztás).

**Az Intent mindig az Android runtime-on keresztül** jut el a célhoz (sosem közvetlenül).

### Mi az Intent?
- **Passzív adatstruktúra** (~struct), ami **késői (futásidejű) kötést** valósít meg a komponensek (Activity, Service, Broadcast Receiver) között. Az **elvárt vagy bekövetkezett esemény** absztrakt leírása.
- **Részei**: Component name (cél osztály; ha üres, az Android keres megfelelőt), **Action** (esemény), **Data** (URI + MIME típus), **Category**, **Extras** (kulcs-érték párok), **Flags** (indítási opciók).

### Intent típusok és tipikus használat
- **Explicit Intent**: **konkrétan megnevezi a cél komponenst**. Pl. új Activity / Service indítása a saját alkalmazáson belül:
  ```kotlin
  val i = Intent(applicationContext, ListProductsActivity::class.java)
  startActivity(i)
  ```
  (Ha van már példány a memóriában, folytatódik, különben az Android példányosítja.)
- **Implicit Intent**: **a végrehajtandó akciót (és ha kell, az adatot) írja le**, nem a konkrét komponenst. Tipikusan más alkalmazás funkciójának igénybevételére. Ha több app is képes rá → **"Complete action using"** dialógus (ha nincs default, a user választ); ha egyik sem → **ActivityNotFoundException**.

Tipikus használat: következő képernyőre lépés (explicit), zenelejátszó service indítása, beépített funkciók (hívás, névjegyválasztás) elérése (implicit).

### Eredmény visszaadása másik Activity-ből
- **`startActivityForResult(Intent, requestCode)`** – a `requestCode` (int) különbözteti meg a hívásokat.
- A hívott oldal a `finish()` előtt **`setResult(resultCode, intent)`**-tel jelez vissza (`RESULT_OK` = -1, `RESULT_CANCELED` = 0 – Vissza gombnál is, vagy saját kód).
- A hívó oldalon a **`onActivityResult(requestCode, resultCode, extras)`** callback dolgozza fel. Adatátadás: `putExtra(name, value)` / `get<Típus>Extra(name)`.

## 6. Beépített alkalmazások indítása Intenttel

Implicit Intenttel, a megfelelő **Action** (és gyakran egy **Data URI**) megadásával:

```kotlin
// Tárcsázó megnyitása konkrét számmal:
val i1 = Intent(Intent.ACTION_DIAL, Uri.parse("tel:0630-123-4567"))
startActivity(i1)

// Névjegy kiválasztása:
val i2 = Intent(Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI)
startActivity(i2)
```

A saját alkalmazásunk is **kiajánlhatja** a funkcióit mások felé **Intent Filter** segítségével, amit az **AndroidManifestben** kell deklarálni. Ha egy komponensnek **nincs Intent filtere**, csak **explicit** Intentet fogad; **ha van**, akkor **explicit és implicit** Intenteket is.

---

### Kapcsolódó tételek
- Android komponensek, .apk, Manifest: [[tetel-11]].
- Erőforrás-kezelés, minősítők, lokalizáció, Fragment: [[tetel-13]].
