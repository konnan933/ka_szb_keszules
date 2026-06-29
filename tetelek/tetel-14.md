# 14. tétel – Perzisztens adattárolás, ORM, publikus/privát adatok, listák, RecyclerView

> Ismertesse a perzisztens adattárolási lehetőségeket Android platformon! Melyik megoldásnak mi az előnye? Mit nevezünk ORM-nek és az Android platform ezt milyen eszközökkel támogatja? Hogyan kezelhetjük a publikus és privát adatokat? Milyen módszereket ismer listák kezelésére Android platformon? Mit nevezünk RecyclerView-nak, és mik a használatának előnyei az egyéb módszerekkel szemben? Hogyan oldható meg egyedi listaelemek létrehozása?

*(Forrás: Android 04 – RecyclerView, Persistence, Content Provider)*

---

## 1. Perzisztens adattárolási lehetőségek (és előnyeik)

Gyakorlatilag minden app tárol perzisztens adatot (beállítások, cache, bejelentkezés, fotók…). Androidon minden igényre van beépített megoldás:

| Megoldás | Mire / előnye |
|----------|---------------|
| **SharedPreferences** (/ DataStore) | **Alaptípusok** (int, long, float, String, boolean) tárolása **kulcs-érték párként**. Egyszerű, gyors; beállításokhoz, UI-állapothoz, auto-loginhoz ideális. Megőrzi az értéket app/telefon újraindításkor (fájlban tárol). |
| **Fájlkezelés** | Tetszőleges adat a fájlrendszerben: **internal** (privát, csak az app) vagy **external/SD** (nyilvános). Nagy/bináris adathoz. |
| **SQLite adatbázis** | **Strukturált adathoz** a legjobb: teljes relációs DBMS (SQL, tranzakció, prepared statement). |
| **Hálózat / felhő (BaaS)** | Saját szerver vagy felhő (Firebase…): adat több eszközön, megosztás, real-time. |

- **SharedPreferences** részletek: `MODE_PRIVATE` láthatóság; `getSharedPreferences(name, mode)` vagy `getPreferences(mode)`; olvasás `getInt(KEY, default)`, írás `edit().putInt(KEY, v).commit()`. **Preferences Framework**: XML-alapú Beállítások képernyő (csak SP-szel). **DataStore**: modern utód (Coroutine + Flow, aszinkron).
- **SQLite**: alapból **nincs ORM** fölötte; az elérés fájlrendszer-művelet → lassú lehet → **aszinkron** (külön szál) végezzük. `_id` oszlop kell a ContentProviderhez/Adapterhez.

## 2. ORM és Android-támogatása

- **ORM (Object-Relation Mapping)**: objektumok tárolása relációs adatbázisban. Alapelvek: **osztálynév → tábla**, **objektum → tábla egy sora**, **mező → tábla oszlopa**.
- Az Android a **Room Persistence Library**-vel támogatja (Google ORM-je): **absztrakciós réteg az SQLite felett**, a teljes SQLite-képességekkel. Három fő elem:
  - **`@Entity`** – data class, ami egy táblát ír le (`@PrimaryKey(autoGenerate = true)`, `@ColumnInfo`).
  - **`@Dao`** – interfész az adatműveletekkel: `@Query("SELECT ...")`, `@Insert`, `@Update`, `@Delete`.
  - **`@Database`** – absztrakt `RoomDatabase` osztály (`entities`, `version`, DAO getter); tipikusan singletonként `Room.databaseBuilder(...).build()`.
- A műveleteket háttérszálon, az UI-frissítést `runOnUiThread`-en végezzük. Kapcsolódik: LiveData, ViewModel, Repository (javasolt architektúra).

## 3. Publikus és privát adatok kezelése (fájlrendszer)

Az Android **két lemezterületet** különböztet meg:
- **Internal storage (privát)**: védett tárhely, **kizárólag az app éri el** (se a user, se más app). Írás `openFileOutput(filename, mode)` (`MODE_PRIVATE` felülír, `MODE_APPEND` hozzáfűz); olvasás `openFileInput(filename)` → FileInputStream (`read()`, `close()`). **Cache**: `getCacheDir()` – kevés helynél a rendszer törli (max ~1MB ajánlott). **Statikus fájlok**: `res/raw`-ba, telepítéskor az internal storage-be kerülnek, **read-only**; `resources.openRawResource(R.raw.x)`.
- **External storage (nyilvános, ~SD)**: a felhasználó által is írható-olvasható; **bármikor elérhetetlenné válhat** (USB-storage mód → read-only), a user törölheti/módosíthatja. Használat előtt **`Environment.getExternalStorageState()`** ellenőrzés (`MEDIA_MOUNTED`, `MEDIA_MOUNTED_READ_ONLY`…). Könyvtárak: `getExternalFilesDir(type)` (DIRECTORY_PICTURES, DCIM, MUSIC…); a **MediaScanner** indexeli (kihagyás: `.nomedia` fájl). Engedély: **`WRITE_EXTERNAL_STORAGE`**.
- Adat **kiajánlása másoknak** a fájlrendszer/World-módok helyett inkább **Content Providerrel** ajánlott (lásd lent).

## 4. Listák kezelése – RecyclerView

- Listák megjelenítésére a korszerű megoldás a **RecyclerView** (a régi ListView/GridView helyett).
- **Mi a RecyclerView?** Listák **hatékony kezelésére** szolgáló nézet, amely:
  - **gyors scrollozást** és érintés-gesztusokat (swipe, move) támogat,
  - **kikényszeríti a ViewHolder mintát** a gyors működéshez,
  - **hatékonyan újrafelhasználja** a nézet-elemeket (a legörgetett sorok view-jait újrahasznosítja),
  - **flexibilis** (különböző **LayoutManager**ek: lineáris, grid, staggered grid – tehát nem csak egymás alatti elrendezés).
- **Előnyök** a régi megoldásokkal szemben: a **ViewHolder pattern** kötelező (statikus ViewHolder objektum + cache), így **nincs folyamatos `findViewById`** hívás → gyors, sima görgetés; nagy listáknál is hatékony az újrafelhasználás miatt.

### Lista készítése (lépések)
1. **Data class** (egy elem adatai).
2. **Egy sor layoutja** (XML).
3. **RecyclerView** elhelyezése (hol legyen a lista).
4. **Adapter** (megmondja, mi kerüljön a RecyclerView-ba).

## 5. Egyedi listaelemek létrehozása (Adapter + ViewHolder)

A **`RecyclerView.Adapter<ViewHolder>`** felelős az egyedi listaelemekért:

- **ViewHolder**: a `RecyclerView.ViewHolder`-ből származik, az egy sor (itemView) View-referenciáit tárolja.
  ```kotlin
  class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    val tvName = itemView.tvName
    val btnEdit = itemView.btnEdit
  }
  ```
- **`onCreateViewHolder(parent, viewType)`**: a **saját sor-layoutot** felfújja és ViewHolderbe csomagolja → így lesz egyedi a listaelem:
  ```kotlin
  override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
    val view = LayoutInflater.from(parent.context).inflate(R.layout.row_item, parent, false)
    return ViewHolder(view)
  }
  ```
- **`onBindViewHolder(holder, position)`**: a `position`-höz tartozó adat **beállítása** a ViewHolder nézeteibe, és az eseménykezelők bekötése.
- **`getItemCount()`**: az elemek száma. Hozzáadás/törlés után `notifyItemInserted` / `notifyItemRemoved`.
- **ListAdapter** (újabb): nem kell saját listát kezelni; **DiffUtil**-lal hasonlítja össze az elemeket az optimális újrarajzoláshoz; LiveData-kompatibilis.

## 6. Content Provider (adatmegosztás, kapcsolódó téma)

- **Mire jó?** Strukturált adat **elérési rétege**, ami elfedi a tényleges tárolást, adatvédelmet ad, és **processzek/appok közti adatmegosztást** valósít meg.
- **Elérés**: a **`ContentResolver`** végzi (az IPC átlátszó). Teljes **CRUD**: `query()` → **Cursor**, `insert()` → URI, `update()`/`delete()` → érintett sorok száma.
- **CONTENT_URI**: `content://authority/path`.

---

### Kapcsolódó tételek
- Erőforrás-kezelés, Fragment: [[tetel-13]].
- Hálózati kommunikáció, engedélykezelés: [[tetel-15]].
